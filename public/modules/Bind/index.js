'use strict';

var template = [
    '<div id="parent">',
        '<div class="message">Hello</div>',
        '<button id="btn">Click me</button>',
    '</div>'
].join('\n');

App.Core.register('bind', {select: 'myReducer'}, function(scope) 
{
    var self = {}

    function init() 
    {
        function setupState() 
        {
            self.state = scope.getState();

            self.unsubscribe = scope.subscribe(handleNextState);
        }

        function setupDom()
        {
            var html = document.getElementById('parent')

            self.node = scope.bind(self.state, [ html, {
                message: ['.message', setMessageClass]
            }]);

            scope.append($('#app'), self.node);
        }

        setupState();
        setupDom();

        scope.addEvent($(document), [
            { 
                event: 'click', 
                element: '#btn',
                callback: function() {
                    scope.dispatch({type: 'MESSAGE', payload: 'red'});
                }
            }
        ]);
    }

    function handleNextState()
    {
        var tempState = scope.getState();

        for (var key in tempState) {
            self.state[key] = tempState[key];
        }
    }

    function destroy()
    {
        self.unsubscribe(handleNextState);
    }

    function setMessageClass(element, next, prev) 
    {
        (next === 'red') 
            ? element.className = 'red'
            : element.className = 'blue';
    }

    return {
        init: init
    };
});