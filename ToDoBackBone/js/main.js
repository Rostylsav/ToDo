require(['jquery', 'underscore', 'backbone','backbone.localStorage'], 
    function (){
            var index = 1;
            var Todo = Backbone.Model.extend({
                defaults: {
                    title: "Something to do...",
                    order: index,
                    done: false
                },
                initialize: function() {
                    if (!this.get("title")) {
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

            var TodoList = Backbone.Collection.extend({
                model: Todo,
                localStorage : new Store("listOfTasks"),
                done: function() {
                    return this.filter(function(todo){ return todo.get('done'); });
                },
                remaining: function() {
                    return this.without.apply(this, this.done());
                }
            });
            var todos = new TodoList;

            var TaskView = Backbone.View.extend({
                tagName:  "li",
                template: _.template($('#item-template').html()),
                events: {
                    "click .toggle"   : "toggleDone",
                    "click a.destroy" : "del"
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

                    todos.bind('add', this.displayTask, this);
                    todos.bind('all', this.render, this);

                    this.main = $('#containerForTasks');
                    todos.fetch();
                },
                render: function() {
                    if (todos.length) {
                        this.main.show();
                    }
                    else {
                        this.main.hide();
                    }
                },
                displayTask: function(todo) {
                    var view = new TaskView({model: todo});
                    this.$("#listOfTasks").append(view.render().el);
                },
                createOnEnter: function(e) {
                    var that = this;
                    if (e.keyCode === 13){
                        if (this.input.val()) {
                            todos.create({title: this.input.val()});
                            this.input.val('');
                        }
                    }
                },
                chackAll: function () {
                    var done = this.allCheckbox.checked;
                    todos.each(function (todo) { todo.save({'done': done}); });
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
                    this.displayAll(todos.models);
                },
                activeTasks: function(){
                    this.displayAll(todos.remaining());
                },
                doneTasks: function(){
                    this.displayAll(todos.done());
                }
            });
        $(function(){
            var app = new AppView;
            app.displayAll(todos.models);
            //localStorage.clear();
        });
    }
);