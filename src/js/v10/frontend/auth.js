const auth = {
    path: '/backend/auth/',
    date: Math.round((new Date()).getTime() / 1000),
    attempts: 0,

    init() {
        const isOnND = document.querySelector('link[href="https://images.netdirector.co.uk"]');
        if (!isOnND) return;
        settings.get('autoLogin').then((autoLogin) => {
            if (!autoLogin) return;
            chrome.runtime.sendMessage({
                action: 'getAuthData',
            }, async (result) => {
                await this.checkExpiry();
                this.login(result);
            });
        });
    },

    login(user) {
        $.ajax({
            url: `${window.location.protocol}//${window.location.hostname}${this.path}`,
            data: {
                'Components_Auth_LoginForm[username]': user.username,
                'Components_Auth_LoginForm[password]': user.password,
            },
            type: 'POST',
        })
            .done((result) => {
                if (result.includes('Components_Auth_LoginForm[username]')) {
                    this.attempts += 1;
                    if (this.attempts === 3) return;
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
