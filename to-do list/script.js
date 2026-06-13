(function(){
  const STORAGE_KEY = 'todo_tasks_v1';
  const input = document.getElementById('input-box');
  const addBtn = document.querySelector('.row button');
  const listContainer = document.getElementById('list-container');

  function loadTasks(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw){
        // bootstrap from existing static list if present
        const existing = Array.from(listContainer.querySelectorAll('li'));
        if(existing.length){
          const tasks = existing.map((li, idx)=>({id: Date.now()+idx, text: (li.textContent||'').replace('X','').trim(), completed: li.classList.contains('completed')}));
          saveTasks(tasks);
          return tasks;
        }
        return [];
      }
      return JSON.parse(raw)||[];
    }catch(e){
      return [];
    }
  }

  function saveTasks(tasks){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function createTaskElement(task){
    const li = document.createElement('li');
    li.dataset.id = task.id;
    if(task.completed) li.classList.add('completed');

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.type = 'button';
    del.setAttribute('aria-label','Delete task');
    del.dataset.id = task.id;
    del.textContent = '×';

    li.appendChild(span);
    li.appendChild(del);
    return li;
  }

  function render(tasks){
    listContainer.innerHTML = '';
    tasks.forEach(t=> listContainer.appendChild(createTaskElement(t)));
  }

  function addTask(text){
    const trimmed = text.trim();
    if(!trimmed) return;
    const tasks = loadTasks();
    const task = {id: Date.now(), text: trimmed, completed: false};
    tasks.unshift(task);
    saveTasks(tasks);
    render(tasks);
    input.value = '';
    input.focus();
  }

  function toggleComplete(id){
    const tasks = loadTasks();
    const i = tasks.findIndex(t=>String(t.id)===String(id));
    if(i<0) return;
    tasks[i].completed = !tasks[i].completed;
    saveTasks(tasks);
    render(tasks);
  }

  function deleteTask(id){
    let tasks = loadTasks();
    tasks = tasks.filter(t=>String(t.id)!==String(id));
    saveTasks(tasks);
    render(tasks);
  }

  // events
  addBtn.addEventListener('click', ()=> addTask(input.value));
  input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') addTask(input.value); });

  listContainer.addEventListener('click', (e)=>{
    const btn = e.target.closest('.delete-btn');
    if(btn){ deleteTask(btn.dataset.id); return; }
    const li = e.target.closest('li');
    if(li){ toggleComplete(li.dataset.id); }
  });

  // initial render
  render(loadTasks());
})();