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
                                    '<button id="completed" class="buttomFilter">Completed</button>',

        templateFormForChange = '<div id="parentForm"></div>'+
                                '<div id="form" style="display: block;">'+
                                    '<input class="input" type="text"></input>'+
                                    '<button id="buttonEnter" class="showValue">Change</button>'+
                                    '<button id="buttonEsc" class="showValue">Close</button>'+
                                '</div>';

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
        var components = template( templateTask, task);
        components.find('div').on('dblclick', createForm);
        components.find('input').on("click", mark);
        components.find('button').on('click',remove);
        containerOfOneTask.append(components);
        if(!($('#task' + task._id).length)){
            container.append(containerOfOneTask);
            containerOfOneTask.hide();
            containerOfOneTask.show(500);
        }
        $('#enterTask').val('');
    }

    /**
    * Shows container which contains buttons for filtering. 
    */ 
    function displayBottomContainer(){
        var container = $('#bottomContainer');
        container.html('');
        var bottomContainer = template(templateBottomContainer, {taskToDo:taskToDo});
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
                $('#task' + e.target.getAttribute('data-id')).hide(500, 'linear', function(){ $('#task' + e.target.getAttribute('data-id')).remove();});
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
    * Create form for change task.
    * @param {Event} e.
    */
    function createForm(e){
        elementId =  e.target.getAttribute('data-id');
        if(!($('#parentForm').length)){
            var form = template(templateFormForChange);
            form.find('#buttonEnter').on('click', showValue);
            form.find('#buttonEsc').on('click', showValue);
            $('#conteinerForDisply').append(form);
            form.hide();
        }
        $('#parentForm').show(0);
        $('#form').show(500);
        $('.input').val($("div[data-id='" + elementId + "']").text());
        $('.input').focus();
        $('.input').select();
    }

    /**
    * if press enter display new name of task , if press esc return old name of task.
    * @param {Event} e.
    */
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
            $('#parentForm').hide();
            $('#form').hide();
        }
        if(e.target.id === 'buttonEsc'){
            console.log('work');
            var task = collectionOfTask.getElementById(elementId);
            $('#components'+ elementId).remove();
            displayTask(task);
            $('#parentForm').hide();
            $('#form').hide();
        }
    }

    $(function(){
        collectionOfTask = new MyCollection('http://localhost:3000/task');
        $('#enterTask').on('keypress',createTask);
        $('#checkAll').on('click', checkAll);
        collectionOfTask.load(
            function (data){
                showAllTasks(data);
            }
        );
    });
})(jQuery); 