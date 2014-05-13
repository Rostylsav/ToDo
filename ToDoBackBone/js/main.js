require(['jquery', 'underscore', 'backbone','backbone.localStorage'], 
    function (){
        $(function(){
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
                localStorage: new Store("todos-backbone"),
                done: function() {
                    return this.filter(function(todo){ return todo.get('done'); });
                },
                remaining: function() {
                    return this.without.apply(this, this.done());
                }
            });
            var Todos = new TodoList;

            var TodoView = Backbone.View.extend({
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
                    "click #chackAll": "chackAll"
                },
                initialize: function() {
                    this.input = this.$("#newTask");
                    this.allCheckbox = this.$("#chackAll")[0];

                    Todos.bind('add', this.addOne, this);
                    Todos.bind('all', this.render, this);
                    this.main = $('#containerForTasks');
                    Todos.fetch();
                },
                render: function() {
                    var done = Todos.done().length;
                    var remaining = Todos.remaining().length;
                    if (Todos.length) {
                        this.main.show();
                    }
                    else {
                        this.main.hide();
                    }
                    this.allCheckbox.checked = !remaining;
                },
                addOne: function(todo) {
                    var view = new TodoView({model: todo});
                    this.$("#listOfTasks").append(view.render().el);
                },
                createOnEnter: function(e) {
                    if (e.keyCode === 13){
                        if (this.input.val()) {
                            Todos.create({title: this.input.val()});
                            this.input.val('');
                        }
                    }
                },
                chackAll: function () {
                    var done = this.allCheckbox.checked;
                    Todos.each(function (todo) { todo.save({'done': done}); });
                }
            });
             var App = new AppView;
            //localStorage.clear();
        });
    }
);