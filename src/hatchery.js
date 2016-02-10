var Hatchery = (function() {
    'use strict';

    var hatchery = {};

    var _variables = {},
        _messages = {};

    hatchery.init = function(params) {
        set({
            hasParents: window.parent !== window,
            origin: params.url || '*'
        });

        if (params.messages) {
            _messages = params.messages;
        }

        return addEventListener('message', function(e) {
            if (!e.data || typeof e.data !== 'string' || !e.data.match(/^{.*}$/g)) {
                return;
            }

            var data = JSON.parse(e.data),
                fn = _messages[data.sender];

            if (fn && fn[data.type]) {
                return fn[data.type](data.sender, data.params);
            }

            if (data.delivery) {
                data.delivery = false;
                return hatchery.send(data);
            }

            return false;
        });
    };

    hatchery.spawn = function(target, params) {
        if (!target || !params) {
            return;
        }

        var iframe = createIframe(params);

        iframe.style.cssText = params.cssText || 'min-width:100%;width:100px;*width:100%;height:500px;overflow:hidden;border:0;z-index:12345;';
        iframe.id = params.id;

        document.querySelector(target).appendChild(iframe);

        set('hatchery-' + params.id, document.getElementById(params.id));

        return;
    };

    hatchery.setTelepathy = function(sender, type, fn) {
        if (!_messages[sender]) {
            _messages[sender] = {};
        }

        _messages[sender][type] = fn;

        return;
    };

    hatchery.send = function(params) {
        if (!params) {
            return;
        }

        var reciever = get('hatchery-' + params.reciever);

        if ((params.reciever === 'parents' || !reciever) && window.parent !== window) {
            params.delivery = true; // Set passing argument
            reciever = window.parent;

            return fire(reciever, params);
        }

        if (!reciever) {
            return console.log('Hatchery: Target not found :(');
        }

        return fire(reciever.contentWindow, params);
    };

    return hatchery;

    function fire(reciever, params) {
        return postMessage(reciever, params);
    }

    function postMessage(reciever, params) {
        if (!reciever || !params) {
            return;
        }

        return reciever.postMessage(
            JSON.stringify(params),
            get('origin')
        );
    }

    function createIframe(params) {
        var iframe = document.createElement('iframe');

        iframe.scrolling = 'no';
        iframe.async = true;
        iframe.frameBorder = 0;
        iframe.allowTransparency = 'true';
        iframe.src = params.url;

        return iframe;
    }

    function search(i, arr, obj) {
        if (i < 1) {
            return obj;
        }

        return typeof obj === 'object' ?
            search(i-1, arr, obj[arr[arr.length - i]])
            : undefined;
    }

    function get(key) {
        var value = _variables[key];
            key = key.split('.');

        return typeof key === 'object' && key.length > 1
            ? search(key.length, key, _variables)
            : value;
    }

    function set(key, value) {
        if (typeof key === 'object' && !value) {
            for (var i in key) {
                _variables[i] = key[i];
            }

            return;
        }

        _variables[key] = value;

        return get(key);
    }

    function addEventListener(event, fn) {
        if (window.addEventListener) {
            return window.addEventListener(event, fn);
        }

        return window.attachEvent('on' + event, fn);
    }
}());
