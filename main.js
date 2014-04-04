(function(){

    function error(text)
    {
        console.log(text);
    }
    function ifPressEnter(e)
    {
        if (e.keyCode === 13)
        {
            create({ task: document.getElementById('enterTask').value, status: false}, function(){
                readAll(showAllTask, error);
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

    function showAllTask()
    {
        document.getElementById('containerShowTask').innerHTML = '';
        readAll(function(text){
                    var colectionOfTask = JSON.parse(text);
                    for( var i = 0 ; i < colectionOfTask.length ; i++)
                        {
                            showTask(colectionOfTask[i].task, colectionOfTask[i].status, colectionOfTask[i]._id);
                        }
                }, error);
       
    }
    
    function mark(e)
    {
        var status = false;
        if(e.target.checked)
        {
            status = true;
        }
        updataById({status : status}, showAllTask, error, e.target.getAttribute('data-id'));
    }

    function remove(e)
    {
        removeById(showAllTask, error, e.target.getAttribute('data-id'));
    }


    function init()
    {
        document.getElementById('enterTask').addEventListener('keypress',ifPressEnter,false)
        showAllTask();
    }
    window.ifPressEnter = ifPressEnter;
    window.init = init;
})();