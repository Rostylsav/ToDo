(function ()
{
    /**
    * Creates a request to the server
    * @param {String} url. Adres of file which contains data.
    * @param {Function} callback. Function which will run after receiving data.
    * @param {Function} callbackError. Function which will run if will be some errors.
    * @param {Object} obj. It contains properties method{string}(name of method for creation XmlHttpRequest) and
    * data{string}(data to send to the server).
    */  
	function reqRes(url, callback, callbackError, obj) 
    {
    	var options = obj || {},
    		method = options.method || 'GET',
     		data = null,
     		xhr = new XMLHttpRequest();
     	
     	xhr.open(method, url, true);
     	if(options.data)
     	{
           
                xhr.setRequestHeader('Content-Type', 'application/json');
            
            data = options.data;
     	}
        xhr.onreadystatechange = function() {             
         		if (xhr.readyState === 4 )  
         	    {
                    if(xhr.status === 200 || xhr.status === 201)
                    {
                        if(typeof(callback) === 'function')
                        {
                            callback(xhr.responseText);
                        }
                        else
                        {
                            console.log(callback + 'is not a function.')
                        }
                    }
         	        else
         	        {
                        if(typeof(callbackError) === 'function')
         	            {
                            callbackError(xhr.statusText);
                        }
                        else
                        {
                            console.log(callbackError + 'is not a function.')
                        }
         	        }
         	    }  
            }
           // console.log('data = ' + data);
        xhr.send(data);
    } 

    /**
    * Sends a request to the server gets all the tasks and perform actions on them
    * @param {Function} callback. Function which will run after receiving data.
    * @param {Function} callbackError. Function which will run if will be some errors.
    */
	function readAll(callback,callbackError)
	{
		reqRes('http://localhost:3000/task', callback, callbackError);
	}

    /**
    * Sends a request to the server gets  task by id  and perform actions on it
    * @param {Function} callback. Function which will run after receiving data.
    * @param {Function} callbackError. Function which will run if will be some errors.
    * @param {Number} id. Id of task.
    */
	function readById(id, callback, callbackError)
	{
		reqRes('http://localhost:3000/task/' + id, callback, callbackError);
    }
    /**
    * Sends a request to the server to create a task.
    * @param {Object} task. It contains properties task{string}(that you want to do) and
    *                 status{Boolean}(Status of task) and _id{number}(id of task).
    * @param {Function} callback. Function which will run after receiving data.
    * @param {Function} callbackError. Function which will run if will be some errors.
    */
	function create(task, callback, callbackError)
	{
		reqRes('http://localhost:3000/task', callback, callbackError, {method : 'POST', data : JSON.stringify(task)});
	}

    /**
    * Sends a request to the server for updatas task by id.
   * @param {Object} task. It contains properties task{string}(that you want to do) and
    *                 status{Boolean}(Status of task) and _id{number}(id of task).
    * @param {Function} callback. Function which will run after receiving data.
    * @param {Function} callbackError. Function which will run if will be some errors.
    */
	function updataById(task, callback, callbackError)
	{
		reqRes('http://localhost:3000/task', callback, callbackError, {method : 'PUT', data : JSON.stringify(task)});
	}

    /**
    * Sends a request to the server for delete task by id
    * @param {Object} task. It contains properties task{string}(that you want to do) and
    *                 status{Boolean}(Status of task) and _id{number}(id of task).
    * @param {Function} callback. Function which will run after receiving data.
    * @param {Function} callbackError. Function which will run if will be some errors.
    */
	function removeById(task, callback, callbackError)
	{
		reqRes('http://localhost:3000/task', callback, callbackError, {method: 'DELETE', data : JSON.stringify(task)});
	}

	/**
    *  Global functions.
    */
	window.readAll = readAll;
	window.readById = readById;
	window.create = create;
	window.updataById = updataById;
	window.removeById = removeById;
}())
