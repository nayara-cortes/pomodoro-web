/** TASKS LOGIC */

/** GLOBAL VARIABLES */
let taskList = [
    {text: "¡Escribe tu primera tarea! ☺️", completed: false},
];
let isAddingTask = false;

function renderTasks() {
    let task_ul = document.getElementById("task-list-ul");
    task_ul.innerHTML = "";

    taskList.forEach((task, index, taskList) => {
        // Creamos la tarea
        const li = createTaskElement(task, index);
        task_ul.appendChild(li);
        

    });
}


function createTaskElement(task, index) {
    // Creamos li + checkbox
    let li = document.createElement("li"); // Creamos el elemento li

    // Creamos checkbox
    const checkbox = document.createElement("span"); // Creamos un elemento span para poder darle comportamiento
    checkbox.classList.add("task-checkbox"); // Le damos el estilo de la clase task-checkbox
    checkbox.addEventListener("click", () => completeTask(index));

    // Creamos texto
    const text = document.createElement("span"); // Creamos un texto nodo para poder añadirlo a li
    text.classList.add("task-text");
    text.textContent = task.text; 

    // Creamos botón de configuración
    const configTask = document.createElement("button");
    configTask.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>';
    configTask.classList.add("task-options-btn");
    configTask.dataset.index = index;
    configTask.addEventListener("click", deleteTask);

    // Si la tarea está completada, añadir tick al checkbox + cambiar estilo texto
    if(task.completed === true) {
        checkbox.classList.add("task-completed-checkbox");
        text.classList.add("task-completed-text");
    }

    // Añadimos todos los elementos al li
    li.appendChild(checkbox); // Le añadimos el checkbox
    li.appendChild(text);
    li.appendChild(configTask);

    // Añadimos listener para poder editar la tarea al pulsar sobre ella.
    text.addEventListener("click", () => {
        let input = document.createElement("input");
        input.value = text.textContent;
        // input.maxLength = 35;
        input.classList.add("task-text-input");
        li.replaceChild(input, text);
        input.focus();
        input.addEventListener("keydown", (event) => {
            if(event.key === "Enter") {
                if(event.target.value.trim() !== "") {
                    taskList[index].text = input.value;
                    renderTasks();
                    addTask();
                } else {
                    li.replaceChild(text, input);
                }
            } else if(event.key === "Escape") {
                li.replaceChild(text, input);
            }
        });

        function handleOutsideClick(event) {
            if (!li.contains(event.target)) {
                li.replaceChild(text, input);
                document.removeEventListener("click", handleOutsideClick);
            }
        }

        setTimeout(() => {
        document.addEventListener("click", handleOutsideClick);
        }, 0);

    })
    return li;
}


function completeTask(id) {
    if(taskList[id].completed === true) {
        taskList[id].completed = false;
    } else {
        taskList[id].completed = true;
    }
    renderTasks();
}

function addTask() {
    if(isAddingTask === false) {

        isAddingTask = true;
        let li = document.createElement("li");

        // Creamos checkbox
        const checkbox = document.createElement("span"); // Creamos un elemento span para poder darle comportamiento
        checkbox.classList.add("task-checkbox"); // Le damos el estilo de la clase task-checkbox
        checkbox.addEventListener("click", () => completeTask(index));
        
        // Creamos input
        let input = document.createElement("input");
        input.classList.add("task-text-input");
        // input.maxLength = 35;
        document.getElementById("task-list-ul").appendChild(li);

        // Añadimos a li
        li.appendChild(checkbox);
        li.appendChild(input);
        input.classList.add("task-text");
        input.focus();
        function handleOutsideClick(event) {
            if (!li.contains(event.target)) {
                li.remove();
                isAddingTask = false;
                document.removeEventListener("click", handleOutsideClick);
            }
        }

        // Espera un instante para que no dispare con el mismo clic que abrió el input
        setTimeout(() => {
        document.addEventListener("click", handleOutsideClick);
        }, 0);
        input.addEventListener("keydown", (event) => handleInputKeydown(event, callbackIfValid, li));
    }
}

function handleInputKeydown(event, callbackIfValid, li) {
    if(event.key === "Enter") {
        if(event.target.value.trim() !== "") {
            callbackIfValid(event.target.value);
            addTask();
        } else {
            li.remove();
            isAddingTask = false;
        }
    } else if (event.key === "Escape") {
        li.remove();
        isAddingTask = false;
    }
}


function callbackIfValid(inputValue) {
    taskList.push({text: inputValue, completed: false});
    isAddingTask = false;
    renderTasks();
}


function deleteTask(event) {
    event.stopPropagation();
    const index = parseInt(event.currentTarget.dataset.index);
    taskList.splice(index, 1);
    renderTasks();
}



renderTasks();

document.getElementById("add-task-btn").addEventListener("click", addTask);
