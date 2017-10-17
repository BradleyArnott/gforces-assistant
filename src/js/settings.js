const settings = {

    get(option) {
        return new Promise(((resolve) => {
            chrome.runtime.sendMessage({
                action: 'getSetting',
                label: option,
            }, (result) => {
                resolve(result[option]);
            });
        }));
    },
};
