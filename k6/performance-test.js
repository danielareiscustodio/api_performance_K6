/**
 * ============================================
 * TESTE DE PERFORMANCE COM K6
 * ============================================
 * 
 * Este script realiza testes de performance na API REST, testando:
 * 1. Autenticação (login) - obtém token JWT
 * 2. Operações CRUD de Tarefas - usando o token de autenticação
 * 
 * Conceitos aplicados:
 * - Stages (ramp-up, carga constante, ramp-down)
 * - Thresholds (limites de performance)
 * - Checks (validações de resposta)
 * - Grupos (organização de testes)
 * - Métricas customizadas (Rate, Trend, Counter)
 * - Relatórios HTML e JSON
 * 
 * Execução:
 *   k6 run k6/performance-test.js
 * 
 * Variáveis de ambiente:
 *   BASE_URL - URL base da API (padrão: http://localhost:3000)
 *   TEST_EMAIL - Email para login (padrão: user@test.com)
 *   TEST_PASSWORD - Senha para login (padrão: user123)
 *   ENV - Ambiente de teste (padrão: test)
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

// ============================================
// CONFIGURAÇÕES E VARIÁVEIS DE AMBIENTE
// ============================================
// Permite configurar a URL da API via variável de ambiente
// Útil para testar em diferentes ambientes (dev, staging, prod)
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

// Credenciais de teste
const TEST_USER = {
  email: __ENV.TEST_EMAIL || 'user@test.com',
  password: __ENV.TEST_PASSWORD || 'user123'
};

// ============================================
// MÉTRICAS CUSTOMIZADAS
// ============================================
// Rate: Taxa de sucesso (0.0 a 1.0) - porcentagem de operações bem-sucedidas
const loginSuccessRate = new Rate('login_success_rate');
const taskCreationSuccessRate = new Rate('task_creation_success_rate');
const taskListSuccessRate = new Rate('task_list_success_rate');
const taskUpdateSuccessRate = new Rate('task_update_success_rate');
const taskDeleteSuccessRate = new Rate('task_delete_success_rate');

// Trend: Tempo de resposta - permite calcular percentis (p50, p95, p99)
const loginTime = new Trend('login_time');
const taskCreationTime = new Trend('task_creation_time');
const taskListTime = new Trend('task_list_time');
const taskUpdateTime = new Trend('task_update_time');
const taskDeleteTime = new Trend('task_delete_time');

// Counter: Contador de erros - total de erros ocorridos
const authErrors = new Counter('auth_errors');
const taskErrors = new Counter('task_errors');

// ============================================
// OPÇÕES DE EXECUÇÃO
// ============================================
/**
 * Configuração do teste de performance:
 * - stages: Define o padrão de carga ao longo do tempo
 *   * Ramp-up: Aumento gradual de usuários (evita sobrecarga inicial)
 *   * Carga constante: Mantém carga estável para análise
 *   * Ramp-down: Redução gradual (permite limpeza de recursos)
 */
export const options = {
  stages: [
    // Fase 1: Ramp-up inicial - Aumentar gradualmente para 5 usuários virtuais em 30 segundos
    // Simula crescimento natural de usuários
    { duration: '30s', target: 5 },
    
    // Fase 2: Carga constante baixa - Manter 5 usuários por 1 minuto
    // Permite verificar comportamento sob carga moderada
    { duration: '1m', target: 5 },
    
    // Fase 3: Ramp-up para carga maior - Aumentar para 10 usuários em 30 segundos
    // Testa como a API se comporta com aumento de carga
    { duration: '30s', target: 10 },
    
    // Fase 4: Carga constante alta - Manter 10 usuários por 1 minuto
    // Testa estabilidade sob carga máxima
    { duration: '1m', target: 10 },
    
    // Fase 5: Ramp-down - Reduzir para 0 usuários em 30 segundos
    // Permite verificar recuperação após carga
    { duration: '30s', target: 0 }
  ],

  // Thresholds: Limites de performance aceitáveis
  thresholds: {
    // 95% das requisições devem ser bem-sucedidas
    http_req_duration: ['p(95)<1000', 'p(99)<2000'], // 95% < 1000ms, 99% < 2000ms
    http_req_failed: ['rate<0.05'], // Taxa de falhas < 5%
    
    // Taxa de sucesso do login deve ser > 90% (considerando que login bem-sucedido = status 200 + token)
    login_success_rate: ['rate>0.90'],
    
    // Taxa de sucesso das operações de tarefas deve ser > 90%
    task_creation_success_rate: ['rate>0.90'],
    task_list_success_rate: ['rate>0.90'],
    task_update_success_rate: ['rate>0.90'],
    task_delete_success_rate: ['rate>0.90'],
    
    // Tempo médio de resposta (ajustado para testes de carga)
    login_time: ['p(95)<1000'], // 95% dos logins < 1000ms
    task_creation_time: ['p(95)<500'], // 95% das criações < 500ms
    task_list_time: ['p(95)<500'], // 95% das listagens < 500ms
    task_update_time: ['p(95)<500'], // 95% das atualizações < 500ms
    task_delete_time: ['p(95)<500'], // 95% das deleções < 500ms
  },

  // Tags para organização e filtragem de métricas
  tags: {
    environment: __ENV.ENV || 'test',
    test_type: 'performance',
    api_version: 'v1'
  }
};

// ============================================
// FUNÇÃO AUXILIAR: FAZER LOGIN
// ============================================
function login(email, password) {
  const loginStartTime = Date.now();
  
  const payload = JSON.stringify({
    email: email,
    password: password
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
    tags: {
      name: 'Login',
      endpoint: '/api/auth/login',
      operation: 'authentication'
    }
  };

  const response = http.post(`${API_BASE}/auth/login`, payload, params);
  const loginDuration = Date.now() - loginStartTime;
  
  // Verificação de sucesso do login (status e token) - determina se continuamos
  const loginSuccess = check(response, {
    'login status is 200': (r) => r.status === 200,
    'login has token': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data && body.data.token !== undefined;
      } catch (e) {
        return false;
      }
    },
  }, { name: 'Login Success Checks' });

  // Verificação de performance (tempo de resposta) - apenas para métricas
  const performanceCheck = check(response, {
    'login response time < 1000ms': (r) => r.timings.duration < 1000,
  }, { name: 'Login Performance Checks' });

  // Registrar métricas
  loginSuccessRate.add(loginSuccess);
  loginTime.add(loginDuration);

  // Se o login falhou (status != 200 ou sem token), abortar
  if (!loginSuccess) {
    authErrors.add(1);
    console.error(`Login failed: ${response.status} - ${response.body}`);
    return null;
  }

  // Se chegou aqui, o login foi bem-sucedido, mesmo que o tempo tenha sido > 500ms
  try {
    const body = JSON.parse(response.body);
    return body.data.token;
  } catch (e) {
    console.error('Error parsing login response:', e);
    authErrors.add(1);
    return null;
  }
}

// ============================================
// FUNÇÃO AUXILIAR: CRIAR TAREFA
// ============================================
function createTask(token) {
  const createStartTime = Date.now();
  
  const priorities = ['low', 'medium', 'high'];
  const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
  
  const payload = JSON.stringify({
    title: `Tarefa de Teste K6 - ${Date.now()}`,
    description: 'Tarefa criada durante teste de performance com K6',
    priority: randomPriority,
    completed: false
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    tags: {
      name: 'Create Task',
      endpoint: '/api/tasks',
      operation: 'create',
      priority: randomPriority
    }
  };

  const response = http.post(`${API_BASE}/tasks`, payload, params);
  const createDuration = Date.now() - createStartTime;
  
  const success = check(response, {
    'create task status is 201': (r) => r.status === 201,
    'create task has task id': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data && body.data.task && body.data.task.id !== undefined;
      } catch (e) {
        return false;
      }
    },
    'create task response time < 500ms': (r) => r.timings.duration < 500,
  }, { name: 'Create Task Checks' });

  taskCreationSuccessRate.add(success);
  taskCreationTime.add(createDuration);

  if (!success) {
    taskErrors.add(1);
    return null;
  }

  try {
    const body = JSON.parse(response.body);
    return body.data.task.id;
  } catch (e) {
    taskErrors.add(1);
    return null;
  }
}

// ============================================
// FUNÇÃO AUXILIAR: LISTAR TAREFAS
// ============================================
function listTasks(token) {
  const listStartTime = Date.now();
  
  const params = {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    tags: {
      name: 'List Tasks',
      endpoint: '/api/tasks',
      operation: 'list'
    }
  };

  const response = http.get(`${API_BASE}/tasks?page=1&limit=10`, params);
  const listDuration = Date.now() - listStartTime;
  
  const success = check(response, {
    'list tasks status is 200': (r) => r.status === 200,
    'list tasks has tasks array': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data && Array.isArray(body.data.tasks);
      } catch (e) {
        return false;
      }
    },
    'list tasks response time < 500ms': (r) => r.timings.duration < 500,
  }, { name: 'List Tasks Checks' });

  taskListSuccessRate.add(success);
  taskListTime.add(listDuration);

  if (!success) {
    taskErrors.add(1);
    return null;
  }

  try {
    const body = JSON.parse(response.body);
    return body.data.tasks;
  } catch (e) {
    taskErrors.add(1);
    return null;
  }
}

// ============================================
// FUNÇÃO AUXILIAR: BUSCAR TAREFA POR ID
// ============================================
function getTaskById(token, taskId) {
  const getStartTime = Date.now();
  
  const params = {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    tags: {
      name: 'Get Task By ID',
      endpoint: `/api/tasks/${taskId}`,
      operation: 'read'
    }
  };

  const response = http.get(`${API_BASE}/tasks/${taskId}`, params);
  const getDuration = Date.now() - getStartTime;
  
  const success = check(response, {
    'get task status is 200': (r) => r.status === 200,
    'get task has task data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data && body.data.task !== undefined;
      } catch (e) {
        return false;
      }
    },
    'get task response time < 500ms': (r) => r.timings.duration < 500,
  }, { name: 'Get Task Checks' });

  taskListTime.add(getDuration);

  if (!success) {
    taskErrors.add(1);
  }

  return success;
}

// ============================================
// FUNÇÃO AUXILIAR: ATUALIZAR TAREFA
// ============================================
function updateTask(token, taskId) {
  const updateStartTime = Date.now();
  
  const payload = JSON.stringify({
    title: `Tarefa Atualizada - ${Date.now()}`,
    completed: true,
    priority: 'high'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    tags: {
      name: 'Update Task',
      endpoint: `/api/tasks/${taskId}`,
      operation: 'update'
    }
  };

  const response = http.put(`${API_BASE}/tasks/${taskId}`, payload, params);
  const updateDuration = Date.now() - updateStartTime;
  
  const success = check(response, {
    'update task status is 200': (r) => r.status === 200,
    'update task has updated task': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data && body.data.task !== undefined;
      } catch (e) {
        return false;
      }
    },
    'update task response time < 500ms': (r) => r.timings.duration < 500,
  }, { name: 'Update Task Checks' });

  taskUpdateSuccessRate.add(success);
  taskUpdateTime.add(updateDuration);

  if (!success) {
    taskErrors.add(1);
  }

  return success;
}

// ============================================
// FUNÇÃO AUXILIAR: DELETAR TAREFA
// ============================================
function deleteTask(token, taskId) {
  const deleteStartTime = Date.now();
  
  const params = {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    tags: {
      name: 'Delete Task',
      endpoint: `/api/tasks/${taskId}`,
      operation: 'delete'
    }
  };

  const response = http.del(`${API_BASE}/tasks/${taskId}`, null, params);
  const deleteDuration = Date.now() - deleteStartTime;
  
  const success = check(response, {
    'delete task status is 200': (r) => r.status === 200,
    'delete task response time < 500ms': (r) => r.timings.duration < 500,
  }, { name: 'Delete Task Checks' });

  taskDeleteSuccessRate.add(success);
  taskDeleteTime.add(deleteDuration);

  if (!success) {
    taskErrors.add(1);
  }

  return success;
}

// ============================================
// FUNÇÃO PRINCIPAL: CENÁRIO DE TESTE
// ============================================
export default function () {
  // Grupo: Autenticação
  const token = group('Autenticação', () => {
    const authToken = login(TEST_USER.email, TEST_USER.password);
    
    if (!authToken) {
      console.error('Falha na autenticação. Abortando teste para este VU.');
      return null;
    }
    
    // Pequena pausa após login
    sleep(0.5);
    
    return authToken;
  });

  // Se o login falhou, não continuar
  if (!token) {
    return;
  }

  // Grupo: Operações com Tarefas
  group('Operações CRUD de Tarefas', () => {
    // 1. Criar uma nova tarefa
    const taskId = createTask(token);
    sleep(1);

    if (taskId) {
      // 2. Buscar a tarefa criada
      getTaskById(token, taskId);
      sleep(0.5);

      // 3. Listar todas as tarefas
      const tasks = listTasks(token);
      sleep(1);

      // 4. Atualizar a tarefa criada
      updateTask(token, taskId);
      sleep(0.5);

      // 5. Deletar a tarefa criada
      deleteTask(token, taskId);
      sleep(0.5);
    } else {
      console.error('Falha ao criar tarefa. Pulando operações subsequentes.');
    }
  });

  // Pausa entre iterações
  sleep(1);
}

// ============================================
// FUNÇÃO DE RESUMO: GERA RELATÓRIO
// ============================================
export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'k6-report.html': htmlReport(data),
    'summary.json': JSON.stringify(data, null, 2),
  };
}

// ============================================
// FUNÇÃO DE SETUP: EXECUTADA UMA VEZ
// ============================================
export function setup() {
  // Verificar se a API está acessível
  const healthCheck = http.get(`${BASE_URL}/health`);
  
  if (healthCheck.status !== 200) {
    console.error(`API não está acessível em ${BASE_URL}`);
    console.error(`Status: ${healthCheck.status}`);
  } else {
    console.log(`✅ API está acessível em ${BASE_URL}`);
  }

  return {
    baseUrl: BASE_URL,
    apiBase: API_BASE,
    timestamp: new Date().toISOString()
  };
}

// ============================================
// FUNÇÃO DE TEARDOWN: EXECUTADA AO FINAL
// ============================================
export function teardown(data) {
  console.log('Teste de performance finalizado');
  console.log(`Base URL: ${data.baseUrl}`);
  console.log(`Timestamp: ${data.timestamp}`);
}
