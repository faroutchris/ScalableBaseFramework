'use strict';

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