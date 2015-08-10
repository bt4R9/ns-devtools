(function() {

    var script = function() {
        var node = $0;
        var className = typeof node.className !== 'string' ? '' : node.className;

        if (className.indexOf('ns-view') !== -1 && className.indexOf('box') === -1) {
            var key = node.getAttribute('data-key');
            return window.__NSDEVTOOLS.views[key];
        }
    };

    chrome.devtools.panels.elements.createSidebarPane('ns' ,function(sidebar) {
        function updateElementProperties() {

            sidebar.setExpression("(" + script.toString() + ")()");
        }

        updateElementProperties();
        chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);

        sidebar.onShown.addListener(updateElementProperties);

        chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
            updateElementProperties();
        });

    });

})();
