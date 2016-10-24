'use strict';

var App = {};

App.View = (function($, Handlebars)
{
    return {
        append: function($target, html, callback)
        {
            $target.append( html );

            if (callback) {
                 // Used if we need to animate stuff
                var selector = '.' + $(html).attr('class');
                callback( selector );
            }
        },

        remove: function() {
            // TODO
        },

        templateToHtml: function(data, template)
        {
            var compile = Handlebars.compile(template);
            return compile(data);
        },

        addEvent($el, list)
        {
            // list shape: [{event: String event, element: String DOMElement, callback: Function callback}]
            list.forEach(function(item) {
                $el.on(item.event, item.element, item.callback);
            });
        },

        removeEvent($el, list)
        {
            list.forEach(function(item) {
                $el.off(item.event, item.element, item.callback);
            });
        }
    }
});

App.Scope = function(core, reducer, id) // App.connect ?
{
    //Modules only communicate through the scope
    //It also provides a unified interface for modules with helper functions

    var store = createStore(reducer);

    function wrapDispatch(action) 
    {
        var wrappedAction = Object.assign(action, {dispatchedFrom: id})
        store.dispatch(wrappedAction);
    }

    return {
        getState: store.getState,
        subscribe: store.subscribe,
        dispatch: wrapDispatch,

        $root: '#' + toDash(id),        
        append: core.view.append,
        remove: core.view.remove,
        templateToHtml: core.view.templateToHtml,
        addEvent: core.view.addEvent,
        removeEvent: core.view.removeEvent,
    };
};

App.Core = (function() 
{
    /**
     * Manage module lifecycle.
     * TODO: error handling
     */

    var modules = {};
    var instances = {};

    return {
        _modules: modules,
        _instances: instances,

        view: App.View(jQuery, Handlebars),

        register: function(id, reducer, creatorCallback)
        {
            modules[id] = {
                creator: creatorCallback,
                reducer: reducer // This couples the reducer to the module... think of some other solution.
            };
            console.log(modules)
        },
    
        start: function(id)
        {
            
            if (modules[id]) {
                if ( instances[id] === undefined ) {
                    instances[id] = modules[id].creator( App.Scope(this, modules[id].reducer, id) );
                }

                instances[id].init();
            }

        },

        startAll: function () 
        {            
            for (var id in modules) 
            {
                modules.hasOwnProperty(id) ? this.start.id : new Error('module does not exist');
            }
        },

        destroy: function() {},

    }
})();

var Main = (function()
{
    // Application specific code

    var myReducer = function(state, action) {
    // TODO: Create App.Core.addReducer
        if (!state) {
            state = {
                count: 0,
                message: 'Hello World'
            };
        }

        switch (action.type)
        {
            case 'YO':
                return Object.assign(state, { 
                    count: action.payload ? state.count + action.payload : state.count + 1 
                });
            case 'MESSAGE':
                return Object.assign(state, { message: action.payload });
            default:
                return state;
        }
    }

    var template = [
        '<h1 class="message">{{ message }}</h1>',
        '<input class="count" type="number" value="{{ count }}"/>'
    ].join('\n');

    App.Core.register('myModule', myReducer, function(scope) 
    {   
        var initialState = scope.getState();

        var unsubscribe = scope.subscribe(handleNextState);

        var count = new Observable(initialState.count, updateCount);
        var message = new Observable(initialState.message, updateMessage);

        function init()
        {
            var html = scope.templateToHtml({ message: message.get() }, template);
            scope.append($('body'), html);

            scope.dispatch({ type: 'YO', payload: 1 });
            scope.dispatch({ type: 'YO', payload: 5 });
            scope.dispatch({ type: 'YO', payload: 10 });
            scope.dispatch({ type: 'MESSAGE', payload: 'Hello World' });

            setTimeout(function() {
                scope.dispatch({ type: 'MESSAGE', payload: 'Goodbye' });
            }, 3000);

            setInterval(function() {
                scope.dispatch({ type: 'YO' });
            }, 1000);

        }

        function handleNextState()
        {
            var state = scope.getState();

            message.set(state.message);
            count.set(state.count);
        }

        function updateMessage (value)
        {
            $('.message').html(value);
        }

        function updateCount (value) {
            console.log($('.count'))
            $('.count').val(value);
        }

        function destroy()
        {
            store.unsubscribe(handleNextState);
        }

        return {
            init: init
        }
    })

    App.Core.start('myModule');

    console.log(App.Core._modules, App.Core._instances);
})();