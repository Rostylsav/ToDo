(function($, undefined){
    /**
    * Variable
    */  
    var taskToDo = 0,
        collectionOfTask,
        elementId,
        templateTask = '<div id="components{{_id}}" class="containerOfOneTask">'+
                            '<input class="checkbox" type="checkbox" data-id="{{_id}}" {{checked}}></input>'+
                            '<div class="{{statusClass}}" data-id="{{_id}}">'+
                                '{{task}}'+
                            '</div>'+
                            '<button class="button" data-id="{{_id}}">R</button>'+
                        '</div>',
        templateBottomContainer =   '<div id="countOfTask" class="countOfTask">'+
                                        'Task to do: {{taskToDo}}'+        
                                    '</div>'+
                                    '<button id="all" class="buttomFilter">All</button>'+
                                    '<button id="active" class="buttomFilter">Active</button>'+
                                    '<button id="completed" class="buttomFilter">Completed</button>';

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
    function displayTask(task){
        var container= $('#containerShowTask');
        if($('#task' + task._id).length){
            var containerOfOneTask = $('#task' + task._id);
        }
        else{
            var containerOfOneTask = $('<div>').attr({
                'id' : 'task'+ task._id,
                'class' : 'containerOfOneTask' 
            });
        }
        task.statusClass = task.status ? 'checkedTask' : 'showValueOfTask';
        task.checked = task.status ? 'checked = "checked"' : '';

        var components = template(task, templateTask);

        components.find('div').on('dblclick', createForm);
       // components.find('div').on('click', createForm);
        components.find('input').on("click", mark);
        components.find('button').on('click',remove);
        containerOfOneTask.append(components);
        if(!($('#task' + task._id).length)){
            container.append(containerOfOneTask);
        }
       // $('.' + task.statusClass).on('click', createForm);
        $('#enterTask').val('');
    }

    /**
    * Shows container which contains buttons for filtering. 
    */ 
    function displayBottomContainer(){
        var container = $('#bottomContainer');
        container.html('');
        var bottomContainer = template({taskToDo:taskToDo},templateBottomContainer);
        container.append(bottomContainer);
        $('#active').on('click', filter);
        $('#completed').on('click', filter);
        $('#all').on('click', filter);
    }

    /**
    * Shows all task
    * @param {Array} array. collection of task for display.
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
        var taskName = $('#enterTask').val();
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
    * Change status and css style of task.
    * @param {Event} e.
    */ 
    function mark(e){
        var isCheck = false;

        if(e.target.checked){
            isCheck = true;
        }
        collectionOfTask.update(
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
                displayTask(task);

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
    * Change status of all tasks and display them.
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
            collectionOfTask.update(
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
        arrayToDisplay = collectionOfTask.getFilteredCollection({status:isCheck });  
        showAllTasks(arrayToDisplay);
        if(e.target.id === 'all'){
            showAllTasks(collectionOfTask.collection);
        }
    }

    /**
    * Changing html element div to input for changing value of target task 
    * @param {Event} e.
    */
    // function changeDivToInput(e) {

    //     if($('.inputboxForChange').length){
    //         var task = collectionOfTask.getElementById($('.inputboxForChange')[0].id);
    //         $('#components' + task._id).remove();
    //         displayTask(task);
    //     }

    //     var div = $("div[data-id='" + e.target.getAttribute('data-id') + "']");
    //     var inputbox = $('<input>').attr({
    //         'id' : e.target.getAttribute('data-id'),
    //         'class' : 'inputboxForChange',
    //         'type' : 'text'
    //     });

    //     inputbox.on("keydown", change);
    //     inputbox.val(div.text());
    //     div.text('').append(inputbox);
    //     inputbox.focus();
    //     inputbox.select();
    // }

    // /**
    // * Changing value of task on new value.
    // * @param {Event} e.
    // */
    // function change(e)
    // {   
    //     if (e.keyCode === 13)
    //     {
    //          collectionOfTask.update(
    //                 {
    //                     task: e.target.value,
    //                     _id: e.target.parentNode.getAttribute('data-id')
    //                 },
    //                 function(newTask){
    //                     var task = JSON.parse(newTask);
    //                     $('#components'+ e.target.parentNode.getAttribute('data-id')).remove();
    //                     displayTask(task);
    //                 },
    //                 error
    //             );
    //     }
    //     if(e.keyCode === 27)
    //     {
    //         var task = collectionOfTask.getElementById(e.target.parentNode.getAttribute('data-id'));
    //         $('#components'+ e.target.parentNode.getAttribute('data-id')).remove();
    //         displayTask(task);
    //     }
    // }



    function createForm(e){

         elementId =  e.target.getAttribute('data-id');

        var parenDiv = $('<div>').attr({
            'id': 'parentForm'
        });

        var div = $('<div>').attr({
            'id' : 'form'
        });

        var input = $('<input>').attr({
            'class' : 'input',
            'type' : 'text'
        });

        input.val($("div[data-id='" + elementId + "']").text());
        var buttonEnter =  $('<button>').attr({
            'id' : 'buttonEnter',
            'class' : 'showValue'
        });
        buttonEnter.on('click', showValue);
        buttonEnter.text('Change');

        var buttonEsc =  $('<button>').attr({
            'id' : 'buttonEsc',
            'class' : 'showValue'
        });
        buttonEsc.on('click', showValue);
        buttonEsc.text('Close');


        div.append(input);
        div.append(buttonEnter);
        div.append(buttonEsc);

        parenDiv.append(div);
        $('#conteinerForDisply').append(parenDiv);
        input.focus();
        input.select();
    }

    function showValue(e){
        if(e.target.id === 'buttonEnter'){
            var value = ($('.input').val());
            collectionOfTask.update(
                    {
                        task: value,
                        _id: elementId
                    },
                    function(newTask){
                        var task = JSON.parse(newTask);
                        $('#components'+ elementId).remove();
                        displayTask(task);
                    },
                    error
                );
            $('#parentForm').remove();
        }
        if(e.target.id === 'buttonEsc'){
            var task = collectionOfTask.getElementById(elementId);
            $('#components'+ elementId).remove();
            displayTask(task);
            $('#parentForm').remove();
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