'use strict';

App.Scope = function(core, id)
{
    //Modules only communicate through the scope
    //It also provides a unified interface for modules with helper functions

    function wrapDispatch(action)
    {
        var wrappedAction = Object.assign(action, {dispatchedFrom: id})
        core.store.dispatch(wrappedAction);
    }

    console.log(core)

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