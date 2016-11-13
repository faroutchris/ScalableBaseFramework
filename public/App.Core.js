'use strict';

App.Core = (function() {
    /**
     * Manage module lifecycle.
     * Manage application state & communication
     * Manage routing (fold into state?)
     * TODO: error handling
     */

    // Modules
    var modules = {};
    var instances = {};
    var reducers = {};
    var Router;

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

        start: function(id, props) {
            if (modules[id]) {
                if ( instances[id] === undefined ) { // Check that the instance isn't already running
                    // It is very important that the modules actually return an object, otherwise you can spawn
                    // infinitely many of the same module without throwing an error
                    // TODO: Make it error out for this case

                    // The important bit ->
                    instances[id] = modules[id].creator( App.Scope(this, modules[id].options, props, id) );
                    instances[id].init();          
               
                } else {
                    throw new Error(id + ' is already a running instance.');
                }
            } else {
                throw new Error(id + ': make sure to register this module before trying to run it.');
            }
        },

        startAll: function () {
            for (var id in modules) {
                modules.hasOwnProperty(id) ? this.start(id) : console.error( id + ' has not been registered');
            }
        },

        destroy: function (id) {
            instances[id].destroy();
            delete instances[id];
            console.log('remove from instances')
        },

        destroyAll: function () {
            for (var id in instances) {
                instances.hasOwnProperty(id) ? this.destroy(id) : console.error( id + ' is not a running instance');
            }
        },

        // Reducers
        store: null,

        getReducers: function() {
            return reducers; 
        },

        addReducer: function(key, reducer) {
            reducers[key] = reducer;
        },

        // router

        Router: Rlite(),

        addRoute: function(route, callback) {
            this.Router.add(route, callback);
        }
    }
})();