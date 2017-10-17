let loginAttempts = 0;

const auth = {
    path: '/backend/auth/',
    date: Math.round((new Date()).getTime() / 1000),

    init() {
        const isOnND = $('link[href="https://images.netdirector.co.uk"]');
        if (!isOnND.length) return;
        settings.get('autoLogin').then((autoLogin) => {
            if (!autoLogin) return;
            chrome.runtime.sendMessage({
                action: 'getAuthData',
            }, (result) => {
                auth.checkExpiry().then(() => {
                    auth.login(result);
                });
            });
        });
    },

    login(data) {
        $.ajax({
            url: `${window.location.protocol}//${window.location.hostname}${this.path}`,
            data: {
                'Components_Auth_LoginForm[username]': data.username,
                'Components_Auth_LoginForm[password]': data.password,
            },
            type: 'POST',
        })
            .done((result) => {
                if (result.includes('Components_Auth_LoginForm[username]')) {
                    loginAttempts += 1;
                    if (loginAttempts === 3) return;
                    setTimeout(() => { auth.login(); }, 2000);
                } else {
                    sessionStorage.setItem('NDAutoLog', this.date);
                }
            });
    },

    checkExpiry() {
        const expiryTime = 24 * 3600;
        const expiryDate = sessionStorage.getItem('NDAutoLog') ? parseInt(sessionStorage.getItem('NDAutoLog'), 10) + expiryTime : 0;

        return new Promise((resolve) => {
            if (this.date < expiryDate) return;
            resolve();
        });
    },
};

auth.init();
