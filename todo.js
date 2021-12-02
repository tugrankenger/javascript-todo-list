
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

// forma submit olayi kazandirmaliyiz

// tum eventListener'lar icin bir fonksiyon olusturuyoruz

eventListeners(); // sayfa acildiginda eventListener'lar calisacak

function eventListeners(){
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click",clearAllTodos);
}

function addTodo(e){
    let todos = getTodosFromStorage();
    const newTodo = todoInput.value.trim();
    let isThere = false;
    todos.forEach(function(item){
        if(item.indexOf(newTodo) !==-1){
            isThere = true;
        }
    })
    //Todolar kismina ekleme yapmak icin addTodoUI() fonksiyonunu yaziyoruz.
    if(newTodo === ""){
        /*
            <div class="alert alert-danger" role="alert">
                <strong>Wrong</strong> Please entry something
            </div>
        */
        showAlert("danger","Please entry something");
    }else if(isThere){
        showAlert("danger","Please entry something different");
    }
    else{
        addTodoUI(newTodo);
        addTodoStorage(newTodo);
        showAlert("success","That is awesome")
    }

    e.preventDefault();
}

function addTodoUI(newTodo){ // string degerleri list item olarak ekleyecek
    const listItem = document.createElement("li");
    listItem.className="list-group-item d-flex justify-content-between border-top";
    listItem.style.background="aliceblue";

    const link = document.createElement("a");
    link.href="#";
    link.className="delete-item";
    link.innerHTML="<i class='fa fa-remove'></i>";

    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    todoList.appendChild(listItem);

    //console.log(link);
    todoInput.value="";
}

function showAlert(type,message){
    const alert = document.createElement("div");
    alert.className= `alert alert-${type}`;
    alert.role="alert";
    alert.textContent= message;

    firstCardBody.appendChild(alert);

    setTimeout(function(){
        alert.remove();
    },2500)
}

function getTodosFromStorage(){
    let todos = [];
    if(localStorage.getItem("todos")===null){
        todos=[];
    }else{
        todos= JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function addTodoStorage(newTodo){
    let todos = getTodosFromStorage();
    todos.push(newTodo);

    localStorage.setItem("todos", JSON.stringify(todos));
}

// local storage'a eklenen todolari arayuzde gorme

function loadAllTodosToUI(){
    let todos = getTodosFromStorage();

    todos.forEach(function(todo){
        addTodoUI(todo);
    })
}

function deleteTodo(e){
    
    if(e.target.className=="fa fa-remove"){
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","Todo is removed")
    }
}

function deleteTodoFromStorage(deletetodo){
    let todos = getTodosFromStorage();

    todos.forEach(function(todo,index){
        if(todo === deletetodo){
            todos.splice(index,1);
        }
    })

    localStorage.setItem("todos",JSON.stringify(todos));
}

function filterTodos(e){
    //console.log(e.target.value);

    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item")

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();

        if(text.indexOf(filterValue) === -1){
            listItem.setAttribute("style","display: none !important"); // bir sey yazilmazsa bos string demektir ve butun elemanlar bos string icerdiginden display block olur.
        }else{
            listItem.setAttribute("style","display: block")
        }
    });
}

function clearAllTodos(){
    if(confirm("Are you sure you want to delete them all?")){
        //todoList.innerHTML="";
        
        while(todoList.firstElementChild !== null){
            todoList.removeChild(todoList.firstElementChild);
        }

        localStorage.removeItem("todos")
        
        console.log(todoList.firstElementChild);
    }
}