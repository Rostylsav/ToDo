function CollectionOfTask(url)
{
    this.collection = [];

    this.setCollection = function(){
        reqRes(url, function(text){ this.collection = JSON.parse(text); console.log('Filling of collection is  complete');});   
    }

    this.getCollection = function(){
    	return this.collection;
    }
}

var tasks = new CollectionOfTask('http://localhost:3000/task');
tasks.setCollection();

console.log(tasks.getCollection());

