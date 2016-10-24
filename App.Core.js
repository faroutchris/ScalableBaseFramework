'use strict';

App.Core = (function() 
{
    /**
     * Manage module lifecycle.
     * Manage application state & communication
     * TODO: error handling
     */

    // Modules
    var modules = {};
    var instances = {};
    var reducers = {};

    return {
        _modules: modules, // temporary, for debugging
        _instances: instances, // temporary, for debugging
        _reducers: reducers, // temporary, for debugging

        register: function(id, creatorCallback)
        {
            modules[id] = {
                creator: creatorCallback,
            };
        },

        start: function(id)
        {

            console.log(modules[id])
            if (modules[id]) {
                if ( instances[id] === undefined ) {
                    // App.Scope ( this, options, id )
                    // don't remember why I wanted to add options, there was a good reason... maybe to specify which part of the state tree the scope should use?
                    instances[id] = modules[id].creator( App.Scope(this, id) );                }

                instances[id].init();
            }

        },

        startAll: function ()
        {
            for (var id in modules) 
            {
                modules.hasOwnProperty(id) ? this.start(id) : new Error('module does not exist');
            }
        },

        destroy: function() {},

        // Reducers
        store: createStore(reducers['myReducer']),

        addReducer: function(key, reducer) 
        {
            reducers[key] = reducer;
            console.log(this)
        }

    }
})();