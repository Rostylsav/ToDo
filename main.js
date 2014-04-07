(function()
{
    /**
    * Variable that stores the number of tasks to perform
    */  
    var taskToDo = 0;
    /**
    * Called in case of error during request to the server.
    * @param {String} text. String for display.
    */   
    function error(text)
    {
        console.log('Error is :' + text);
    }


    function displayAll()
    {
        readAll(function(text){
                var collectionOfTask = JSON.parse(text);
                showAllTasks(collectionOfTask);
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
    * Shows container which contains button for filtering. 
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
            active.setAttribute('data-id',0);
            active.className = "buttomFilter";
            active.addEventListener('click', activeTasks, false);
            active.appendChild(document.createTextNode('Active'));

        var copleted=document.createElement('button');
            copleted.setAttribute('data-id',0);
            copleted.className = "buttomFilter";
            copleted.addEventListener('click', completedTasks, false);
            copleted.appendChild(document.createTextNode('Copleted'));

        var all=document.createElement('button');
            all.setAttribute('data-id',0);
            all.className = "buttomFilter";
            all.addEventListener('click', displayAll, false);
            all.appendChild(document.createTextNode('All'));

        containerBottom.appendChild(countOfTasks);
        containerBottom.appendChild(all);
        containerBottom.appendChild(active);
        containerBottom.appendChild(copleted);
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
            create({ task: document.getElementById('enterTask').value, status: false}, function(){
                    displayAll();
            }, error);
        }
    }

    function mark(e)
    {
        var status = false;
        if(e.target.checked)
        {
            status = true;
        }
        updataById({status:status, _id:e.target.getAttribute('data-id')}, displayAll, error);
    }

    /**
    * Delete task by id.
    * @param {Event} e.
    */
    function remove(e)
    {
        removeById({_id:e.target.getAttribute('data-id')}, displayAll, error);
    }

    /**
    * Display all active task
    */
    function activeTasks()
    {

    }
    /**
    * Display completed  task
    */
    function completedTasks()
    {

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
        }
        readAll(function(text){
                var collectionOfTask = JSON.parse(text);
                taskToDo = 0;
                for( var i = 0 ; i < collectionOfTask.length ; i++)
                {
                    updataById({status:status, _id:collectionOfTask[i]._id}, displayAll, error);
                }       
            }, error); 
           
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