(function ()
{

	function read(url,callback, http)
	{
		http.open('GET', url, true);
		http.onreadystatechange = function() {             
         		if (http.readyState === 4 )  
         	    {
         	        if(http.status === 200)
         	        {
         	            callback(http.responseText);
         	        }
         	        if(http.status === 404)
         	        {
         	            alert('Error 404. Check the file path to the data.');
         	        }
         	    }  
            }
        http.send();
	}

	function create(url, data, http)
	{
		http.open('POST', url, true);
		http.setRequestHeader('Content-Type', 'application/json');
        http.send(data);
	}

	function updata(url, data, http)
	{
		http.open('PUT', url, true);
		http.setRequestHeader('Content-Type', 'application/json');
        http.send(data);
	}

	function remove(url, http)
	{
		http.open("DELETE", url ,true);
		http.send();
	}

	function init()
	{
		var xhr = new XMLHttpRequest();
		//create('http://localhost:3000/task', JSON.stringify({task :  "do something", status : false}), xhr);
		//create('http://localhost:3000/task', JSON.stringify({name : 'do something else'}), xhr);
		read('http://localhost:3000/task/1', function(text){console.log((JSON.parse(text)).task);}, xhr);
		//updata('http://localhost:3000/task/1', JSON.stringify({name : 'do something else', status : true}), xhr);
		//remove('http://localhost:3000/task/1', xhr);
		

	}
	
	/**
    * assignment function init () global status.JSON.parse
    */
	window.init = init;
}())
