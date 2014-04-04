(function(){
    function ifPressEnter()
    {
        if (event.keyCode === 13)
        {
            create({ task: document.getElementById('enterTask').value, status: false}, function(){
                readAll(function(text){
                    var colectionOfTask = JSON.parse(text);
                    showAllTask(colectionOfTask)
                }, function(text){console.log(text);});
            }, function(text){console.log(text);});
        }
    }

    function showTask(text,status,id)
    {
        var container= document.getElementById('containerShowTask');

        var containerOneTask = document.createElement('div');
            containerOneTask.setAttribute('data-id',id);
            containerOneTask.className="containerOneTask";

        var checkbox = document.createElement('input');
            checkbox.setAttribute('data-id',id);
            checkbox.className = 'checkbox';
            checkbox.type = 'checkbox';
            checkbox.checked = status;

        var div = document.createElement('div');
            div.setAttribute('data-id',id);
            div.className = 'showValueOfTask';

        var button=document.createElement('button');
            button.setAttribute('data-id',id);
            button.className = "button";

        div.appendChild(document.createTextNode(text));
        document.getElementById('enterTask').value=''; 

        containerOneTask.appendChild(checkbox);
        containerOneTask.appendChild(div);
        containerOneTask.appendChild(button);
        container.appendChild(containerOneTask);
    }

    function showAllTask(colection)
    {
        document.getElementById('containerShowTask').innerHTML = '';
        for( var i = 0 ; i < colection.length ; i++)
        {
            showTask(colection[i].task, colection[i].status, colection[i]._id);
        }
    }


    function init()
    {

    }
    window.ifPressEnter = ifPressEnter;
    window.init = init;
})();