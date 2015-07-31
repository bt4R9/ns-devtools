(function() {

    // ------------------------------------------------------------------------ //
    // Dirty checking for global ns variable.
    // Monkey patching ns.View.create method.
    // DOM changes watcher.

    window.__NSDEVTOOLS = {};
    window.__NSDEVTOOLS.views = {};

    var timer = null;

    var checkNS = function() {
        if (window.ns) {
            initializeExtension();
        } else {
            timer = setTimeout(checkNS, 5);
        }
    };

    setTimeout(function() {
        clearTimeout(timer);
    }, 2500);

    var initializeExtension = function() {
        clearTimeout(timer);
        patchNoscript();
        startDomWatcher();
    };

    var patchNoscript = function() {
        ns.View.__create = ns.View.create;

        ns.View.create = function() {
            /**
             * This is ns-devtools patched version of ns.View.create method.
             */
            var view = ns.View.__create.apply(ns.View, arguments);
            window.__NSDEVTOOLS.views[ view.key ] = view;
            return view;
        };
    };

    checkNS();

    // ------------------------------------------------------------------------ //
    // Construct ns dom tree and send it to devtools panel.

    var debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    var startDomWatcher = function() {
        var observer = new MutationObserver(function() {
            constructCurrentDomNSTree();
        });

        observer.observe(document, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        });

    };

    var constructCurrentDomNSTree = debounce(function() {
        // View "app" is the first node with data-key attribute.
        var root = document.querySelector('[data-key]').cloneNode(true);

        function getJSON() {
            function rec(node) {
                var jsonNode = {};

                if (node.nodeType === 1) {
                    var className = typeof node.className !== 'string' ? '' : node.className;
                    var children = [].slice.call(node.childNodes);

                    children = children.filter(function(child) {
                        var className = typeof child.className !== 'string' ? '' : child.className;

                        return (
                            child.nodeType === 1 &&
                            (child.querySelector('[class^=ns-view]') || className.indexOf('ns-view') !== -1)
                        );
                    });

                    var children2 = [];

                    children.map(function(child) {
                        var className = typeof child.className !== 'string' ? '' : child.className;

                        if (className.indexOf('ns-view') === -1) {
                            var childs = [].slice.call(node.childNodes);

                            childs.map(function(child) {
                                if (
                                    child.nodeType === 1 &&
                                    (child.querySelector('[class^=ns-view]') || className.indexOf('ns-view') !== -1)
                                ) {
                                    children2.push(child);
                                }
                            });

                        } else {
                            children2.push(child);
                        }
                    });

                    var hasChild = children2.length;
                    var isNSView = className.indexOf('ns-view') !== -1 && className.indexOf('ns-view-container-desc') === -1;

                    if (isNSView) {
                        jsonNode.key = node.getAttribute('data-key');
                        jsonNode.name = jsonNode.key.split('&')[0].split('=')[1];
                        jsonNode.isBox = jsonNode.key.indexOf('box') !== -1;
                        jsonNode.id = node.className.match(/ns-view-id-(\d+)/)[1];
                    }

                    if (hasChild) {
                        jsonNode.children = children2.map(rec);
                    }
                }

                return jsonNode;
            }

            return rec(root);
        }

        window.postMessage({
            type: 'ns-devtools',
            event: 'update',
            json: getJSON()
        }, '*');

    }, 1000, false);

    // ------------------------------------------------------------------------ //

})();
