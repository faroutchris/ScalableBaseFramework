'use strict';

App.Core.addReducer('menu', function(state, action) {
    if (!state) {
        state = {
            items: [
                { id: 0, name: 'Introduction', linkTo: '#introduction', status: 0 }, 
                { id: 1, name: 'Customer Treatment', linkTo: '#customer-treatment', status: 0 }, 
                { id: 2, name: 'Responsibility', linkTo: '#responsibility', status: 0 }, 
                { id: 3, name: 'Registration', linkTo: '#registration', status: 0 }
            ],
            active: 0
        };
    }

    switch (action.type) {
        case 'DONE': {
        
            return Object.assign({}, state, { items: state.items.map(function(item) {
            
                    if (item.id === action.itemId) {
                        item.status = action.payload;
                        return item;
                    } 
                    else {
                        return item;
                    }
            
                })
            });

        }
        default: {
            return state;
        }
    }
});

App.Core.addReducer('course', function(state, action) {
    if (!state) {
        state = {
            title: 'Complaint Handling for Retail Banking',
            organization: 'Nordea',
            layout: {
                name: 'Introduction',
                scenarios: [
                    {type: 'video', title: 'Welcome', cdnId: 'abcdef'},
                    {type: 'exercise', title: 'What is your responsibility', content: ['hello']},
                    {type: 'video', title: 'How to handle customers', cdnId: 'abcdef'},
                ]
            }
        };
    }

    switch (action.type) {
        default: {
            return state;
        }
    }
});

App.Core.addReducer('myReducer', function(state, action) {
    if (!state) {
        state = {
            message: 'Hello World',
            color: 'blue'
        };
    }

    switch (action.type) {
        case 'MESSAGE':
            return Object.assign({}, state, { message: action.payload });
        case 'URGENT':
            return Object.assign({}, state, { color: action.payload ? 'red' : 'blue' });
        default:
            return state;
    }
});