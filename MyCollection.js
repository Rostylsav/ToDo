(function(){

	function MyCollection(url)
	{
		this.url = url;
	    this.collection = [];

	    this.load = function(callback){
	    	var that = this;
	    	reqRes(that.url, function(text){ 
	    		that.collection = JSON.parse(text); 
	    		callback(that.collection);
	    	});
	    };

		this.create = function( obj, callback, errorCallback ) {
			var that = this;
			reqRes(
				that.url,
				function(task){ 
	                that.collection.push(JSON.parse(task));
	                callback(task);
	            },
	            errorCallback,
	            {
	            	method : 'POST',
	            	data : JSON.stringify(obj)
	            }
	        );
		};

		this.changeInCollection = function( obj) {
			for( var i = 0 ; i < this.collection.length; i++)
	        { 
	            if(this.collection[i]._id === obj._id)
	            {
	            	this.collection[i] = obj;
	            }
	        }
		};


		this.updata = function( obj, callback, errorCallback ) {
			var that = this;
			reqRes(
				that.url,
				function(newTask){ 
					var task = JSON.parse(newTask);
	                that.changeInCollection(task);
	                callback(newTask);
	            },
	            errorCallback,
	            {
	            	method : 'PUT',
	            	data : JSON.stringify(obj)
	            }
	        );
		};

		this.deleteInColection = function( id ){
			for( var i = 0 ; i < this.collection.length; i++)
            { 
                if(this.collection[i]._id === id)
                {
                    this.collection.splice(i, 1);
                }
            }
		};

		this.remove = function ( obj, callback, errorCallback ){
			var that = this;
			reqRes(
				that.url,
				function(){
					that.deleteInColection(obj._id);
					callback();
        		},
        		errorCallback,
	            {
	            	method : 'DELETE',
	            	data : JSON.stringify(obj)
	            }
        	);
		};

		this.getElementById = function( id ){
			for( var i = 0 ; i < this.collection.length; i++)
            { 
                if(this.collection[i]._id === id)
                {
                   	return this.collection[i];
                }
            }
		};

		this.getFilteredCollection = function (condition){
			var arrayToDisplay = [];
			for (var i = 0; i < this.collection.length; i++){
	            if(this.collection[i].status === condition){
	                arrayToDisplay.push(this.collection[i]);
	            }
	        }
	        return arrayToDisplay;
		};
	}

	window.MyCollection = MyCollection;
}());



