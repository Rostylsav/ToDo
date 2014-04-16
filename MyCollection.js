(function(){

	/**
	* Creates object MyCollection.
	* @constructor
	* @property {string} url. Link to data.
	*/
	function MyCollection(url)
	{
        /**
        * @property {string} url. Link to data.
        * @property {Array} collection. Array for object.
        */
		this.url = url;
	    this.collection = [];

        /**
        * Data are taken from the server and the function is performed on them
        * @param {Function} callback. Function which will run after receiving data.    
        */    
	    this.load = function(callback){
	    	var that = this;
	    	reqRes(that.url, function(text){ 
	    		that.collection = JSON.parse(text); 
	    		callback(that.collection);
	    	});
	    };

        /**
        * Creates new element after run callback.
        * @param {Object} obj. It contains properties for create new element.
        * @param {Function} callback. Function which will run after receiving data.
        * @param {Function} callbackError. Function which will run if will be some errors.
        */  
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

        /**
        * Change elemtn in colection on new element bu id.
        * @param {Object} obj. Object for change.
        */ 
		this.changeInCollection = function( obj) {
			for( var i = 0 ; i < this.collection.length; i++)
	        { 
	            if(this.collection[i]._id === obj._id)
	            {
	            	this.collection[i] = obj;
	            }
	        }
		};

        /**
        * Update element after run callback.
        * @param {Object} obj. It contains properties for updata .
        * @param {Function} callback. Function which will run after receiving data.
        * @param {Function} callbackError. Function which will run if will be some errors.
        */ 
		this.update = function( obj, callback, errorCallback ) {
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

        /**
        * Delete elment in collection by id.
        * @param {Number} id. Id of element.
        */
		this.deleteInColection = function( id ){
			for( var i = 0 ; i < this.collection.length; i++)
            { 
                if(this.collection[i]._id === id)
                {
                    this.collection.splice(i, 1);
                }
            }
		};

        /**
        * Delete element after run callback.
        * @param {Object} obj. It contains properties for delete .
        * @param {Function} callback. Function which will run after receiving data.
        * @param {Function} callbackError. Function which will run if will be some errors.
        */
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

        /**
        * Get elment from collection by id.
        * @param {Number} id. Id of element.
        */
		this.getElementById = function( id ){
			for( var i = 0 ; i < this.collection.length; i++)
            { 
                if(this.collection[i]._id === id)
                {
                   	return this.collection[i];
                }
            }
		};

        /**
        * Get new colection by property.
        * @param {Mixed} condition. Property for filter.
        */
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



