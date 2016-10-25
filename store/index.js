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
        case 'MESSAGE':
            return Object.assign({}, state, { message: action.payload });
        default:
            return state;
    }
});

App.Core.addReducer('todos', function(state, action) {
    if (!state) {
        state = {
            list: []
        };
    }

    switch (action.type)
    {
        case 'ADD':
            return Object.assign({}, state, { 
                list: state.list.push(action.payload)
            });
        default:
            return state;
    }
});