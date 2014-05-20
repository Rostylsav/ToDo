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

Backbone.sync = function(method, model, options) {
    switch (method) {
        case 'create':{
            reqRes(
                'https://www.localhost:3000/task',
                options[0],
                options[1],
                {
                    method : 'POST',
                    data : JSON.stringify(model)
                }
            );
            break;
        }
        case 'update':{
            reqRes(
                'https://www.localhost:3000/task',
                options[0],
                options[1],
                {
                    method : 'PUT',
                    data : JSON.stringify(model)
                }
            );
            break;
        }
        case 'delete':{
            reqRes(
                'https://www.localhost:3000/task',
                options[0],
                options[1],
                {
                    method : 'DELETE',
                    data : JSON.stringify(model)
                }
            );
            break; 
        }
        case 'read':{
            reqRes(
                'https://www.localhost:3000/task',
                options[0],
                options[1],
                {
                    method : 'GET',
                    data : JSON.stringify(model)
                }
            );
            break;
        }
    }
}; 