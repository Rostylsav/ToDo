require(['jquery', 'underscore', 'backbone','backbone.localStorage'], 
    function (){
            var index = 1;

            var Task = Backbone.Model.extend({
                defaults: {
                    title: "Something to do...",
                    order: index,
                    done: false
                },
                initialize: function() {
                    if (this.get("title") === '') {
                        this.set({"title": this.defaults.title});
                    }
                },
                toggle: function() {
                    this.save({done: !this.get("done")});
                },
                remove: function() {
                    this.destroy();
                }
            });

            var TasksList = Backbone.Collection.extend({
                model: Task,
                localStorage : new Store("listOfTasks"),
                done: function() {
                    return this.filter(function(task){ return task.get('done'); });
                },
                remaining: function() {
                    return this.without.apply(this, this.done());
                }
            });
            var tasksList = new TasksList;

            var TaskView = Backbone.View.extend({
                tagName:  "div",
                template: _.template($('#item-template').html()),
                events: {
                    "click .toggle"   : "toggleDone",
                    "click button.destroy" : "del"
                },

                initialize: function() {
                    this.model.bind('change', this.render, this);
                    this.model.bind('destroy', this.remove, this);
                },
                render: function() {
                    this.$el.html(this.template(this.model.toJSON()));
                    this.$el.toggleClass('done', this.model.get('done'));
                    return this;
                },
                toggleDone: function() {
                    this.model.toggle();
                },
                del: function() {
                    this.model.remove();
                }
            });

            var AppView = Backbone.View.extend({
                el: $("#containerForTodo"),
                events: {
                    "keypress #newTask":  "createOnEnter",
                    "click #chackAll": "chackAll",
                    "click #all": 'allTasks',
                    "click #active": 'activeTasks',
                    "click #done": 'doneTasks'
                },
                initialize: function() {
                    this.input = this.$("#newTask");
                    this.allCheckbox = this.$("#chackAll")[0];

                    tasksList.bind('add', this.displayTask, this);
                    tasksList.bind('all', this.render, this);

                    this.main = $('#containerForTasks');
                    tasksList.fetch();
                },
                render: function() {
                    if (tasksList.length) {
                        this.main.show();
                        this.main.find('#countOfTasks').text('task to do ' + tasksList.remaining().length);
                    }
                    else {
                        this.main.hide();
                    }
                },
                displayTask: function(task) {
                    var view = new TaskView({model: task});
                    this.$("#listOfTasks").append(view.render().el);
                },
                createOnEnter: function(e) {
                    if (e.keyCode === 13){
                        if (this.input.val()) {
                            tasksList.create({title: this.input.val()});
                            this.input.val('');
                        }
                    }
                },
                chackAll: function () {
                    var done = this.allCheckbox.checked;
                    tasksList.each(function (task) { task.save({'done': done}); });
                },

                displayAll: function(array){
                    var that = this;
                    this.$("#listOfTasks").html('');
                    array.forEach(
                        function(task){
                            that.displayTask(task);
                        }
                    );
                },
                allTasks: function(){
                    this.displayAll(tasksList.models);
                },
                activeTasks: function(){
                    this.displayAll(tasksList.remaining());
                },
                doneTasks: function(){
                    this.displayAll(tasksList.done());
                }
            });
        $(function(){
            var app = new AppView;
            //app.displayAll(tasksList.models);
            //localStorage.clear();
        });
    }
);