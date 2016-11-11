App.Core.addRoute('', function(route) {
    App.Core.destroyAll();

    App.Core.start('menu');
    App.Core.start('ractive');    
});

App.Core.addRoute('home', function(route) {
    App.Core.destroyAll();    

    App.Core.store.dispatch({ type: 'MESSAGE', payload: 'Introduction'});

    App.Core.start('menu');
    App.Core.start('ractive');    

});

App.Core.addRoute('customer-treatment', function() {
    App.Core.destroyAll();

    App.Core.store.dispatch({ type: 'MESSAGE', payload: 'Customer treatment'});

    App.Core.start('menu');
    App.Core.start('ractive');

});