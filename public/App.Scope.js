'use strict';

App.Scope = function(core, options, id) {
    //Modules only communicate through the scope
    //It also provides a unified interface for modules with helper functions

    function wrapDispatch(action) { 
        // add a field on the action to indicate which module dispatched the action
        var wrappedAction = Object.assign({}, action, {dispatchedFrom: id})
        core.store.dispatch(wrappedAction);
    }

    function wrapGetState() {
        // Only get the selected part of the state tree
        return core.store.getState()[options.select];
    }

    function loadTemplate(url) {
        return fetch(url).then(function(res) {
                    
            if (res.status >= 200 && res.status < 300) {
                return res;
            }

        }).then(function(res) {
            
            return res.text();

        });
    }
    
    return {
        destroy: core.destroy,
        start: core.start,
        
        moduleId: id,

        getState: wrapGetState,
        dispatch: wrapDispatch,
        subscribe: core.store.subscribe,

        bind: curry(Ractive),
        loadTemplate: loadTemplate(options.templateUrl),

        $root: '*[data-moduleid="' +  toDash(id) + '"]',
        append: core.View.append,
        remove: core.View.remove,
        templateToHtml: core.View.templateToHtml,
        addEvent: core.View.addEvent,
        removeEvent: core.View.removeEvent
    };
};