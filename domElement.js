(function($, undefined){
    var domTask ='<div class="containerOfOneTask" id="{{_id}}"><input class="checkbox" data-id="{{_id}}" type="checkbox"><div class="showValueOfTask" data-id="{{_id}}">{{task}}</div><button class="button" data-id="{{_id}}">R</button><div>';
    var task = {task:'rostyk', status:false, _id : 2};

    
$(function(){
        $('#test').append(showTask(task, domTask));
    });
})(jQuery);



