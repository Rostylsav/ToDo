(function ()
{
	function reqRes(url, callback, callbackError, obj) 
    {
    	var options = obj || {},
    		method = options.method || 'GET',
     		data = null,
     		xhr = new XMLHttpRequest();
     	
     	xhr.open(method, url, true);
     	if(options.data)
     	{
     		if(method ==='PUT' || method === 'POST')
     		{
     			xhr.setRequestHeader('Content-Type', 'application/json');
     		    data = options.data;
     		}
     	}
        xhr.onreadystatechange = function() {             
         		if (xhr.readyState === 4 )  
         	    {
         	        if(xhr.status === 200)
         	        {
         	            callback(xhr.responseText);
         	        }
         	        else
         	        {
         	            callbackError(xhr.statusText);
         	        }
         	    }  
            }
        xhr.send(data);
    } 

    function showError(text)
    {
    	console.log(text);
    }

    function showTask(text)
    {
     	console.log((JSON.parse(text)).task);
    }


	function readAll(callback)
	{
		reqRes('http://localhost:3000/task', callback, showError);
	}

	function readById(callback, id)
	{
		reqRes('http://localhost:3000/task/' + id, callback, showError);
	}

	function readByStatus(callback, status)
	{
		reqRes('http://localhost:3000/task/' + status, callback, showError);
	}

	function create(task, callback)
	{
		reqRes('http://localhost:3000/task', callback, showError, {method : 'POST', data : JSON.stringify(task)});
	}

	function updata(task, callback, id)
	{
		reqRes('http://localhost:3000/task/'+id, callback, showError, {method : 'PUT', data : JSON.stringify(task)});
	}

	function remove(callback, id)
	{
		reqRes('http://localhost:3000/task/'+id, callback, showError, {method: 'DELETE', data : null});
	}

	function init()
	{
		
		//readAll(showTask);
		//readById(showTask, 2);

		create({task:'do something', status: false},function(){});
		create({task:'do something else', status: true},function(){});
		create({task:'do something else and go', status: false},function(){});
		readByStatus(showTask, false);
		//updata({task:'do something else', status: true,},function(){}, 1);
		//remove(function(){console.log("delete");}, 1);
		

	}
	
	/**
    * assignment function init () global status.JSON.parse
    */
	window.init = init;
}())
