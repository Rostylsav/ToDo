(function($, undefined){
    /**
    * Variable that stores the number of tasks to perform
    */  
    var taskToDo = 0,
        collectionOfTask,
        ElementWhichUpdating,
        templateTask = '<div id="components{{_id}}" class="containerOfOneTask"><input class="checkbox" type="checkbox" data-id="{{_id}}"></input><div class="showValueOfTask" data-id="{{_id}}">{{task}}</div><button class="button" data-id="{{_id}}">R</button></div>' ;

    /**
    * Called in case of error during request to the server.
    * @param {String} text. String for display.
    */   
    function error(text){
        console.log('Error is :' + text);
    }
    /**
    * Shows the task by creating all html elements
    * @param {Object} task. It contains properties task{string}(that you want to do) and
    *                 status{Boolean}(status of task) and _id{number}(id of task).
    */  
    function displayTask(task, id){
        var container= $('#containerShowTask');


        if(id){
            var containerOfOneTask = $('#task' + id);
        }
        else{
            var containerOfOneTask = $('<div>').attr({
                'id' : 'task'+ task._id,
                'class' : 'containerOfOneTask' 
            });
        }
        var components = template(task, templateTask);

        components.find('div').on('dblclick', changeDivToInput);
        components.find('input').on("click", mark);
        components.find('button').on('click',remove);


        containerOfOneTask.append(components);
        if(!(id)){
            container.append(containerOfOneTask);
        }
        $('#enterTask').val('');


        //     );
        // var components = $('<div>').attr({
        //     'id' : 'components'+ task._id,
        //     'class' : 'containerOfOneTask' 
        // });

        // var div = $('<div>').attr({
        //     'data-id' : task._id,
        //     'class' : 'showValueOfTask'
        // });
        // div.on('dblclick', changeDivToInput);
        // div.text(task.task);
        // var checkbox = $('<input>').attr({
        //     'data-id' : task._id,
        //     'class' : 'checkbox',
        //     'type' : 'checkbox',
        //     'checked' : task.status
        // });
        // if(task.status == true){
        //     div.attr({
        //         'class' : 'checkedTask'
        //     });
        // }
        // checkbox.on("click", mark);

        // var button = $('<button>').attr({
        //     'data-id' : task._id,
        //     'class' : 'button'
        // });
        // button.on('click',remove);
        // button.text('R');
          
        

        // components.append(checkbox).append(div).append(button);
        // containerOfOneTask.append(components);
        // if(!(id)){
        //     container.append(containerOfOneTask);
        // }
    }

    /**
    * Shows container which contains buttons for filtering. 
    */ 
    function displayBottomContainer(){
        var container = $('#bottomContainer');
        container.html('');

        var countOfTasks = $('<div>').attr({
            'id' : "countOfTask",
            'class' : 'countOfTask'
        });
        countOfTasks.text('Task to do: ' + taskToDo);
            
        var active = $('<button>').attr({
            'id' : 'active',
            'class' : 'buttomFilter'
        });
        active.on('click', filter);
        active.text('Active');
            

        var completed = $('<button>').attr({
            'id' : 'completed',
            'class' : 'buttomFilter'
        });
        completed.on('click', filter);
        completed.text('Completed');

        var all = $('<button>').attr({
            'id' : 'all',
            'class' : 'buttomFilter'
        });
        all.on('click', filter);
        all.text('All');

        container.append(countOfTasks).append(all).append(active).append(completed);
    }

    /**
    * Shows all task
    * @param {Array} array. collectionOfTask of task for display.
    */ 
    function showAllTasks(array){
        $('#containerShowTask').text('');
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
                        $('#countOfTask').text('Task to do: ' + taskToDo);
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
                $('#components'+ e.target.getAttribute('data-id')).remove();
                displayTask(task, e.target.getAttribute('data-id'));

                $('#countOfTask').text('').text('Task to do: ' + taskToDo);
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
                    $('#countOfTask').text('').text('Task to do: ' + taskToDo);
                    $('#task' + e.target.getAttribute('data-id')).remove();
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
            $('#containerShowTask').html('');

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
                    var task = JSON.parse(newTask);
                    displayTask(task);
                },
                error
            );
        }
        $('#countOfTask').text('').text('Task to do: ' + taskToDo);
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

        if($('.inputboxForChange').length){
            var task = collectionOfTask.getElementById($('.inputboxForChange')[0].id);
            console.log(task);
            $('#components' + task._id).remove();
            displayTask(task, task._id);
        }

        var div = $("div[data-id='" + e.target.getAttribute('data-id') + "']");
        var inputbox = $('<input>').attr({
            'id' : e.target.getAttribute('data-id'),
            'class' : 'inputboxForChange',
            'type' : 'text'
        });

        inputbox.on("keydown", change);
        inputbox.val(div.text());
        div.text('').append(inputbox);
        inputbox.focus();
        inputbox.select();
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
                        _id: e.target.parentNode.getAttribute('data-id')
                    },
                    function(newTask){
                        var task = JSON.parse(newTask);
                        $('#components'+ e.target.parentNode.getAttribute('data-id')).remove();
                        displayTask(task, e.target.parentNode.getAttribute('data-id'));
                    },
                    error
                );
        }
        if(e.keyCode === 27)
        {
            var task = collectionOfTask.getElementById(e.target.parentNode.getAttribute('data-id'));
            $('#components'+ e.target.parentNode.getAttribute('data-id')).remove();
            displayTask(task, e.target.parentNode.getAttribute('data-id'));
        }
    }

    $(function(){
        collectionOfTask = new MyCollection('http://localhost:3000/task');

        document.getElementById('enterTask').addEventListener('keypress',createTask,false);
        document.getElementById('checkAll').addEventListener('click', checkAll, false);
        
        collectionOfTask.load(
            function (data){
                showAllTasks(data);
            }
        );
    });
})(jQuery); 