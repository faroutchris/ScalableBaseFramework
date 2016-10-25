'use strict';

var todoTemplate = [
    '<input type="text" placeholder="Type a todo">',
    '<ul class="list">',
        '{{#each todos}}',
            '<li>{{todo}}</li>',
        '{{/each}}',
    '</ul>'
].join('\n');

var listTemplate = [
    '{{#each todos}}',
        '<li>{{todo}}</li>',
    '{{/each}}'
].join('\n')

App.Core.register('todo', function(scope) 
{
    var initialState = scope.getState().todos;

    var unsubscribe = scope.subscribe(handleNextState);

    var todos = new Observable(initialState.todos, updateList);

    function init() {
        var html = scope.templateToHtml({todos: initialState.list }, todoTemplate);
        scope.append($('body'), html);

        scope.dispatch({ type: 'ADD', payload: 'My first todo' });

        setTimeout(function() {
            scope.dispatch({ type: 'ADD', payload: 'My Second todo' });
        }, 3000);
    }

    function handleNextState() {
        var state = scope.getState().todos;

        todos.set(state.list)
    }

    function updateList(value) {
        scope.remove($('.list').children());

        var html = scope.templateToHtml({ todos: value }, listTemplate);
        scope.append($('.list'), html);
    }

    function destroy() {}

    return {
        init: init
    };
});