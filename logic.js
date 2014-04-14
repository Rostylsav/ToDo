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
        xhr.send(data);
    } 
    /**
    *  Global functions.
    */
    window.reqRes = reqRes;
}())
