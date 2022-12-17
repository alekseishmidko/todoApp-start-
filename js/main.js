// находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')){
    // console.log(localStorage.getItem('tasks'));
    JSON.parse(localStorage.getItem('tasks'));
    // console.log(JSON.parse(localStorage.getItem('tasks')));
    tasks = JSON.parse(localStorage.getItem('tasks'));
    console.log(tasks)
    }

tasks.forEach(function(task){
    renderTask(task);

})


checkEmptyList()

// добавление задачи
form.addEventListener('submit', addTask);
// удаление задачи
tasksList.addEventListener('click', deleteTask);
// отметка задачи завершенной
tasksList.addEventListener('click', doneTask);



// функции
function addTask (event){
        // отмена отправки формы
    event.preventDefault();
    // достаем текст задачи из поля ввода
    const taskText = taskInput.value;  
    // описание задачи в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };
    // добавление объекта в массив с задачами
    tasks.push(newTask);

    // Сохрвняем список задач в  хранилище браузера local Storage
    saveToLocalStorage();
    // рендерим задачу на странице
    renderTask(newTask);
  

    // очищаем поле ввода и возвращаем на него фокус
    taskInput.value = ""
    taskInput.focus() 
// Проверка .если в списке задач более 1эл-та, скрываем блок "список задач пуст"
    // if (tasksList.children.length > 1) {
    //     emptyList.classList.add('none');
    // }
    checkEmptyList()
    }
function deleteTask (event){
    // проверка что клик был НЕ по кнопке удалить задачу
    if (event.target.dataset.action !== 'delete') return;
    //    проверка что клик был по кнопке удалить задачу, условие ниже можно убрать
    // if (event.target.dataset.action === 'delete')
       {
        const parentNode = event.target.closest('.list-group-item');
        // определяем id задачи

        const id = Number(parentNode.id);
        console.log(parentNode.id);
        // находим индекс задачи в массиве(1 способ)
        // const index = tasks.findIndex((task) => task.id === id);
    
        // удаление задачи из массива с задачами(1 способ)

        // tasks.splice(index, 1);

        // удаление задачи через фильтрацию массива(2 способ)
        tasks = tasks.filter(function(task){
            // ниже исходная ф-ия и упрощенная

            // if (task.id === id) {
            //     return false}
            //     else {
            //     return true
            // }
            return task.id !== id;
           })

        // Сохрвняем список задач в  хранилище браузера local Storage
        saveToLocalStorage();

        // удаление задачи из разметки
       parentNode.remove();
    // Проверка .если в списке задач более 1эл-та, скрываем блок "список задач пуст"
    // if (tasksList.children.length === 1) {
    //     emptyList.classList.remove('none');
    // }
    }
    checkEmptyList()
}
function doneTask(event) {
    // Если клик на кнопку НЕ выполнено
    if (event.target.dataset.action !== "done") return;
    // Если клик на кнопку выполнено, условие ниже можно убрать
    // if (event.target.dataset.action === "done")
    {
        const parentNode = event.target.closest('.list-group-item');

        // определение id задачи
        const id = Number(parentNode.id);
        const task = tasks.find(function(task){
            if (task.id === id){
                return true
            }
        })
        task.done = !task.done;

     // Сохрвняем список задач в  хранилище браузера local Storage
     saveToLocalStorage();

        const taskTitle = parentNode.querySelector('.task-title');
        taskTitle.classList.toggle('task-title--done');

    }
}
function checkEmptyList(){
    console.log(tasks.length)
    if (tasks.length === 0){
        const emptyListElement = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
    </li>`;
    tasksList.insertAdjacentHTML('afterbegin', emptyListElement);
    }

    if (tasks.length > 0){
        const emptyListEL = document.querySelector('#emptyList');
        emptyListEL? emptyListEL.remove : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    // формируем CSS class 
    const cssClass = task.done? 'task-title task-title--done' : 'task-title';

    // формируем разметку для новой задачи

    const taskHTML = `
        <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${task.text}</span>
        <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Done" width="18" height="18">
            </button>

            <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Done" width="18" height="18">
            </button>
        </div>
        </li>`;

    // Добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}