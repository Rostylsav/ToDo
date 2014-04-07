(function()
{
    var taskToDo = 0;

    function error(text)
    {
        console.log('Error is :' + text);
    }

    function ifPressEnter(e)
    {
        if (e.keyCode === 13)
        {
            create({ task: document.getElementById('enterTask').value, status: false}, function(){
                readAll(showAllTasks, error);
            }, error);
        }
    }

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

    function mark(e)
    {
        var status = false;
        if(e.target.checked)
        {
            status = true;
        }
        updataById({status : status}, showAllTasks, error, e.target.getAttribute('data-id'));
    }

    function remove(e)
    {
        removeById(showAllTasks, error, e.target.getAttribute('data-id'));
    }

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
                                taskToDo++;
                            }
                        }
                        showBottomContainer();
                }, error);
    }

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
                            if(!(colectionOfTask[i].status))
                            {
                                taskToDo++;
                            }
                        }
                        showBottomContainer();
                }, error);
    }

    function checkAll(e)
    {
        var status = false;
        if(e.target.checked)
        {
           var status = true;
        }
        else
        {
            var status = false;
        }
        readAll(function(text){
                var colectionOfTask = JSON.parse(text);
                taskToDo = 0;
                console.log(colectionOfTask);
                for( var i = 0 ; i < colectionOfTask.length ; i++)
                {
                    updataById({status : status}, function(){}, error, colectionOfTask[i]._id);
                }       
            }, error); 
            showAllTasks();
    }

    function init()
    {
        document.getElementById('enterTask').addEventListener('keypress',ifPressEnter,false);
        document.getElementById('checkAll').addEventListener('click', checkAll, false);
        showAllTasks();
    }
    window.ifPressEnter = ifPressEnter;
    window.init = init;
})();