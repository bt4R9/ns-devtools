var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        console.log(mutation);
    });
});

observer.observe(document, {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
});


