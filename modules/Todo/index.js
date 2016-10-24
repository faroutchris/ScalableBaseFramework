'use strict';

var template = [
    '<h1 class="message">{{ message }}</h1>',
    '<input class="count" type="number" value="{{ count }}"/>'
].join('\n');

App.Core.register('myModule', myReducer, function(scope) 
{   
    var initialState = scope.getState();

    var unsubscribe = scope.subscribe(handleNextState);

    var count = new Observable(initialState.count, updateCount);
    var message = new Observable(initialState.message, updateMessage);

    function init()
    {
        var html = scope.templateToHtml({ message: message.get() }, template);
        scope.append($('body'), html);

        scope.dispatch({ type: 'YO', payload: 1 });
        scope.dispatch({ type: 'YO', payload: 5 });
        scope.dispatch({ type: 'YO', payload: 10 });
        scope.dispatch({ type: 'MESSAGE', payload: 'Hello World' });

        setTimeout(function() {
            scope.dispatch({ type: 'MESSAGE', payload: 'Goodbye' });
        }, 3000);

        setInterval(function() {
            scope.dispatch({ type: 'YO' });
        }, 1000);
    }

    function handleNextState()
    {
        var state = scope.getState();

        message.set(state.message);
        count.set(state.count);
    }

    function updateMessage (value)
    {
        $('.message').html(value);
    }

    function updateCount (value) {
        $('.count').val(value);
    }

    function destroy()
    {
        store.unsubscribe(handleNextState);
    }

    return {
        init: init
    }
})