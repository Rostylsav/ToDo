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
		var obj ={
				task:'do something else and go',
				status:'false'
			}
			console.log(obj.toString());
		//create('http://localhost:3000/task', JSON.stringify({name :  obj.toString()}), xhr);
		//create('http://localhost:3000/task', JSON.stringify({name : 'do something else'}), xhr);
		read('http://localhost:3000/task/1', function(text){var map = JSON.parse(text);console.log(map.name);}, xhr);
		//updata('http://localhost:3000/task/1', JSON.stringify({name : 'do something else'}), xhr);
		//remove('http://localhost:3000/task/1', xhr);
		

	}
	
	/**
    * assignment function init () global status.
    */
	window.init = init;
}())
