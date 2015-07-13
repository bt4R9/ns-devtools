var checkTimer = null;

function check() {
    if (window.ns) {
        initialize();
    } else {
        checkTimer = setTimeout(check, 5);
    }
}

setTimeout(function() {
    if (!window.ns) {
        clearTimeout(checkTimer);
    }
}, 10000);

function initialize() {
    ns.events.once('ns-page-after-load', function() {
        console.log('e!');
        window.postMessage({
            type: "ns-tools",
            text: "init"
        }, '*');
    });
}

check();
