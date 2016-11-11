'use strict';

App.Core.register('ractive', { 
    select: 'myReducer', 
    templateUrl: 'modules/Ractive/template.html' 
}, function(scope) {

    var unsubscribe;

    var init = function() {
        // Start listening for store updates
        unsubscribe = scope.subscribe(handleNextState);

        scope.loadTemplate.then(function(template) {
            scope.bind = new scope.bind({
                el: '#content',
                data: Object.assign({}, scope.getState(), { 
                    moduleId: scope.moduleId
                }),
                template: template,
                twoway: false
            });

            listen();
        });
    }

    var listen = function() {

        scope.bind.on('toggle-change', function(event) {
            scope.dispatch({type: 'DONE', itemId: 0, payload: 2 });
        });

        scope.bind.on('destroy-module', function(event) {
            destroy();
        });
    }

    var destroy = function() {
        unsubscribe();
    }

    var handleNextState = function() {
        var tempState = scope.getState();
        for (var key in tempState) {
            scope.bind.set(key, tempState[key]);
        }
    }

    // Module public API
    return {
        init: init,
        destroy: destroy
    };
});