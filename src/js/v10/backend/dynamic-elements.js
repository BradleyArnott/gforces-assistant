const dynamicElements = {
    options: [],
    modalInterval: '',

    init() {
        this.modalInterval = setInterval(this.modalVisible, 500);
    },

    modalVisible() {
        const modal = document.getElementById('dynamicElementContentModal');
        const styles = window.getComputedStyle(modal);
        if (styles.display === 'none' || modal.style.display === '') return;
        dynamicElements.addEvents();
    },

    addEvents() {
        clearInterval(this.modalInterval);
        this.addAllButton();
        this.deleteAllButton();
    },

    addAllButton() {
        const button = document.getElementById('addContentToPage');
        const newButton = document.createElement('a');
        newButton.className = 'btn btn-success';
        newButton.id = 'add-all-pages';
        newButton.innerHTML = 'Add all';
        button.parentElement.insertBefore(newButton, null);

        newButton.addEventListener('click', () => {
            const options = document.querySelectorAll('.show-page-absolute-url option');
            options.forEach((option) => {
                option.setAttribute('selected', 'selected');
                button.click();
            });
        });
    },

    deleteAllButton() {
        const button = document.getElementById('removeContentFromPage');
        const newButton = document.createElement('a');
        newButton.className = 'btn btn-danger';
        newButton.id = 'delete-all-pages';
        newButton.innerHTML = 'Delete all';
        button.parentElement.insertBefore(newButton, null);

        newButton.addEventListener('click', () => {
            const options = document.querySelectorAll('#DynamicElementContent_associatedPages option');
            options.forEach((option) => {
                option.remove();
            });
        });
    },
};

dynamicElements.init();
