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

		this.changeInCollection = function( obj, array) {

			for( var i = 0 ; i < array.length; i++)
	        { 
	            if(array[i]._id === obj._id)
	            {
	            	array[i] = obj;
	            }
	        }
		};


		this.updata = function( obj, callback, erroeCallback ) {

			var that = this;

			updataById(
				obj,
				function(newTask){ 
					var task = JSON.parse(newTask);
	                that.changeInCollection(task, this.collection);
	                callback(newTask);
	            },
	            erroeCallback
	        );
		};

		this.deleteInColection = function( id , array){
			for( var i = 0 ; i < array.length; i++)
            { 
                if(array[i]._id === id)
                {
                	if(!(array[i].status))
                	{
                		taskToDo--;
                	}
                    array.splice(i, 1);
                }
            }
		}

		this.remove = function ( obj, callback, erroeCallback ){

			var that = this;

			removeById(
				obj,
				function(){
					that.deleteInColection(obj._id, this.collection);
					callback();
        		},
        		erroeCallback
        	);
		};

		this.checkAll = function (isChack, callback, erroeCallback){
			for (var i = 0; i< this.collection.length; i++ )
			{
				this.updata(
					{
						status: isChack,
						_id: this.collection[i]._id
					},
					callback(newTask),
					erroeCallback
				);
			}
		};
	}

	window.MyCollection = MyCollection;
}());



