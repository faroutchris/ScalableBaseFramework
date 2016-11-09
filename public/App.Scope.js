'use strict';

App.Scope = function(core, options, id)
{
    //Modules only communicate through the scope
    //It also provides a unified interface for modules with helper functions

    function wrapDispatch(action)
    { // add a field on the action to indicate which module dispatched the action
        var wrappedAction = Object.assign({}, action, {dispatchedFrom: id})
        core.store.dispatch(wrappedAction);
    }

    function wrapGetState() 
    {
        return core.store.getState()[options.select];
    }

    return {
        moduleId: id,

        getState: wrapGetState,
        dispatch: wrapDispatch,
        subscribe: core.store.subscribe,

        bind: curry(Ractive),
        
        $root: '*[data-moduleid="' +  toDash(id) + '"]',
        append: core.View.append,
        remove: core.View.remove,
        templateToHtml: core.View.templateToHtml,
        addEvent: core.View.addEvent,
        removeEvent: core.View.removeEvent
    };
};