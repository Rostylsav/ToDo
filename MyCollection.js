(function(){

	function Task(url)
	{
		this.url = url;
	    this.collection = [];

	    this.load = function(callback){
	    	reqRes(this.url, function(text){ 
	    		this.collection = JSON.parse(text); 
	    		callback(this.collection);
	    	});
	    }
	}
	function init()
	{
		document.getElementById('enterTask').addEventListener('keypress',createTask,false);
	    document.getElementById('checkAll').addEventListener('click', checkAll, false);


		var collectionOfTask = new Task('http://localhost:3000/task');
		collectionOfTask.load(function(data) {
			showAllTasks(data);
		});
	}
	window.init = init;
}());



