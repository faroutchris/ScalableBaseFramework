'use strict';

App.Scope = function(core, id)
{
    //Modules only communicate through the scope
    //It also provides a unified interface for modules with helper functions

    function wrapDispatch(action)
    { // add a field on the action to indicate which module dispatched the action
        var wrappedAction = Object.assign({}, action, {dispatchedFrom: id})
        core.store.dispatch(wrappedAction);
    }

    console.log('app.scope', core, core.store.getState())

    return {
        getState: core.store.getState,
        subscribe: core.store.subscribe,
        dispatch: wrapDispatch,

        $root: '#' + toDash(id),
        append: core.View.append,
        remove: core.View.remove,
        templateToHtml: core.View.templateToHtml,
        addEvent: core.View.addEvent,
        removeEvent: core.View.removeEvent,
    };
};