'use strict';

function toDash(str) {
    return str.replace(/([A-Z])/g, function($1) {
        return '-' + $1.toLowerCase();
    })
}

// Super naive implementation of observable variables
function Observable(value, callback) {
    this.cached = value;
    this.callback = callback;
}

Observable.prototype = {
    set: function(value) {
        if (value !== this.cached) {
            this.cached = value;
            this.callback(value);
        }
    },

    get: function() {
        return this.cached;
    }
}

// createStore implementation
function createStore(reducer) {
    var state;
    var listeners = [];

    var getState = function() 
    {
        return state;
    };

    var dispatch = function(action) 
    {
        console.log(action);
        console.log('PREVIOUS STATE', state);
        state = reducer(state, action);
        console.log('NEW STATE', state)
        listeners.forEach(function(listener) 
        {
            return listener();
        });
    };

    var subscribe = function(listener) 
    {
        listeners.push(listener);
        return function unsubscribe(listener)
        {
            listeners = listeners.filter(function(l) {
                return l !== listener
            });
        }
    };

    dispatch({ type: '@@INIT' }); // Dispatch dummy action to initialize the reducer to return the initial value

    return {
        getState: getState,
        dispatch: dispatch,
        subscribe: subscribe
    };
}

function combineReducers(reducers) 
{
    return function(state, action) 
    {
        return Object.keys(reducers).reduce(function(nextState, key) 
        {
            nextState[key] = reducers[key](state[key], action);
        }, {});
    }
}

var curry = function(fn){
    if(typeof fn!=='function'){
        throw Error('No function provided');
    }

    var slice = [].slice;
    return function curriedFn(){
      var args = slice.call(arguments);
      if(args.length < fn.length){
        return function(){
          return curriedFn.apply(null, args.concat( slice.call(arguments) ));
        };
      }

      return fn.apply(null, args);
    };
};