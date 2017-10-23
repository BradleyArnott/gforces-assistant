const overflow = {
    naughtyList: {},

    async init() {
        await this.get();

        if (!Object.keys(this.naughtyList).length) {
            this.perfect();
            return;
        }
        this.present();
        this.modalClose();
    },

    get() {
        return new Promise(((resolve) => {
            const docWidth = document.documentElement.offsetWidth;
            const els = document.querySelectorAll('*');
            let id = 0;

            els.forEach((el) => {
                if (el.offsetWidth > docWidth) {
                    this.naughtyList[el.classList.value] = {
                        id,
                        el,
                        value: el.classList.value,
                    };
                    id += 1;
                }
            });
            resolve();
        }));
    },

    loopModules() {
        let modal = '<div class="gforces-assistant--slashes"><a href="#" class="close">X</a><div class="title">Overflowing Content:</div>';

        Object.keys(this.naughtyList).forEach((module) => {
            console.log(this.naughtyList[module].el);
            this.naughtyList[module].el.setAttribute('id', `overflow-scrollto-${this.naughtyList[module].id}`);
            this.naughtyList[module].el.style.backgroundColor = 'red';
            const link = `<a class="link" data-id="${this.naughtyList[module].value}" href="#overflow-scrollto-${this.naughtyList[module].id}">${this.naughtyList[module].value}</a>`;
            modal += link;
        });
        return modal;
    },

    present() {
        let data = this.loopModules(this.naughtyList);
        data += '</div>';
        const modal = document.createElement('div');
        modal.innerHTML = data;
        if (this.naughtyList.length > 10) modal.classList.add('double-width');
        return document.body.appendChild(modal);
    },

    perfect() {
        const confirm = document.createElement('div');
        confirm.className = 'gforces-assistant--overlay--confirm';
        confirm.innerHTML = '<div class="box"></div>';
        document.body.appendChild(confirm);
        confirm.style.display = 'block';

        setTimeout(() => {
            confirm.style.display = 'none';
        }, 800);
    },

    modalClose() {
        const close = document.querySelector('.gforces-assistant--slashes .close');
        close.addEventListener('click', (e) => {
            e.preventDefault();
            close.parentNode.remove();
            Object.keys(this.naughtyList).forEach((module) => {
                this.naughtyList[module].el.style = '';
            });
        });
    },
};

overflow.init();
