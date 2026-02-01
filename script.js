// DEMO VERSION - Works with localStorage instead of API
let tasks = JSON.parse(localStorage.getItem('tasks')) || [
    {
        id: 'demo-1',
        title: '📧 Enviar relatório mensal',
        description: 'Compilar e enviar o relatório de progresso mensal',
        status: 'TODO',
        priority: 100,
        urgent: true,
        important: true,
        autoExecutable: false,
        createdAt: new Date().toISOString(),
        assignee: 'Diego'
    },
    {
        id: 'demo-2', 
        title: '🔍 Pesquisar Node.js',
        description: 'Pesquisar melhores práticas de performance',
        status: 'DONE',
        priority: 75,
        urgent: false,
        important: true,
        autoExecutable: true,
        executionCommand: 'pesquisar: Node.js performance',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        assignee: 'Diego'
    }
];

let currentEditingTask = null;

// DOM Elements
const elements = {
    todoTasks: document.getElementById('todo-tasks'),
    doingTasks: document.getElementById('doing-tasks'), 
    doneTasks: document.getElementById('done-tasks'),
    todoCount: document.getElementById('todo-count'),
    doingCount: document.getElementById('doing-count'),
    doneCount: document.getElementById('done-count'),
    autoCount: document.getElementById('auto-count'),
    todoBadge: document.getElementById('todo-badge'),
    doingBadge: document.getElementById('doing-badge'),
    doneBadge: document.getElementById('done-badge'),
    loading: document.getElementById('loading'),
    apiStatus: document.getElementById('api-status'),
    autoExecStatus: document.getElementById('auto-exec-status'),
    lastUpdate: document.getElementById('last-update'),
    taskModal: document.getElementById('task-modal'),
    historyModal: document.getElementById('history-modal'),
    taskForm: document.getElementById('task-form'),
    addTaskBtn: document.getElementById('add-task-btn'),
    refreshBtn: document.getElementById('refresh-btn'),
    historyBtn: document.getElementById('history-btn'),
    taskAutoExec: document.getElementById('task-auto-exec'),
    execCommandGroup: document.getElementById('exec-command-group')
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    renderTasks();
    updateStats();
    updateStatus('🌐 DEMO MODE', 'Simulação ativa');
    updateLastUpdate();
});

function initializeApp() {
    console.log('🎯 Sistema de Tarefas DEMO - Inicializado');
    showLoading(false);
}

function setupEventListeners() {
    elements.addTaskBtn.addEventListener('click', () => openTaskModal());
    elements.refreshBtn.addEventListener('click', () => {
        renderTasks();
        updateStats();
        showToast('🔄 Atualizado!', 'success');
    });
    elements.historyBtn.addEventListener('click', openHistoryModal);
    elements.taskForm.addEventListener('submit', handleTaskSubmit);
    elements.taskAutoExec.addEventListener('change', toggleExecCommandGroup);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === elements.taskModal) {
            closeModal();
        }
        if (event.target === elements.historyModal) {
            closeHistoryModal();
        }
    });
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createTask(taskData) {
    const newTask = {
        id: 'task-' + Date.now(),
        ...taskData,
        status: 'TODO',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks();
    showToast('✅ Tarefa criada com sucesso!', 'success');
    renderTasks();
    updateStats();
    return newTask;
}

function updateTask(taskId, updates) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        saveTasks();
        renderTasks();
        updateStats();
        return tasks[taskIndex];
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks();
    showToast('🗑️ Tarefa removida', 'success');
    renderTasks();
    updateStats();
}

// Render Functions
function renderTasks() {
    const todoTasks = tasks.filter(task => task.status === 'TODO');
    const doingTasks = tasks.filter(task => task.status === 'DOING');
    const doneTasks = tasks.filter(task => task.status === 'DONE');
    
    elements.todoTasks.innerHTML = todoTasks.map(createTaskHTML).join('');
    elements.doingTasks.innerHTML = doingTasks.map(createTaskHTML).join('');
    elements.doneTasks.innerHTML = doneTasks.map(createTaskHTML).join('');
    
    // Add drag and drop events
    addDragDropEvents();
}

function createTaskHTML(task) {
    const priority = getPriorityLabel(task.priority);
    const priorityClass = getPriorityClass(task.priority);
    const createdDate = new Date(task.createdAt).toLocaleDateString('pt-BR');
    const autoExecBadge = task.autoExecutable ? 
        '<span class="auto-exec-badge"><i class="fas fa-robot"></i> AUTO-EXEC</span>' : '';
    
    return `
        <div class="task" draggable="true" data-task-id="${task.id}">
            <div class="task-header">
                <div class="task-title">${task.title}</div>
                <div class="task-actions">
                    <button class="btn btn-small btn-secondary" onclick="editTask('${task.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-small btn-danger" onclick="confirmDeleteTask('${task.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
            
            <div class="task-meta">
                <div class="task-badges">
                    <span class="priority-badge ${priorityClass}">${priority}</span>
                    ${autoExecBadge}
                </div>
                <div class="task-timestamp">${createdDate}</div>
            </div>
        </div>
    `;
}

function getPriorityLabel(priority) {
    if (priority >= 100) return 'Crítica';
    if (priority >= 75) return 'Alta';
    if (priority >= 50) return 'Média';
    return 'Baixa';
}

function getPriorityClass(priority) {
    if (priority >= 100) return 'priority-critical';
    if (priority >= 75) return 'priority-high';
    if (priority >= 50) return 'priority-medium';
    return 'priority-low';
}

// Stats Functions
function updateStats() {
    const todoCount = tasks.filter(t => t.status === 'TODO').length;
    const doingCount = tasks.filter(t => t.status === 'DOING').length;
    const doneCount = tasks.filter(t => t.status === 'DONE').length;
    const autoCount = getAutoExecCount();
    
    elements.todoCount.textContent = todoCount;
    elements.doingCount.textContent = doingCount;
    elements.doneCount.textContent = doneCount;
    elements.autoCount.textContent = autoCount;
    
    elements.todoBadge.textContent = todoCount;
    elements.doingBadge.textContent = doingCount;
    elements.doneBadge.textContent = doneCount;
    
    updateLastUpdate();
}

function getAutoExecCount() {
    return tasks.filter(t => t.autoExecutable && t.status !== 'DONE').length;
}

// Modal Functions  
function openTaskModal(task = null) {
    currentEditingTask = task;
    const isEditing = !!task;
    
    document.getElementById('modal-title').textContent = isEditing ? 'Editar Tarefa' : 'Nova Tarefa';
    
    if (isEditing) {
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-desc').value = task.description || '';
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-auto-exec').checked = task.autoExecutable;
        document.getElementById('exec-command').value = task.executionCommand || '';
        toggleExecCommandGroup();
    } else {
        elements.taskForm.reset();
        document.getElementById('task-priority').value = '75';
        toggleExecCommandGroup();
    }
    
    elements.taskModal.style.display = 'block';
}

function closeModal() {
    elements.taskModal.style.display = 'none';
    currentEditingTask = null;
}

function toggleExecCommandGroup() {
    const isAutoExec = elements.taskAutoExec.checked;
    elements.execCommandGroup.style.display = isAutoExec ? 'block' : 'none';
}

function handleTaskSubmit(event) {
    event.preventDefault();
    
    const taskData = {
        title: document.getElementById('task-title').value.trim(),
        description: document.getElementById('task-desc').value.trim(),
        priority: parseInt(document.getElementById('task-priority').value),
        urgent: parseInt(document.getElementById('task-priority').value) >= 75,
        important: true,
        autoExecutable: document.getElementById('task-auto-exec').checked,
        executionCommand: document.getElementById('task-auto-exec').checked ? 
            document.getElementById('exec-command').value.trim() : '',
        assignee: 'Diego'
    };
    
    if (!taskData.title) {
        showToast('❌ Título é obrigatório', 'error');
        return;
    }
    
    if (currentEditingTask) {
        updateTask(currentEditingTask.id, taskData);
        showToast('✅ Tarefa atualizada!', 'success');
    } else {
        createTask(taskData);
    }
    closeModal();
}

// Task Actions
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        openTaskModal(task);
    }
}

function confirmDeleteTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task && confirm(`Tem certeza que deseja remover a tarefa "${task.title}"?`)) {
        deleteTask(taskId);
    }
}

// Drag and Drop
function addDragDropEvents() {
    const taskElements = document.querySelectorAll('.task');
    taskElements.forEach(task => {
        task.addEventListener('dragstart', handleDragStart);
        task.addEventListener('dragend', handleDragEnd);
    });
}

function handleDragStart(event) {
    event.target.classList.add('dragging');
    event.dataTransfer.setData('text/plain', event.target.dataset.taskId);
}

function handleDragEnd(event) {
    event.target.classList.remove('dragging');
}

function allowDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
}

function drop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    
    const taskId = event.dataTransfer.getData('text/plain');
    const newStatus = event.currentTarget.dataset.status;
    const task = tasks.find(t => t.id === taskId);
    
    if (task && task.status !== newStatus) {
        const updates = { status: newStatus };
        
        if (newStatus === 'DOING' && !task.startedAt) {
            updates.startedAt = new Date().toISOString();
        }
        
        if (newStatus === 'DONE' && !task.completedAt) {
            updates.completedAt = new Date().toISOString();
        }
        
        updateTask(taskId, updates);
        showToast(`📝 Tarefa movida para ${newStatus}`, 'success');
    }
}

// History Functions
function openHistoryModal() {
    elements.historyModal.style.display = 'block';
    
    const history = tasks.filter(t => t.status === 'DONE');
    renderHistory(history);
}

function closeHistoryModal() {
    elements.historyModal.style.display = 'none';
}

function renderHistory(history) {
    if (!history.length) {
        document.getElementById('history-content').innerHTML = 
            '<div class="loading">📋 Nenhuma tarefa concluída ainda</div>';
        return;
    }
    
    const historyHTML = history.map(task => {
        const completedDate = task.completedAt ? 
            new Date(task.completedAt).toLocaleDateString('pt-BR') : 'Data não disponível';
        const priority = getPriorityLabel(task.priority);
        const priorityClass = getPriorityClass(task.priority);
        const autoExecBadge = task.autoExecutable ? 
            '<span class="auto-exec-badge"><i class="fas fa-robot"></i> AUTO-EXEC</span>' : '';
        
        return `
            <div class="task">
                <div class="task-header">
                    <div class="task-title">✅ ${task.title}</div>
                </div>
                ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                <div class="task-meta">
                    <div class="task-badges">
                        <span class="priority-badge ${priorityClass}">${priority}</span>
                        ${autoExecBadge}
                    </div>
                    <div class="task-timestamp">Concluída em ${completedDate}</div>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('history-content').innerHTML = historyHTML;
}

// Utility Functions
function showLoading(show) {
    elements.loading.style.display = show ? 'flex' : 'none';
}

function updateStatus(apiStatus, autoExecStatus) {
    elements.apiStatus.textContent = apiStatus;
    elements.autoExecStatus.textContent = autoExecStatus;
}

function updateLastUpdate() {
    elements.lastUpdate.textContent = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.getElementById('toast-container').appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// Global functions for HTML onclick events
window.editTask = editTask;
window.confirmDeleteTask = confirmDeleteTask;
window.closeModal = closeModal;
window.closeHistoryModal = closeHistoryModal;
window.allowDrop = allowDrop;
window.drop = drop;