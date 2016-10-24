'use strict';

App.Core.addReducer('myReducer', function(state, action) {
    if (!state) {
        state = {
            count: 100,
            message: 'Hello World'
        };
    }

    switch (action.type)
    {
        case 'YO':
            return Object.assign({}, state, { 
                count: action.payload ? state.count + action.payload : state.count + 1 
            });
        case 'MESSAGE':
            return Object.assign({}, state, { message: action.payload });
        default:
            return state;
    }
});