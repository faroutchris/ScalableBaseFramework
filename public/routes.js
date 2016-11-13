App.Core.addRoute('', function(route) {
    App.Core.destroyAll();

    App.Core.store.dispatch({ type: 'SET_PAGE_TITLE', payload: 'Complaint Handling'});

    App.Core.start('topbar');
    App.Core.start('menu');
    App.Core.start('instruction');

});

App.Core.addRoute('introduction', function(route) {
    App.Core.destroyAll();

    App.Core.store.dispatch({ type: 'SET_PAGE_TITLE', payload: 'Introduction'});

    App.Core.start('topbar');
    App.Core.start('courselayout')
    App.Core.start('instruction');

});

App.Core.addRoute('customer-treatment', function() {
    App.Core.destroyAll();

    App.Core.store.dispatch({ type: 'SET_PAGE_TITLE', payload: 'Customer treatment'});

    App.Core.start('topbar');
    
});