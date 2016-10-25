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
        
        register: function(id, creatorCallback)
        {
            if (isFunction(creatorCallback)) {
                // The important bit ->
                modules[id] = {
                    creator: creatorCallback,
                };
            } else {
                throw new Error(
                    'You are trying to register a module without a creator function. ' +
                    'The second argument of register() has to be a valid function'
                );
            }
        },

        start: function(id)
        {
            if (modules[id]) {
                if ( instances[id] === undefined ) { // Check that the instance isn't already running
                    // App.Scope ( this, options, id )
                    // don't remember why I wanted to add options, there was a good reason... 
                    // maybe to specify which part of the state tree the scope should use?
                    instances[id] = modules[id].creator( App.Scope(this, id) );
                } else {
                    throw new Error(id + ' is already a running instance.');
                }

                instances[id].init();
            } else {
                throw new Error(id + ': make sure to register this module before trying to run it.');
            }
        },

        startAll: function ()
        {
            for (var id in modules) 
            {
                modules.hasOwnProperty(id) ? this.start(id) : new Error( id + ' has not been registered');
            }
        },

        // Reducers
        store: null,

        getReducers: function() {
            return reducers; 
        },

        addReducer: function(key, reducer) 
        {
            reducers[key] = reducer;
            console.log(this)
        }
    }
})();