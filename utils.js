function toDash(str) {
    return str.replace(/([A-Z])/g, function($1) {
        return '-' + $1.toLowerCase();
    })
}

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