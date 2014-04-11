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
			create(
				obj,
				function(task){ 
	                that.collection.push(JSON.parse(task));
	                callback(task);
	            },
	            errorCallback
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
			updataById(
				obj,
				function(newTask){ 
					var task = JSON.parse(newTask);
	                that.changeInCollection(task);
	                callback(newTask);
	            },
	            errorCallback
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
			removeById(
				obj,
				function(){
					that.deleteInColection(obj._id);
					callback();
        		},
        		errorCallback
        	);
		};

		this.getTaskById = function( id ){

			for( var i = 0 ; i < this.collection.length; i++)
            { 
                if(this.collection[i]._id === id)
                {
                   	return this.collection[i];
                }
            }
		}
	}

	window.MyCollection = MyCollection;
}());



