(function()
{
    /**
    * Variable that stores the number of tasks to perform
    */  
    var taskToDo = 0,
        collection = [], 
        ElementWhichUpdating ;

    /**
    * Called in case of error during request to the server.
    * @param {String} text. String for display.
    */   
    function error(text)
    {
        console.log('Error is :' + text);
    }
   
    /**
    * Shows the task by creating all html elements
    * @param {Object} task. It contains properties task{string}(that you want to do) and
    *                 status{Boolean}(status of task) and _id{number}(id of task).
    */  
    function showTask(task)
    {
        var container= document.getElementById('containerShowTask');

        var containerOfOneTask = document.createElement('div');
            containerOfOneTask.setAttribute('data-id',task._id);
            containerOfOneTask.className="containerOfOneTask";

        showTaskInList(task, containerOfOneTask);

        document.getElementById('enterTask').value=''; 
        container.appendChild(containerOfOneTask);
    }

    /**
    * Shows container which contains buttons for filtering. 
    */ 
    function showBottomContainer()
    {
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
    * @param {Array} array. Collection of task for display.
    */ 
    function showAllTasks(array)
    {
        document.getElementById('containerShowTask').innerHTML = '';
        taskToDo = 0;
        for( var i = 0 ; i < array.length ; i++)
        {
            showTask(array[i]);
            if(array[i].status == false)
            { taskToDo++;} 
        }

    }

    /**
    * Display all task.
    */ 
    function displayAll()
    {
        readAll(function(text){
            collection = JSON.parse(text);
            showAllTasks(collection);
            showBottomContainer();     
        }, error); 
    }
    /**
    * showTaskInList task which was modefyed
    * @param {Object} task. It contains properties task{string}(that you want to do) and
    *                 status{Boolean}(status of task) and _id{number}(id of task).
    * @param {Html} elem. Html elememt which will redisply.
    */
    function showTaskInList(obj, elem)
    {

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
            if(obj.status == true)
            {
                div.className = "showValueOfCheckedTask";
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
    * Change task in collection .
    * @param {Object} element. New element for changin.
    */ 
    function changeInCollection(element)
    {
        for( var i = 0 ; i < collection.length; i++)
        { 
            if(collection[i]._id === element._id)
            {
                collection[i] = element;
            }
        }
    }

    /**
    * Delete task in collection .
    * @param {Number} id. d of task which was delete.
    */ 
    function deleteInCollection(id)
    {
        for( var i = 0 ; i < collection.length; i++)
            { 

                if(collection[i]._id === id)
                {
                    if(!(collection[i].status))
                    {
                         taskToDo--;
                    }
                    collection.splice(i, 1);
                }
            }
    } 

    /**
    * Get task from collection by id .
    * @param {Number} id. Id of task.
    */ 
    function getTaskById(id)
    {
         for( var i = 0 ; i < collection.length; i++)
        { 
            if(collection[i]._id === id)
            {
               return collection[i];
            }
        }
    }
    /**
    * Changing task in collection and et server and showTaskInList it.
    * @param {Object} obj. Object with parameters task (new value of task) and status(new status of task).
    * @param {Html} elem. Html element for showTaskInList. 
    */ 
    function changeTask(obj, elem)
    {
        updataById(obj, function(text){
            changeInCollection(JSON.parse(text));
            showTaskInList(JSON.parse(text), elem);
        }, error);
    }

    /**
    * Creates a new task.
    * @param {Event} e.
    */ 
    function createTask(e)
    {
        var elem = document.getElementById('enterTask').value;
        if (e.keyCode === 13)
        {
            if(elem !='')
            {
                create({task: elem, status: false}, function(text){ 
                        collection.push(JSON.parse(text));
                        showTask(JSON.parse(text));
                        taskToDo++;
                        showBottomContainer();
                    }, error);
            }
            else
            {
                console.log('Error. task is not enter');
            }
        }
    }

    /**
    * Changing status and css style of task.
    * @param {Event} e.
    */ 
    function mark(e)
    {
        var isCheck = false;
        if(e.target.checked)
        {
            isCheck = true;
            taskToDo--;
        }
        else
        {
            taskToDo++;
        }
        changeTask({status: isCheck, _id:e.target.getAttribute('data-id')}, e.target.parentNode);
        showBottomContainer();
    }

    /**
    * Delete task by id.
    * @param {Event} e.
    */
    function remove(e)
    {
        removeById({_id: e.target.getAttribute('data-id')}, function(){
            deleteInCollection(e.target.getAttribute('data-id'));
            taskToDo--;
            showBottomContainer();
            e.target.parentNode.style.display = 'none';
        }, error);
    }


    /**
    * Changing status of all task and display them.
    * @param {Event} e.
    */
    function checkAll(e)
    {
        var status = false;
        if(e.target.checked)
        {
           status = true;
        }
        for( var i = 0 ; i < collection.length ; i++)
        {
            updataById({status:status, _id:collection[i]._id}, function(){}, error);
            taskToDo++;
            collection[i].status = status;
        }       
        showAllTasks(collection);
        if(e.target.checked)
        {
            taskToDo = 0;
        }
        showBottomContainer();

    }

    /**
    * filters adn displays collection of task by status
    * @param {Event} e.
    */
    function filter(e)
    {
        var array = [],
            status = true;

        if(e.target.id === 'active')
        {
            status = false;
        }    
        for (var i = 0; i < collection.length; i++)
        {
            if(collection[i].status === status)
            {
                array.push(collection[i]);
            }
        }
        showAllTasks(array);

        if(e.target.id === 'all')
        {
            showAllTasks(collection);
        }
        showBottomContainer();
    }

    /**
    * Changing html element div to input for changing value of target task 
    * @param {Event} e.
    */
    function changeDivToInput(e)
    {
        if(ElementWhichUpdating)
        {
            showTaskInList(getTaskById(ElementWhichUpdating.getAttribute('data-id')), ElementWhichUpdating);
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
            changeTask({task: e.target.value, _id:e.target.id}, (e.target.parentNode).parentNode);
        }
        if(e.keyCode === 27)
        {
           showTaskInList(getTaskById(e.target.id), (e.target.parentNode).parentNode);
        }
    }

    /**
    * Function starts after load html document.
    */
    function init()
    {
        document.getElementById('enterTask').addEventListener('keypress',createTask,false);
        document.getElementById('checkAll').addEventListener('click', checkAll, false);
        displayAll();
    }
    window.createTask = createTask;
    window.init = init;
})();