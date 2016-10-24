'use strict';

App.Core.View = (function($, Handlebars)
{
    return {
        append: function($target, html, callback)
        {
            $target.append( html );

            if (callback) {
                 // Used if we need to animate stuff
                var selector = '.' + $(html).attr('class');
                callback( selector );
            }
        },

        remove: function() {
            // TODO
        },

        templateToHtml: function(data, template)
        {
            var compile = Handlebars.compile(template);
            return compile(data);
        },

        addEvent($el, list)
        {
            // list shape: [{event: String event, element: String DOMElement, callback: Function callback}]
            list.forEach(function(item) {
                $el.on(item.event, item.element, item.callback);
            });
        },

        removeEvent($el, list)
        {
            list.forEach(function(item) {
                $el.off(item.event, item.element, item.callback);
            });
        }
    }
})(jQuery, Handlebars);