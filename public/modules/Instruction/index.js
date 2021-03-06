'use strict';

App.Core.register('instruction', {
    templateUrl: 'modules/Instruction/template.html'
}, function(scope) {

    var unsubscribe;

    var init = function() {
        // Start listening for store updates
        unsubscribe = scope.subscribe(handleNextState);

        scope.loadTemplate.then(function(template) {
            
            scope.bind = new scope.bind({
                el: '#instruction',
                template: template,
                twoway: false,
                data: Object.assign({}, scope.getState(), { 
                    moduleId: scope.moduleId
                }),
            });

        });
    }

    var destroy = function() {
        scope.bind.teardown();
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