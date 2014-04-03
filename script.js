(function ()
{
	
	/**
    * The function that displays a collection of object on the screen.
	* @param {String} url. Adres of file which contains data.
	* @param {Function} callback. Function which will run after receiving data.
	* @param {Object} obj.
		* @property {String} method. Name of method for creation XmlHttpRequest.
		* @property {String} data. Data to send to the server
    */	
    function reqRes(url, callback, obj) 
    {

    	var options = obj || {};
    	var method = options.method || 'GET';
     	var xhr = new XMLHttpRequest();
     	var data = null;

     	xhr.open(method, url, true);
     	if(options.data && method === 'POST')
     	{
     		data = options.data;
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
         	            alert('Error 404. Check the file path to the data.');
         	        }
         	    }  
            }
        xhr.send(data);
    } 
    /**
    * Get string which will be a collection of object then sort and disply.
    * After send data to server.
	* @param {String} text. Data for sorting and disply.
    */	
    function getCollection(text)
    {
        console.log(text)
       	reqRes('/app', function(){}, {method:'POST', data: 'POST samthing '}); 	
       // reqRes('/app', function(){}, {method:'PUT', data: 'PUT samthing'}); 
    }

    
	/**
    * The function is executed after loading html page.
    */
	function init()
	{
		reqRes('data.txt', getCollection);
	}
	
	/**
    * assignment function init () global status.
    */
	window.init = init;
}())
