'use strict';

(() => {

    
    const todoList = {
        selector: null,
        form: null,
        containerSelector: null,
        container: null,

        init (formSelector, divContainer) {
            if(typeof formSelector === "string" || formSelector.trim() !== "" ) {
                this.selector = formSelector;
            }

            if(typeof divContainer === "string" || divContainer.trim() !== "" ) {
                this.containerSelector = divContainer;
            }

            this.getForm();
            this.getContainer();
            this.deleteItem();
        },

        getForm () {
            const formElement = document.querySelector(this.selector);
            this.form = formElement;

            formElement.addEventListener('submit', e => {
                e.preventDefault();
                e.stopPropagation();

                const dataFromInput = {};

                formElement.querySelectorAll('input, textarea')
                    .forEach(input => {
                        dataFromInput[input.name] = input.value;
                });

                const dataFromInputSave = this.dataSave(dataFromInput);

                this.renderItem(dataFromInputSave);
            });
        },

        getContainer() {
            this.container = document.querySelector(this.containerSelector);

            document.addEventListener('DOMContentLoaded', e => {
                e.preventDefault();

                const dataFromStorage = JSON.parse(localStorage.getItem(this.selector));

                if(!dataFromStorage) return 'Local Storage is empty';

                dataFromStorage.map(todoItem => {
                    this.renderItem(todoItem);
                });
            });
        },

        dataSave (dataFromInput) {

            let dataFromStorage = localStorage.getItem(this.selector);

            if(!dataFromStorage) {
                dataFromInput.id = 1;
                const dataToSave = [];
                dataToSave.push(dataFromInput);
                localStorage.setItem(this.selector, JSON.stringify(dataToSave));
            }

            if(dataFromStorage) {
                dataFromStorage = JSON.parse(dataFromStorage);

                const lastTodoId = dataFromStorage[dataFromStorage.length - 1].id;
                dataFromInput.id = Number(lastTodoId) + 1;

                dataFromStorage.push(dataFromInput);
                localStorage.setItem(this.selector, JSON.stringify(dataFromStorage));
            }

            return dataFromInput;
        },

        renderItem (data) {
            const wrapper = document.createElement('div');

            wrapper.classList.add('col-4');
            wrapper.setAttribute('data-id', data.id);

            wrapper.innerHTML = `
            <div class="taskWrapper">
                    <div class="taskHeading">${data.title}</div>
                    <div class="taskDescription">${data.description}</div>
            </div>`;

            this.container.prepend(wrapper);
        },

        deleteItem () {
            this.container.addEventListener('click', e => {
                e.stopPropagation();

                const currentItem = e.target.closest('[data-id]');
                const currentItemId = Number(currentItem.getAttribute('data-id'));

                const filteredData = JSON
                        .parse(localStorage.getItem(this.selector))
                        .filter(item => item.id !== currentItemId);
                    localStorage.setItem(this.selector, JSON.stringify(filteredData));

                    currentItem.remove();
            });

        },
    }

    todoList.init('#todoForm', '#todoItems');


})();