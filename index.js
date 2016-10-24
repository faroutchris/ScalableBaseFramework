'use strict';

var App = {
    createStore: function createStore(reducer) { // Util?
        var state;
        var listeners = [];

        var getState = function() 
        {
            return state;
        };

        var dispatch = function(action) 
        {
            console.log(action);
            console.log('PREVIOUS STATE', state);
            state = reducer(state, action);
            console.log('NEW STATE', state)
            listeners.forEach(function(listener) 
            {
                return listener();
            });
        };

        var subscribe = function(listener) 
        {
            listeners.push(listener);
            return function unsubscribe(listener)
            {
                listeners = listeners.filter(function(l) {
                    return l !== listener
                });
            }
        };

        dispatch({ type: '@@INIT' }); // Dispatch dummy action to initialize the reducer to return the initial value

        return {
            getState: getState,
            dispatch: dispatch,
            subscribe: subscribe
        };
    }
};

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

    console.log(core)

    var store = App.createStore(reducer);
    //var selector = '#' + toDash(id);

    function wrapDispatch(action) 
    {
        var wrappedAction = Object.assign(action, {dispatchedFrom: id})
        store.dispatch(wrappedAction);
    }

    return {
        getState: store.getState,
        subscribe: store.subscribe,
        dispatch: wrapDispatch,
        
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
     * Enable inter-module communication (?)
     * Some error handling
     */

    var modules = {};
    var instances = {};

    return {
        _modules: modules,
        _instances: instances,

        view: App.View(jQuery, Handlebars),

        register: function(id, reducer, creatorCallback)
        {
            modules[id] = {};
            modules[id].creator = creatorCallback;
            modules[id].reducer = reducer; // This couples the reducer to the module... think of some other solution.
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
                if (modules[id]) 
                {
                    this.start(id);
                }
            }
        },

        destroy: function() {},

    }
})();

var Main = (function() 
{
    // Create App.Core.addReducer
    var myReducer = function(state, action) {
        if (!state) {
            state = {
                count: 0,
                message: 'Hello World'
            };
        }

        switch (action.type)
        {
            case 'YO':
                return Object.assign(state, { count: action.payload ? state.count + action.payload : state.count + 1 });
            case 'MESSAGE':
                return Object.assign(state, { message: action.payload });
            default:
                return state;
        }
    }

    var template = [
        '<h1 class="message">{{ message }}</h1>'
    ].join('\n');

    App.Core.register('myModule', myReducer, function(scope) 
    {   
        var initialState = scope.getState();

        var unsubscribe = scope.subscribe(handleNextState);

        //var count = new Observable(initialState.count, updateCount);
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

        }

        function handleNextState()
        {
            var state = scope.getState();
            message.set(state.message);
        }

        function updateMessage (value)
        {
            $('.message').html(value);
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