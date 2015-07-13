// Content script does not have an access to window variables.
// So we need to inject scripts deeper. :O
function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}

injectScript(chrome.extension.getURL('injection.js'), 'body');

window.addEventListener("message", function(event) {
    if (event.data.type === 'ns-tools' && event.data.type === 'init') {
        init();
    }
});

function init() {
    function getDOMJSON() {
        function getObjectNode(node) {
            var jsonNode = {};
            if (node.nodeType == 1) {
                var children = (node.childNodes = [].map.call(node.childNodes, getObjectNode));
                jsonNode[node.tagName.toLowerCase()] = children;
            } else if (node.nodeType == 3) {
                jsonNode[node.nodeName] = node.nodeValue;
            }

            return jsonNode;
        }

        var node = document.querySelector('.app');

        return getObjectNode(node);
    }

    console.log(getDOMJSON());
}

