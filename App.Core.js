'use strict';

App.Core = (function() 
{
    /**
     * Manage module lifecycle.
     * TODO: error handling
     */

    var modules = {};
    var instances = {};

    return {
        _modules: modules, // temporary, for debugging
        _instances: instances, // temporary, for debugging

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