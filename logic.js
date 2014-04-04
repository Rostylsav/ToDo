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
                    callback(xhr.responseText);
         	        if(xhr.status != 200)
         	        {
         	            callbackError(xhr.statusText);
         	        }
         	    }  
            }
        xhr.send(data);
    } 

	function readAll(callback,callbackError)
	{
		reqRes('http://localhost:3000/task', callback, callbackError);
	}

	function readById(callback, callbackError, id)
	{
		reqRes('http://localhost:3000/task/' + id, callback, callbackError);
	}

	function create(task, callback, callbackError)
	{
		reqRes('http://localhost:3000/task', callback, callbackError, {method : 'POST', data : JSON.stringify(task)});
	}

	function updataById(task, callback, callbackError, id)
	{
		reqRes('http://localhost:3000/task/'+id, callback, callbackError, {method : 'PUT', data : JSON.stringify(task)});
	}

	function removeById(callback, callbackError, id)
	{
		reqRes('http://localhost:3000/task/'+id, callback, callbackError, {method: 'DELETE', data : null});
	}
	/**
    * assignment function init () global status.JSON.parse
    */
	window.readAll = readAll;
	window.readById = readById;
	window.create = create;
	window.updataById = updataById;
	window.removeById = removeById;
}())
