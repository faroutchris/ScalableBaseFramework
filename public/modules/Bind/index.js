'use strict';

var template = [
    '<template data-moduleid="{{ moduleId }}">',
        '<div class="message" data-bind="text:message"></div>',
        '<input data-bind="value:message" type="text" value="{{message}}"/>',
    '</template>'
].join('\n');

App.Core.register('bind', {select: 'myReducer'}, App.Util.Module(function(scope) 
{
    var self = {}
    console.log('what is this', this)

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

    // var setMessageClass = scope.bind.flow(
    //     setDefault,
    //     bindEvents({
            
    //     })
    // )

    function setMessageClass(element, next, prev) 
    {
        (next === 'red') 
            ? element.className = 'red'
            : element.className = 'blue';
    }

    return {
        init: init
    };
}));