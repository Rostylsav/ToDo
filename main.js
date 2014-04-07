(function()
{
    /**
    * Variable that stores the number of tasks to perform
    */  
    var taskToDo = 0;


    /**
    * Called in case of error during request to the server.
    * @param {String} text. String for disply.
    */   
    function error(text)
    {
        console.log('Error is :' + text);
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
                readAll(showAllTasks, error);
            }, error);
        }
    }

    /**
    * Shows the task by creating all html elements
    * @param {String} url. Adres of file which contains data.
    * @param {Boolean} status. Adres of file which contains data.
    * @param {Number} id. Adres of file which contains data.
    */  
    function showTask(text,status,id)
    {
        var container= document.getElementById('containerShowTask');

        var containerOneTask = document.createElement('div');
            containerOneTask.setAttribute('data-id',id);
            containerOneTask.className="containerOneTask";

        var div = document.createElement('div');
            div.setAttribute('data-id',id);
            div.className = 'showValueOfTask';

        var checkbox = document.createElement('input');
            checkbox.setAttribute('data-id',id);
            checkbox.className = 'checkbox';
            checkbox.type = 'checkbox';
            checkbox.checked = status;
            if(status == true)
            {
                div.className = "showValueOfCheckedTask";
            }
            checkbox.addEventListener("click", mark, false);

        var button=document.createElement('button');
            button.setAttribute('data-id',id);
            button.className = "button";
            button.addEventListener('click',remove, false);

        button.appendChild(document.createTextNode('R'));
        div.appendChild(document.createTextNode(text));
        document.getElementById('enterTask').value=''; 

        containerOneTask.appendChild(checkbox);
        containerOneTask.appendChild(div);
        containerOneTask.appendChild(button);
        container.appendChild(containerOneTask);
    }

    /**
    * Shows all task
    */ 
    function showAllTasks()
    {
        document.getElementById('containerShowTask').innerHTML = '';
        readAll(function(text){
                    var colectionOfTask = JSON.parse(text);
                    taskToDo = 0;
                    for( var i = 0 ; i < colectionOfTask.length ; i++)
                        {
                            showTask(colectionOfTask[i].task, colectionOfTask[i].status, colectionOfTask[i]._id);
                            if(!(colectionOfTask[i].status))
                            {
                                taskToDo++;
                            }
                        }
                        showBottomContainer();
                }, error);       
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
            all.addEventListener('click', showAllTasks, false);
            all.appendChild(document.createTextNode('All'));

        containerBottom.appendChild(countOfTasks);
        containerBottom.appendChild(all);
        containerBottom.appendChild(active);
        containerBottom.appendChild(copleted);
        container.appendChild(containerBottom);
    }

    /**
    * Changing status of task  and display it
    * @param {Event} e.
    */ 
    function mark(e)
    {
        var status = false;
        if(e.target.checked)
        {
            status = true;
        }
        updataById({status : status}, showAllTasks, error, e.target.getAttribute('data-id'));
    }

    /**
    * Delete task by id.
    * @param {Event} e.
    */
    function remove(e)
    {
        removeById(showAllTasks, error, e.target.getAttribute('data-id'));
    }

    /**
    * Disply all active task
    */
    function activeTasks()
    {
        document.getElementById('containerShowTask').innerHTML = '';

        readAll(function(text){
                    var colectionOfTask = JSON.parse(text);
                    taskToDo = 0;
                    for( var i = 0 ; i < colectionOfTask.length ; i++)
                        {
                            if(!(colectionOfTask[i].status))
                            {
                                showTask(colectionOfTask[i].task, colectionOfTask[i].status, colectionOfTask[i]._id);
                            }
                        }
                        showBottomContainer();
                }, error);
    }
    /**
    * Disply completed  task
    */
    function completedTasks()
    {
        document.getElementById('containerShowTask').innerHTML = '';
        readAll(function(text){
                    var colectionOfTask = JSON.parse(text);
                    taskToDo = 0;
                    for( var i = 0 ; i < colectionOfTask.length ; i++)
                        {
                            if(colectionOfTask[i].status)
                            {
                                showTask(colectionOfTask[i].task, colectionOfTask[i].status, colectionOfTask[i]._id);
                            }
                        }
                        showBottomContainer();
                }, error);
    }

    /**
    * Changing status of all task and disply them.
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
                var colectionOfTask = JSON.parse(text);
                taskToDo = 0;
                console.log(colectionOfTask);
                for( var i = 0 ; i < colectionOfTask.length ; i++)
                {
                    updataById({status : status}, function(){}, error, colectionOfTask[i]._id);
                }       
                showAllTasks();
            }, error); 
           
    }

    /**
    * Function starts after load html document.
    */
    function init()
    {
        document.getElementById('enterTask').addEventListener('keypress',ifPressEnter,false);
        document.getElementById('checkAll').addEventListener('click', checkAll, false);
        showAllTasks();
    }
    window.ifPressEnter = ifPressEnter;
    window.init = init;
})();