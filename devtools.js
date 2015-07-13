chrome.devtools.panels.create("ns-tools", "logo.png", "Panel.html", function(panel) {
    panel.onShown.addListener(function(win) {
        console.log('i think this is the right onshow');
        var status = win.document.querySelector("#app");
        status.innerHTML = "Fixing to make magic.";
    });
});
