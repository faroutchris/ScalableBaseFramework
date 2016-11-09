'use strict';

App.Core.register('ractive', { select: 'myReducer'}, function(scope) {

    var unsubscribe;

    var init = function() {
        // Start listening for store updates
        unsubscribe = scope.subscribe(render);

        fetch('modules/Ractive/template.html').then(function(res) {
            
            if (res.status >= 200 && res.status < 300) {
                return res;
            }

        }).then(function(res) {
            
            return res.text();

        }).then(function(template) {

            scope.bind = new scope.bind({
                el: '#app',
                data: Object.assign({}, scope.getState(), { 
                    moduleId: scope.moduleId
                }),
                template: template,
                twoway: false
            });

            listen();

        });

        setTimeout(function() { scope.dispatch({type: 'MESSAGE', payload: 'New message'}) }, 2000);
    }

    var listen = function() {

        scope.bind.on('toggle-change', function(event) {
            if (scope.bind.get('color') === 'blue') {
                scope.dispatch({type: 'URGENT', payload: true });
            } else {
                scope.dispatch({type: 'URGENT', payload: false });
            }
        });
    }

    var destroy = function() {
        unsubscribe();
    }

    var render = function() {
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