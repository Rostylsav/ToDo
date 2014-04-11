(function(){

	function MyCollection(url)
	{
		this.url = url;
	    this.collection = [];

	    this.load = function(callback){
	    	reqRes(this.url, function(text){ 
	    		this.collection = JSON.parse(text); 
	    		callback(this.collection);
	    	});
	    };

		this.create = function( obj, callback, erroeCallback ) {
			create(
				obj,
				function(task){ 
	                this.collection.push(JSON.parse(task));

	                callback(task);
	            },
	            erroeCallback
	        );
		};

		this.changeInCollection = function( obj ) {
			for( var i = 0 ; i < this.collection.length; i++)
	        { 
	            if(this.collection[i]._id === obj._id)
	            {
	                this.collection[i] = obj;
	            }
	        }
		};


		this.updata = function( obj, callback, erroeCallback ) {

			var that = this;

			updataById(
				obj,
				function(newTask){ 
					var task = JSON.parse(newTask);
	                that.changeInCollection(task);
	                callback(newTask);
	            },
	            erroeCallback
	        );
		};

			}

	window.MyCollection = MyCollection;
}());



