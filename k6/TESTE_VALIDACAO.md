# O Que Este Teste Valida

## O Que É Este Teste?

Este teste simula várias pessoas usando a API ao mesmo tempo para verificar se ela funciona bem quando muitas pessoas a usam juntas. É como testar se uma ponte aguenta quando muitos carros passam por ela ao mesmo tempo.

O teste verifica duas coisas importantes:
1. **Se tudo funciona corretamente** - as operações dão certo mesmo com muita gente usando
2. **Se é rápido o suficiente** - as respostas não demoram muito mesmo sob carga

---

## O Que O Teste Faz?

### 1. Testa o Login

**O que verifica:**
- Se o login funciona e retorna um token de acesso
- Se o login é rápido (menos de 1 segundo na maioria das vezes)
- Se pelo menos 9 em cada 10 tentativas de login funcionam

**Por que isso importa:**
Imagine que 100 pessoas tentam fazer login ao mesmo tempo. O teste verifica se a API consegue lidar com isso sem travar ou ficar muito lenta.

---

### 2. Testa Criar Tarefas

**O que verifica:**
- Se consegue criar uma nova tarefa
- Se a tarefa criada tem um ID único
- Se a criação é rápida (menos de meio segundo na maioria das vezes)
- Se pelo menos 9 em cada 10 criações funcionam

**Por que isso importa:**
Quando várias pessoas criam tarefas ao mesmo tempo, a API precisa processar tudo corretamente e rapidamente.

---

### 3. Testa Buscar uma Tarefa Específica

**O que verifica:**
- Se consegue encontrar uma tarefa pelo seu ID
- Se retorna todos os dados da tarefa
- Se a busca é rápida (menos de meio segundo)
- Se o sistema verifica se você está logado antes de mostrar a tarefa

**Por que isso importa:**
Mesmo com muitas pessoas buscando tarefas diferentes ao mesmo tempo, cada busca deve ser rápida e precisa.

---

### 4. Testa Listar Todas as Tarefas

**O que verifica:**
- Se consegue listar todas as tarefas
- Se a lista vem organizada e completa
- Se a listagem é rápida (menos de meio segundo)
- Se funciona a paginação (dividir em páginas quando há muitas tarefas)

**Por que isso importa:**
Listar tarefas pode ser mais pesado que buscar uma só, então o teste verifica se mesmo assim é rápido.

---

### 5. Testa Atualizar uma Tarefa

**O que verifica:**
- Se consegue atualizar os dados de uma tarefa
- Se as mudanças são salvas corretamente
- Se a atualização é rápida (menos de meio segundo)
- Se várias pessoas atualizando ao mesmo tempo não causa problemas

**Por que isso importa:**
Quando várias pessoas editam coisas ao mesmo tempo, o sistema precisa garantir que não perde dados ou cria conflitos.

---

### 6. Testa Deletar uma Tarefa

**O que verifica:**
- Se consegue deletar uma tarefa
- Se a tarefa é realmente removida do sistema
- Se a exclusão é rápida (menos de meio segundo)
- Se pelo menos 9 em cada 10 exclusões funcionam

**Por que isso importa:**
Deletar é uma operação importante e precisa ser confiável, mesmo quando várias pessoas deletam coisas ao mesmo tempo.

---

## Como O Teste Funciona?

### Simula Usuários Reais

O teste cria "usuários virtuais" que fazem as mesmas coisas que um usuário real faria:

1. **Faz login** na API
2. **Cria uma tarefa** nova
3. **Busca a tarefa** que acabou de criar
4. **Lista todas as tarefas** disponíveis
5. **Atualiza a tarefa** que criou
6. **Deleta a tarefa** que criou

### Aumenta a Carga Gradualmente

O teste não começa com muitos usuários de uma vez. Ele vai aumentando aos poucos:

1. **Primeiro**: Começa com 0 usuários e vai aumentando até 5 usuários em 30 segundos
   - É como uma loja que vai enchendo aos poucos de manhã

2. **Depois**: Mantém 5 usuários por 1 minuto
   - Testa se a API se comporta bem com essa carga constante

3. **Aumenta**: Vai de 5 para 10 usuários em 30 segundos
   - Simula um pico de uso, como quando uma promoção começa

4. **Mantém**: Fica com 10 usuários por 1 minuto
   - Testa se a API aguenta a carga máxima

5. **Diminui**: Vai reduzindo até 0 usuários em 30 segundos
   - Verifica se a API se recupera bem quando a carga diminui

**Tempo total do teste**: Cerca de 3 minutos

---

## O Que Significa "Passou" ou "Falhou"?

### ✅ Teste Passou

Quando o teste passa, significa que:
- Todas as operações funcionaram corretamente
- A maioria das respostas foi rápida (dentro dos limites esperados)
- Pelo menos 9 em cada 10 operações deram certo
- A API aguentou bem ter várias pessoas usando ao mesmo tempo

**Em outras palavras**: A API está funcionando bem e pronta para uso real.

### ⚠️ Teste Passou com Avisos

Às vezes o teste passa, mas com alguns avisos:
- A maioria das coisas funcionou bem
- Algumas poucas requisições foram mais lentas que o esperado
- Mas no geral, os limites principais foram respeitados

**Em outras palavras**: A API funciona, mas pode ter alguns momentos mais lentos. Não é crítico, mas pode ser melhorado.

### ❌ Teste Falhou

Quando o teste falha, significa que:
- Muitas operações não funcionaram (menos de 9 em cada 10)
- As respostas estão muito lentas (acima dos limites)
- A API não está aguentando a carga

**Em outras palavras**: A API precisa ser corrigida ou otimizada antes de ser usada com muitos usuários.

---

## O Que O Teste Mede?

O teste coleta várias informações importantes:

### Taxa de Sucesso
- Quantas operações funcionaram vs quantas falharam
- Por exemplo: "95% dos logins funcionaram" significa que 95 em cada 100 tentativas deram certo

### Tempo de Resposta
- Quanto tempo a API demora para responder
- O teste verifica se a maioria das respostas é rápida
- Por exemplo: "95% das respostas foram em menos de 1 segundo"

### Quantidade de Erros
- Quantos erros aconteceram durante o teste
- Isso ajuda a identificar problemas

### Total de Requisições
- Quantas operações foram feitas no total
- Ajuda a entender o volume de teste

---

## Critérios Para Passar no Teste

O teste só considera que passou se **todas** essas condições forem atendidas:

### Para Todas as Requisições em Geral:
- ✅ 95% das requisições devem responder em menos de 1 segundo
- ✅ 99% das requisições devem responder em menos de 2 segundos
- ✅ Menos de 5% das requisições podem falhar

### Para o Login:
- ✅ Pelo menos 90% dos logins devem funcionar
- ✅ 95% dos logins devem responder em menos de 1 segundo

### Para as Operações de Tarefas (Criar, Listar, Atualizar, Deletar):
- ✅ Pelo menos 90% de cada operação deve funcionar
- ✅ 95% de cada operação deve responder em menos de meio segundo

Se qualquer uma dessas condições não for atendida, o teste falha.

---

## Como Executar o Teste?

### Antes de Começar

1. **A API precisa estar rodando**:
   ```bash
   npm start
   ```

2. **O K6 precisa estar instalado**:
   - No Mac: `brew install k6`
   - No Linux ou Windows: siga as instruções em https://k6.io

### Executar o Teste

**Forma mais fácil (recomendada):**
```bash
npm run test:performance
```

**Forma direta:**
```bash
k6 run k6/performance-test.js
```

### Personalizar o Teste

Você pode mudar algumas configurações usando variáveis de ambiente:

```bash
BASE_URL=http://localhost:3000 \
TEST_EMAIL=user@test.com \
TEST_PASSWORD=user123 \
k6 run k6/performance-test.js
```

Isso permite testar em diferentes ambientes ou com diferentes usuários.

---

## O Que Aparece Depois do Teste?

Após executar o teste, você verá:

1. **No terminal**: Um resumo mostrando o que passou e o que falhou
2. **Arquivo HTML**: Um relatório visual bonito que você pode abrir no navegador
3. **Arquivo JSON**: Dados brutos para análise mais detalhada

### Ver o Relatório Visual

Depois do teste, você pode abrir o relatório HTML:

```bash
# No Mac
open k6-report.html

# No Linux
xdg-open k6-report.html

# No Windows
start k6-report.html
```

O relatório mostra gráficos e tabelas que ajudam a entender melhor como a API se comportou.

---

## Resumo Simples

Este teste verifica se a API:

✅ **Funciona corretamente** - Todas as operações (criar, ler, atualizar, deletar) funcionam mesmo com muitas pessoas usando ao mesmo tempo

✅ **É rápida** - As respostas não demoram muito, mesmo quando há muita carga

✅ **É confiável** - A maioria das operações funciona (pelo menos 9 em cada 10)

✅ **É estável** - Não quebra ou fica muito lenta quando a carga aumenta

✅ **Aguenta carga** - Consegue processar vários usuários simultâneos sem problemas

**Em resumo**: O teste garante que a API está pronta para ser usada por muitas pessoas ao mesmo tempo, sem travar ou ficar lenta.

---

**Última atualização**: Dezembro 2024
