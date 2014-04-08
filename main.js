(function()
{
    /**
    * Variable that stores the number of tasks to perform
    */  
    var taskToDo = 0,
        collection = [];

    /**
    * Called in case of error during request to the server.
    * @param {String} text. String for display.
    */   
    function error(text)
    {
        console.log('Error is :' + text);
    }
    /**
    * Get elment from colection by id.
    * @param {Array} array. Collection of task.
    * @param {Number} id. Id for looking element.
    */ 
    function getTaskById(array, id)
    {
        for( var i = 0 ; i < array.length; i++)
        { 
            if(array[i]._id === id)
            {
                return array[i];
            }
        }
    }

    /**
    * Changing value and status of task
    * @param {Object} obj. Object with parameters task (new value of task) and status(new status of task).
    * @param {Event} e. 
    */ 
    function chageTask(obj, e)
    {
        updataById(obj, function(text){
                    if(obj.hasOwnProperty('task'))
                    {
                        getTaskById(collection, e.target.getAttribute('data-id')).task = JSON.parse(text).task;
                    }
                    if(obj.hasOwnProperty('status'))
                    {
                        getTaskById(collection, e.target.getAttribute('data-id')).status = JSON.parse(text).status;
                    }
                    showAllTasks(collection);
                }, error);
    }

    /**
    * Display all task.
    */ 
    function displayAll()
    {
        readAll(function(text){
                collection = JSON.parse(text);
                showAllTasks(collection);
                }, error); 
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
            if(!(array[i].status))
            {
                taskToDo++;
            }
        }
        showBottomContainer();     
    }

    /**
    * Shows the task by creating all html elements
    * @param {Object} task. It contains properties task{string}(that you want to do) and
    *                 status{Boolean}(status of task) and _id{number}(id of task).
    */  
    function showTask(task)
    {
        var container= document.getElementById('containerShowTask');

        var containerOneTask = document.createElement('div');
            containerOneTask.setAttribute('data-id',task._id);
            containerOneTask.className="containerOneTask";

        var div = document.createElement('div');
            div.setAttribute('data-id',task._id);
            div.className = 'showValueOfTask';
            div.ondblclick = changeValue;

        var checkbox = document.createElement('input');
            checkbox.setAttribute('data-id',task._id);
            checkbox.className = 'checkbox';
            checkbox.type = 'checkbox';
            checkbox.checked = task.status;
            if(task.status == true)
            {
                div.className = "showValueOfCheckedTask";
            }
            checkbox.addEventListener("click", mark, false);

        var button=document.createElement('button');
            button.setAttribute('data-id',task._id);
            button.className = "button";
            button.addEventListener('click',remove, false);

        button.appendChild(document.createTextNode('R'));
        div.appendChild(document.createTextNode(task.task));
        document.getElementById('enterTask').value=''; 

        containerOneTask.appendChild(checkbox);
        containerOneTask.appendChild(div);
        containerOneTask.appendChild(button);
        container.appendChild(containerOneTask);
    }

    /**
    * Shows container which contains buttons for filtering. 
    */ 
    function showBottomContainer()
    {
        var container= document.getElementById('containerShowTask');

        var containerBottom = document.createElement('div');
            containerBottom.setAttribute('data-id',0);
            containerBottom.className="containerOneTask";

        var countOfTasks = document.createElement('div');
            countOfTasks.setAttribute('data-id',0);
            countOfTasks.className = 'showCountOfTask';
            countOfTasks.appendChild(document.createTextNode('Task to do: '+ taskToDo));

        var active=document.createElement('button');
            active.id = 'active';
            active.setAttribute('data-id',0);
            active.className = "buttomFilter";
            active.addEventListener('click', filter, false);
            active.appendChild(document.createTextNode('Active'));

        var completed=document.createElement('button');
            completed.id = 'completed';
            completed.setAttribute('data-id',0);
            completed.className = "buttomFilter";
            completed.addEventListener('click', filter, false);
            completed.appendChild(document.createTextNode('Completed'));

        var all=document.createElement('button');
            all.setAttribute('data-id',0);
            all.className = "buttomFilter";
            all.addEventListener('click', displayAll, false);
            all.appendChild(document.createTextNode('All'));

        containerBottom.appendChild(countOfTasks);
        containerBottom.appendChild(all);
        containerBottom.appendChild(active);
        containerBottom.appendChild(completed);
        container.appendChild(containerBottom);
    }

    /**
    * Called by pressing Enter and creates a new task on a server.
    * @param {Event} e.
    */ 
    function ifPressEnter(e)
    {
        if (e.keyCode === 13)
        {
            if(document.getElementById('enterTask').value !='')
            {
                create({task: document.getElementById('enterTask').value, status: false}, function(text){ 
                        collection.push(JSON.parse(text));
                        showAllTasks(collection);
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
        }
        chageTask({status: isCheck, _id:e.target.getAttribute('data-id')}, e);
    }

    /**
    * Delete task by id.
    * @param {Event} e.
    */
    function remove(e)
    {
        removeById({_id:e.target.getAttribute('data-id')}, function(){
                    for( var i = 0 ; i < collection.length; i++)
                    { 
                        if(collection[i]._id === e.target.getAttribute('data-id'))
                        {
                            collection.splice(i, 1);
                        }
                    }
                    showAllTasks(collection);
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
           var status = true;
           taskToDo = 0;
        }
        for( var i = 0 ; i < collection.length ; i++)
        {
            updataById({status:status, _id:collection[i]._id}, function(){}, error);
        }       
        displayAll();
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
            if(collection[i].status == status)
            {
                array.push(collection[i]);
            }
        }
        showAllTasks(array);
    }

    /**
    * Changing html element div to input for changing value of target task 
    * @param {Event} e.
    */
    function changeDivToInput(e)
    {
        var inputbox = document.createElement('input');
            inputbox.setAttribute('data-id', e.target.getAttribute('data-id'));
            inputbox.className = 'inputbox';
            inputbox.type = 'text';
            inputbox.value = e.target.innerHTML;
            e.target.innerHTML = '';
            inputbox.addEventListener("keypress", change, false);
        e.target.appendChild(inputbox);
    }

    /**
    * Changing value of task on new value
    * @param {Event} e.
    */
    function change(e)
    {
        if (e.keyCode === 13)
        {
            chageTask({task: e.target.value, _id:e.target.getAttribute('data-id')}, e);
            showAllTasks(collection);
        }
    }

    /**
    * Function starts after load html document.
    */
    function init()
    {
        document.getElementById('enterTask').addEventListener('keypress',ifPressEnter,false);
        document.getElementById('checkAll').addEventListener('click', checkAll, false);
        displayAll();
    }
    window.ifPressEnter = ifPressEnter;
    window.init = init;
})();