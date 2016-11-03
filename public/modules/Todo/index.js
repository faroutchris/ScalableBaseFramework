'use strict';

var todoTemplate = [
    '<div data-moduleid={{ moduleId }}>',
        '<input type="text" id="input" placeholder="Type a todo">',
        '<ul class="list">',
        '</ul>',
    '<div>'
].join('\n');

var listTemplate = [
    '{{#each todos}}',
        '<li>{{this}}</li>',
    '{{/each}}'
].join('\n')

App.Core.register('todo', { select: 'todos' }, function(scope) 
{
    var self = {}

    // var myTemplate = fetch('modules/Todo/template.hbs')
    // .then(function(res) {
    //     if (res.status >= 200 && res.status < 300) {
    //         return res
    //     }
    // }).then(function(res) {
    //     return res.text()
    // }).then(function(text) {
    //     return text;
    // });

    // console.log(myTemplate)
    // setTimeout(function() {console.log(myTemplate)}, 100)

    var events = [
        { event: 'keypress', element: '#input', callback: handleSubmit }
    ];

    function init() 
    {
        self.state = scope.getState();

        self.unsubscribe = scope.subscribe(handleNextState);

        self.todos = new Observable(self.state.list, updateList);

        var html = scope.templateToHtml({moduleId: scope.moduleId, todos: self.state.list }, todoTemplate);
        scope.append($('#app'), html);

        scope.dispatch({ type: 'ADD', payload: 'My first todo' });

        scope.addEvent($(scope.$root), events);
    }

    function handleNextState()
    {
        self.state = scope.getState();

        self.todos.set(self.state.list)
    }

    function updateList(value)
    {
        scope.remove($('.list').children());

        var html = scope.templateToHtml({ todos: value }, listTemplate);
        
        scope.append($('.list'), html);
    }

    function handleSubmit(e)
    {
        if (e.which === 13) {
            scope.dispatch({ type: 'ADD', payload: e.target.value });
            e.target.value = '';
        }
    }

    function destroy()
    {
        self.unsubscribe(handleNextState);
    }

    return {
        init: init
    };
});