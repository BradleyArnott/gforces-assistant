
const dropdown = {
    urlPrefix: 'image/upload/',
    urlSuffix: 'auto-client/',

    init() {
        dropdown.setOptions()
            .then(dropdown.modal)
            .then(dropdown.buttons);
    },

    modal(options) {
        const overlay = document.createElement('div');
        overlay.innerHTML = '<div class="gforces-assistant--overlay"></div>';
        document.body.appendChild(overlay);

        const modal = document.createElement('div');
        modal.className = 'gforces-assistant--modal';
        modal.innerHTML = '<label for="dropdown">Dropdown select</label><select class="dropdown-list"></select><label for="variable">Variable name</label><input class="variable" placeholder="eg. @new-cars" type="text"></input><label for="images">Extract Listing Images from current page</label><input class="checkbox-images" type="checkbox" name="images"><label for="title">Use title instead of href</label><input class="checkbox-title" type="checkbox" name="title"><div class="button"><a href="" class="btn confirm">Confirm</a></div><div class="button"><a href="" class="btn cancel">Cancel</a></div>';
        document.body.appendChild(modal);

        const confirm = document.createElement('div');
        confirm.className = 'gforces-assistant--overlay--confirm';
        confirm.innerHTML = '<div class="box"></div>';
        document.body.appendChild(confirm);

        options.forEach((option) => {
            const container = document.querySelector('.gforces-assistant--modal select');
            const el = document.createElement('option');
            el.innerHTML = option.title;
            container.appendChild(el);
        });

        overlay.style.display = 'block';
        modal.style.display = 'block';
        return options;
    },

    setOptions() {
        return new Promise(((resolve) => {
            const options = [];
            const dropdowns = document.querySelectorAll('.header-container .nav li.dropdown');

            if (!dropdowns.length) return;

            dropdowns.forEach((el) => {
                const title = el.querySelector('a > span').innerHTML;
                const data = { el, title };
                options.push(data);
            });
            resolve(options);
        }));
    },

    confirmAction(options, downloadImages, useTitle, dropdownValue, varName) {
        let dropdownEl;

        if (downloadImages) dropdown.grabImages();

        options.forEach((option) => {
            if (dropdownValue !== option.title) return;
            dropdownEl = option.el;
        });

        this.generateSprite(dropdownEl, useTitle, varName).then((data) => {
            dropdown.copyVariable(data);
            const confirm = document.querySelector('.gforces-assistant--overlay--confirm');
            confirm.style.display = 'block';

            setTimeout(() => {
                confirm.style.display = 'none';
            }, 800);
        });
    },

    buttons(options) {
        const buttons = document.querySelectorAll('.gforces-assistant--modal .btn');

        buttons.forEach((button) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();

                if (button.classList.contains('confirm')) {
                    const dropdownValue = document.querySelector('.gforces-assistant--modal option:checked').innerHTML;
                    const downloadImages = document.querySelector('.gforces-assistant--modal .checkbox-images').checked;
                    const useTitle = document.querySelector('.gforces-assistant--modal .checkbox-title').checked;
                    const varName = document.querySelector('.gforces-assistant--modal .variable').innerHTML ? document.querySelector('.gforces-assistant--modal .variable').innerHTML : '@dropdown-items';
                    dropdown.confirmAction(options, downloadImages, useTitle, dropdownValue, varName);
                }

                document.querySelector('.gforces-assistant--modal').remove();
                document.querySelector('.gforces-assistant--overlay').remove();
            });
        });
    },

    grabImages() {
        const images = document.querySelectorAll('.list-item img');

        images.each((image) => {
            const src = image.getAttribute('src');
            if (src.search(this.urlPrefix) === -1) return;
            if (src.search(this.urlSuffix) === -1) return;

            const urlPrefixSplit = src.split(this.urlPrefix)[0];
            const urlSuffixSplit = src.split(this.urlSuffix)[1];
            const newSrc = urlPrefixSplit + this.urlSuffix + urlSuffixSplit;
            const fileType = src.substr(src.length - 4);
            const alt = image.getAttribute('alt').replace(' ', '');
            const downloadLink = document.createElement('a');
            downloadLink.href = newSrc;
            downloadLink.setAttribute('download', alt + fileType);
            document.body.appendChild(downloadLink);

            downloadLink.click();
            downloadLink.remove();
        });
    },

    copyVariable(string) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = string;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
    },

    generateSprite(el, useTitle, varName) {
        return new Promise(((resolve) => {
            const menuItems = el.querySelectorAll('.dropdown-menu a');
            let variableString = `${varName}: \n\t"",`;
            const menuLength = menuItems.length;

            menuItems.forEach((item, index) => {
                const attribute = useTitle ? item.getAttribute('title') : item.href.match('[^/]*(?=/$)');
                variableString += `\n\t"${attribute}"`;

                if (index !== menuLength - 1) {
                    variableString += ',';
                }
            });

            variableString += '\n;';
            resolve(variableString);
        }));
    },
};

dropdown.init();
