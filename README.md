# 🎯 Sistema de Tarefas - Diego

Sistema profissional de gerenciamento de tarefas com interface moderna e execução automática.

## ✨ Características

### 🎨 Interface Moderna
- **Tema Dark**: Preto e verde profissional
- **Responsivo**: Funciona em desktop e mobile
- **Kanban Board**: Visualização intuitiva (TODO → DOING → DONE)
- **Drag & Drop**: Mova tarefas entre colunas facilmente

### 🤖 Auto-Execução
- **Bezim executa tarefas automaticamente** através dos heartbeats
- **Priorização inteligente**: Alta, média, baixa, crítica
- **Comandos suportados**: pesquisar, exec, notify, backup, etc.

### 📊 Dashboard Completo
- **Estatísticas em tempo real**
- **Histórico de tarefas concluídas**
- **Status da API e auto-execução**
- **Notificações toast**

## 🚀 Como Usar

### 📝 Adicionar Tarefa
1. Clique em **"Nova Tarefa"**
2. Preencha título e descrição
3. Escolha a prioridade
4. Marque **"Auto-execução"** se quiser que o Bezim execute automaticamente
5. Para auto-exec, defina o comando (ex: `pesquisar: termo`, `exec: comando`)

### 🔄 Gerenciar Tarefas
- **Arrastar e soltar** entre colunas
- **Editar** clicando no ícone de lápis
- **Remover** clicando no ícone de lixeira
- **Visualizar histórico** no botão "Histórico"

### 🤖 Auto-Execução
O Bezim checa automaticamente tarefas marcadas como "auto-executáveis" e as executa baseado na prioridade:

**Comandos suportados:**
- `pesquisar: termo de pesquisa`
- `exec: comando do sistema`
- `notify: mensagem de notificação`
- `backup: dados`
- `api call: endpoint`
- `criar arquivo: nome.txt`
- `enviar email: assunto`

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Node.js + Express
- **Banco**: JSON files (local)
- **Integração**: API REST completa
- **Hospedagem**: GitHub Pages + Vercel

## 📱 Screenshots

### Desktop
![Desktop](https://via.placeholder.com/800x500/0a0a0a/00ff88?text=Sistema+de+Tarefas+-+Desktop)

### Mobile
![Mobile](https://via.placeholder.com/300x600/0a0a0a/00ff88?text=Mobile+Responsive)

## 🔧 Configuração Local

```bash
# Clonar repositório
git clone https://github.com/programaas/tarefas.git

# Entrar na pasta
cd tarefas

# Abrir no navegador
open index.html
```

## 🌐 API Endpoints

### Tarefas
- `GET /api/tasks` - Listar todas as tarefas
- `POST /api/tasks` - Criar nova tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Remover tarefa

### Auto-Execução
- `GET /api/executable` - Listar tarefas executáveis
- `POST /api/execute/:id` - Executar tarefa específica

### Histórico
- `GET /api/history` - Histórico de tarefas concluídas

## 🎯 Roadmap

- [ ] ✅ Interface responsiva (FEITO)
- [ ] ✅ Sistema de prioridades (FEITO)
- [ ] ✅ Auto-execução via Bezim (FEITO)
- [ ] ✅ Drag & drop (FEITO)
- [ ] ✅ Dashboard com estatísticas (FEITO)
- [ ] 📱 App PWA
- [ ] 🔔 Notificações push
- [ ] 👥 Multi-usuário
- [ ] 🔄 Sincronização em tempo real
- [ ] 📊 Relatórios avançados

## 👨‍💻 Desenvolvido por

**Diego** com assistência do **Bezim** 🤖

---

*Sistema de tarefas profissional com execução automática. Fique produtivo! 🚀*