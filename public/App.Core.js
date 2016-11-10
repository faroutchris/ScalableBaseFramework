'use strict';

App.Core = (function() {
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
        
        register: function(id, options, creatorCallback) {

            if (isFunction(creatorCallback)) {
                // The important bit ->
                modules[id] = {
                    creator: creatorCallback,
                    options: options
                };

            } else {
                throw new Error(
                    'You are trying to register a module without a creator function. ' +
                    'The second argument of register() has to be a valid function'
                );
            }
        },

        start: function(id) {
            if (modules[id]) {
                if ( instances[id] === undefined ) { // Check that the instance isn't already running
                // It is very important that the modules actually return something, otherwise you can spawn however many
                // modules without throwing an error

                    // The important bit ->
                    instances[id] = modules[id].creator( App.Scope(this, modules[id].options, id) );
                    instances[id].init();          
               
                } else {
                    throw new Error(id + ' is already a running instance.');
                }
            } else {
                throw new Error(id + ': make sure to register this module before trying to run it.');
            }
        },

        startAll: function () {
            for (var id in modules) 
            {
                modules.hasOwnProperty(id) ? this.start(id) : console.error( id + ' has not been registered');
            }
        },

        destroy: function (id) {
            console.log(instances)            
            delete instances[id];
            console.log(instances)
            console.log('remove from instances')
        },

        // Reducers
        store: null,

        getReducers: function() {
            return reducers; 
        },

        addReducer: function(key, reducer) {
            reducers[key] = reducer;
            console.log(this)
        }
    }
})();