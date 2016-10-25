'use strict';

var template = [
    '<h1 class="message">{{ message }}</h1>',
].join('\n');

App.Core.register('myModule', function(scope) 
{
    var initialState = scope.getState().myReducer;

    var unsubscribe = scope.subscribe(handleNextState);

    var count = new Observable(initialState.count, updateCount);
    var message = new Observable(initialState.message, updateMessage);

    function init()
    {
        var html = scope.templateToHtml({ message: message.get() }, template);
        scope.append($('body'), html);

        scope.dispatch({ type: 'MESSAGE', payload: 'Hello' });

        setTimeout(function() {
            scope.dispatch({ type: 'MESSAGE', payload: 'Hello, World!' });
        }, 3000);
    }

    function handleNextState()
    {
        var state = scope.getState().myReducer;

        message.set(state.message);
        count.set(state.count);
    }

    function updateMessage (value)
    {
        $('.message').html(value);
    }

    function updateCount (value)
    {
        $('.count').val(value);
    }

    function destroy()
    {
        store.unsubscribe(handleNextState);
    }

    return {
        init: init
    }
});