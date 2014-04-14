(function()
{
    /**
    * Variable that stores the number of tasks to perform
    */  
    var taskToDo = 0,
        collectionOfTask,
        ElementWhichUpdating ;

    /**
    * Called in case of error during request to the server.
    * @param {String} text. String for display.
    */   
    function error(text){
        console.log('Error is :' + text);
    }

    /**
    * Display one task
    * @param {Object} task. It contains properties task{string}(that you want to do) and
    *                 status{Boolean}(status of task) and _id{number}(id of task).
    * @param {Html} elem. Html elememt which will display.
    */
    function componentsOfTask(obj, elem){
        elem.innerHTML = '';
        var div = document.createElement('div');
            div.setAttribute('data-id',obj._id);
            div.className = 'showValueOfTask';
            div.ondblclick = changeDivToInput;

        var checkbox = document.createElement('input');
            checkbox.setAttribute('data-id',obj._id);
            checkbox.className = 'checkbox';
            checkbox.type = 'checkbox';
            checkbox.checked = obj.status;
            if(obj.status == true){
                div.className = "checkedTask";
            }
            checkbox.addEventListener("click", mark, false);

        var button=document.createElement('button');
            button.setAttribute('data-id',obj._id);
            button.className = "button";
            button.addEventListener('click',remove, false);

        button.appendChild(document.createTextNode('R'));
        div.appendChild(document.createTextNode(obj.task));

        elem.appendChild(checkbox);
        elem.appendChild(div);
        elem.appendChild(button);
    }
   
    /**
    * Shows the task by creating all html elements
    * @param {Object} task. It contains properties task{string}(that you want to do) and
    *                 status{Boolean}(status of task) and _id{number}(id of task).
    */  
    function displayTask(task){
        var container= document.getElementById('containerShowTask');

        var containerOfOneTask = document.createElement('div');
            containerOfOneTask.setAttribute('data-id', task._id);
            containerOfOneTask.id = 'conOfTask'+ task._id;
            containerOfOneTask.className="containerOfOneTask";

        componentsOfTask(task, containerOfOneTask);

        document.getElementById('enterTask').value=''; 
        container.appendChild(containerOfOneTask);
    }

    /**
    * Shows container which contains buttons for filtering. 
    */ 
    function displayBottomContainer(){
        var container = document.getElementById('bottomContainer');
        container.innerHTML = '';

        var containerBottom = document.createElement('div');
            containerBottom.setAttribute('data-id',0);
            containerBottom.className = "containerOfOneTask";

        var countOfTasks = document.createElement('div');
            countOfTasks.setAttribute('data-id',0);
            countOfTasks.className = 'countOfTask';
            countOfTasks.appendChild(document.createTextNode('Task to do: '+ taskToDo));

        var active = document.createElement('button');
            active.id = 'active';
            active.setAttribute('data-id',0);
            active.className = "buttomFilter";
            active.addEventListener('click', filter, false);
            active.appendChild(document.createTextNode('Active'));

        var completed = document.createElement('button');
            completed.id = 'completed';
            completed.setAttribute('data-id',0);
            completed.className = "buttomFilter";
            completed.addEventListener('click', filter, false);
            completed.appendChild(document.createTextNode('Completed'));

        var all = document.createElement('button');
            all.setAttribute('data-id',0);
            all.id = 'all';
            all.className = "buttomFilter";
            all.addEventListener('click', filter, false);
            all.appendChild(document.createTextNode('All'));

        containerBottom.appendChild(countOfTasks);
        containerBottom.appendChild(all);
        containerBottom.appendChild(active);
        containerBottom.appendChild(completed);
        container.appendChild(containerBottom);
    }

    /**
    * Shows all task
    * @param {Array} array. collectionOfTask of task for display.
    */ 
    function showAllTasks(array){
        document.getElementById('containerShowTask').innerHTML = '';
        taskToDo = 0;
        for( var i = 0 ; i < array.length ; i++){
            displayTask(array[i]);
            if(array[i].status == false){
                taskToDo++;
            } 
        }
        displayBottomContainer();
    }

    /**
    * Creates a new task.
    * @param {Event} e.
    */ 
    function createTask(e){
        var taskName = document.getElementById('enterTask').value;
        if (e.keyCode === 13){
            if( taskName != ''){
                collectionOfTask.create(
                    {
                        task: taskName,
                        status: false
                    },
                    function(task){
                        displayTask(JSON.parse(task));
                        taskToDo++;
                        displayBottomContainer();
                    },
                    error  
                );
            }
            else{
                console.log('Error. task is not enter');
            }
        }
    }

    /**
    * Changing status and css style of task.
    * @param {Event} e.
    */ 
    function mark(e){
        var isCheck = false;

        if(e.target.checked){
            isCheck = true;
        }
        collectionOfTask.updata(
            {
                status: isCheck,
                _id:e.target.getAttribute('data-id')
            },
            function(newTask){
                var taskContainer = e.target.parentNode,
                    task = JSON.parse(newTask);
                if(task.status){
                    taskToDo--;
                }
                else{
                    taskToDo++;
                }
                componentsOfTask(task, taskContainer);
                displayBottomContainer();
            },
            error
        );
    }

    /**
    * Delete task by id.
    * @param {Event} e.
    */
    function remove(e){
        var id = e.target.getAttribute('data-id');

        if(!( ( collectionOfTask.getElementById( id )).status )){
            taskToDo--;
        }

        collectionOfTask.remove(
                {
                    _id: id
                },
                function (){
                    displayBottomContainer();
                    e.target.parentNode.style.display = 'none';
                },
                error
            );
    }


    /**
    * Changing status of all task and display them.
    * @param {Event} e.
    */
    function checkAll(e){
        var isCheck = false,
            array = collectionOfTask.collection;

        if(e.target.checked){
           isCheck = true;
           taskToDo = 0;
        }
        else{
            taskToDo = array.length;
        }
        for (var i = 0; i < array.length; i++){
            collectionOfTask.updata(
                {
                    status: isCheck,
                    _id:array[i]._id
                },
                function(newTask){
                    var task = JSON.parse(newTask),
                        taskContainer = document.getElementById('conOfTask'+ task._id);
                    componentsOfTask(task, taskContainer);
                },
                error
            );
        }
        displayBottomContainer();
    }

    /**
    * Filters and displays collection of task by status
    * @param {Event} e.
    */
    function filter(e){
        var arrayToDisplay = [],
            isCheck = true;

        if(e.target.id === 'active'){
            isCheck = false;
        }
        arrayToDisplay = collectionOfTask.getFilteredCollection(isCheck);    
        showAllTasks(arrayToDisplay);
        if(e.target.id === 'all'){
            showAllTasks(collectionOfTask.collection);
        }
    }

    /**
    * Changing html element div to input for changing value of target task 
    * @param {Event} e.
    */
    function changeDivToInput(e) {
        if(ElementWhichUpdating)
        {
            componentsOfTask(collectionOfTask.getElementById(ElementWhichUpdating.getAttribute('data-id')), ElementWhichUpdating);
        }
        var inputbox = document.createElement('input');
        inputbox.id = e.target.getAttribute('data-id');
        inputbox.className = 'inputbox';
        inputbox.type = 'text';
        inputbox.value = e.target.innerHTML;
        e.target.innerHTML = '';
        inputbox.addEventListener("keydown", change, false);
        e.target.appendChild(inputbox);
        inputbox.focus();
        inputbox.select();
        ElementWhichUpdating = e.target.parentNode;

    }

    /**
    * Changing value of task on new value.
    * @param {Event} e.
    */
    function change(e)
    {   
        if (e.keyCode === 13)
        {
             collectionOfTask.updata(
                    {
                        task: e.target.value,
                        _id:e.target.id
                    },
                    function(newTask){
                        var task = JSON.parse(newTask),
                            taskContainer = document.getElementById('conOfTask'+ task._id);

                        componentsOfTask(task, taskContainer);
                    },
                    error
                );
        }
        if(e.keyCode === 27)
        {
           componentsOfTask(collectionOfTask.getElementById(e.target.id), (e.target.parentNode).parentNode);
        }
    }

    /**
    * Function starts after load html document.
    */
    function init()
    {
        collectionOfTask = new MyCollection('http://localhost:3000/task');

        document.getElementById('enterTask').addEventListener('keypress',createTask,false);
        document.getElementById('checkAll').addEventListener('click', checkAll, false);
        
        collectionOfTask.load(
            function (data){
                showAllTasks(data);
            }
        );
    }
    window.init = init;
})();