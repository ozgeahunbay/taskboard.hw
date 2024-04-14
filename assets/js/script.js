// Retrieve tasks and nextId from localStorage
//const tasks =$('#tasks')
const modal= $('#formModal')
//let btn= document.getElementById('myBtn')
const taskName= $('#taskname')
const taskDueDate= $('#taskduedate')
const taskDescription= $('#taskdescription')
const lanes=$('.swim-lanes')
//const form = document.getElementById('addtasks')
//let allTasks= []


// btn.onclick = function() {
//   modal.style.display = "block";
// }
// span.onclick = function() {
//   modal.style.display = "none";
// } 

function readCards() {
  let allTasks =JSON.parse(localStorage.getItem('tasks'));

  if (!allTasks) {
    allTasks = [];
  }
  return allTasks;
}

// function saveNewTask(tasks){
 
//  allTasks.push(tasks)
//   savecred()
// } 

function savecred(allTasks){
  localStorage.setItem('tasks', JSON.stringify(allTasks))
} 

//let stringdata = localStorage.getItem('tasks')
//allTasks = JSON.parse(stringdata) || []
// modal.addEventListener('click', function(event) {
//   event.preventDefault();
//   console.log("ok")
  
//   const taskCard = {
//     taskName: taskName.value,
//     taskDueDate: taskDueDate.value,
//     taskDescription: taskDescription.value,
//     id: generateTaskId(),

//   }
// saveNewTask(taskCard)
// console.log(allTasks)
// });


// Todo: create a function to generate a unique task id


function generateTaskId() {
  let randomNum = Math.floor(Math.random() * 1000);
  
   return randomNum;

}
//generateTaskId()

// Todo: create a function to create a task card
function createTaskCard(task) {
    const div = $('<div>').addClass('card project-card draggable my-3').attr('data-card-id', task.id)
    const cardBody = $('<div>').addClass('card-body');
    const name = $('<h4>').addClass('tasks-name card-header h4').text(task.name)
    const duedate = $('<p>').addClass('tasks-duedate card-text').text(task.duedate)
    const description = $('<p>').addClass('tasks-description card-text').text(task.description)
    const deleteBtn= $('<button>').addClass('btn btn-danger delete').text('delete').attr('data-card-id', task.id);
   // deleteBtn.on('click',handleDeleteProject);

    if (task.duedate && task.status !== 'done') {
      const now = dayjs();
      const dueDate= dayjs(task.duedate, 'DD/MM/YYYY');
    

      if (now.isSame(dueDate, 'day')){
        div.addClass('bg-warning text-white');
      } else if (now.isAfter(dueDate)){
        div.addClass('bg-danger text-white');
        deleteBtn.addClass('border-light');
      }
      }
      cardBody.append(duedate,description,deleteBtn);
      div.append(name, cardBody);

      return div;

        
    }


  function printTaskCards(){
    const tasks= readCards();
    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList= $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    for (let task of tasks) {
      if (task.status === 'to-do') {
        todoList.append(createTaskCard(task));
      } else if (task.status === 'in-progress') {
        inProgressList.append(createTaskCard(task));
      } else if (task.status === 'done') {
        doneList.append(createTaskCard(task));
      }

      }

      $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function (e) {
        const original= $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
        return original.clone().css({
          width: original.outerWidth(),
        });
        },
      });

    }



  

  

// Todo: create a function to render the task list and make cards draggable
//function renderTaskList() {}



// Todo: create a function to handle adding a new task
function handleAddTask(){
  const name= taskName.val().trim();
  const duedate= taskDueDate.val();
  const description= taskDescription.val();

  const newTask={
    name: name,
    duedate: duedate,
    description: description,
    id:generateTaskId(),
    status: 'to-do',
  };

const tasks= readCards();
tasks.push(newTask);

savecred(tasks);
printTaskCards();

taskName.val('');
taskDueDate.val('');
taskDescription.val('');
}



// Todo: create a function to handle deleting a task
function handleDeleteTask(){
  const uniqueID= $(this).attr('data-card-id');
  const tasks= readCards();
  tasks.forEach((task,i) => {
    if (task.id == uniqueID){
      tasks.splice(i,1)
    }
  })
  savecred(tasks);

  printTaskCards();
}

// Todo: create a function to handle dropping a task into a new status lane


function handleDrop(event, ui) {
  const tasks= readCards();
  const taskId = ui.draggable[0].dataset.cardId;
  const newStatus= event.target.id;

  for (let task of tasks){
    if (task.id == taskId){
      task.status = newStatus;
    }
  }
  localStorage.setItem('tasks', JSON.stringify(tasks));
  printTaskCards();
}

modal.on('click','.addtask',function(event){
  event.preventDefault();
  handleAddTask();
  modal.modal('hide');
});
lanes.on('click', '.delete', handleDeleteTask)
// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
printTaskCards();
$('#taskDueDate').datepicker({
  changeMonth: true,
  changeYear: true,
})
$('.lane').droppable({
  accept: '.draggable',
  drop: handleDrop,
});
});

