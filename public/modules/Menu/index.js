'use strict';

App.Core.register('menu', {
    select: 'menu',
    templateUrl: 'modules/Menu/template.html'
}, function(scope) {

    var unsubscribe;

    var init = function() {
        // Start listening for store updates
        unsubscribe = scope.subscribe(handleNextState);

        scope.loadTemplate.then(function(template) {
            scope.bind = new scope.bind({
                el: '#app',
                template: template,
                twoway: false,
                data: Object.assign({}, scope.getState(), { 
                    moduleId: scope.moduleId
                }),
            });

            listen();
        });
    }

    var listen = function() {

        scope.bind.on('toggle-change', function(event) {
            if (scope.bind.get('color') === 'blue') {
                scope.dispatch({type: 'URGENT', payload: true });
            } else {
                scope.dispatch({type: 'URGENT', payload: false });
            }
        });

        scope.bind.on('destroy-module', function(event) {
            destroy();
        });
    }

    var destroy = function() {
        unsubscribe();
        scope.bind.teardown();
        scope.destroy(scope.moduleId);
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