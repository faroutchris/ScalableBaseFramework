'use strict';

App.Core.addReducer('myReducer', function(state, action)
{
    if (!state)
    {
        state = {
            message: 'Hello World',
            color: 'blue'
        };
    }

    switch (action.type)
    {
        case 'MESSAGE':
            return Object.assign({}, state, { message: action.payload });
        case 'URGENT':
            return Object.assign({}, state, { color: action.payload ? 'red' : 'blue' });
        default:
            return state;
    }
});

App.Core.addReducer('todos', function(state, action) 
{
    if (!state)
    {
        state = {
            list: []
        };
    }

    var actionDirectory = {
        ADD: function() 
        {
            return Object.assign({}, state, {
                list: state.list.concat([action.payload])
            });
        }
    }

    if (actionDirectory[action.type]) 
    {
        return state = actionDirectory[action.type]();
    }

    return state;

    // switch (action.type)
    // {
    //     case 'ADD':
    //         console.log('add reducer', state.list)
    //         return Object.assign({}, state, { 
    //             list: state.list.concat([action.payload])
    //         });
    //     default:
    //         return state;
    // }
});