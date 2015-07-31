(function() {
    /*
     * Content script does not have an access to window variables.
     * So we need to inject scripts deeper. :O
     */
    var injection = chrome.extension.getURL('/pages/content-script/injection.js');

    var injectScript = function(url) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.setAttribute('src', url);
        head.appendChild(script);
    };

    injectScript(injection);

    window.addEventListener('message', function(event) {
        var data = event.data;

        if (data.type === 'ns-devtools' && data.event === 'update') {
            var json = data.json;

            chrome.runtime.sendMessage({event: 'update', json: json});
        }
    });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        alert('123');
    });

})();
