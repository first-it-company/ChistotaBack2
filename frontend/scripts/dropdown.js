export function initDropdown({ containerSelector, placeholder, options, onSelect }) {
    const container = document.querySelector(containerSelector);
    if (!container || !options.length) return;

    const initialLabel = placeholder ?? options[0].label;
    const isUsingPlaceholder = !!placeholder;

    container.innerHTML = `
        <button type="button" class="dropdown__toggle ${isUsingPlaceholder ? 'is-placeholder' : ''}">
            <span class="dropdown__label">${initialLabel}</span>
            <span class="dropdown__icon"></span>
        </button>
        <ul class="dropdown__menu visually-hidden"></ul>
    `;

    const toggle = container.querySelector('.dropdown__toggle');
    const label = toggle.querySelector('.dropdown__label');
    const menu = container.querySelector('.dropdown__menu');

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !menu.classList.contains('visually-hidden');
        menu.classList.toggle('visually-hidden');
        toggle.classList.toggle('is-open', !isOpen);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest(containerSelector)) {
            menu.classList.add('visually-hidden');
            toggle.classList.remove('is-open');
        }
    });

    options.forEach(({ label: text, value }, index) => {
        const li = document.createElement('li');
        li.textContent = text;
        li.dataset.value = value;
        
        li.addEventListener('click', () => {
            menu.querySelectorAll('li.selected').forEach(el => {
                el.classList.remove('selected');
            });
            
            li.classList.add('selected');
            toggle.classList.remove('is-placeholder');
            label.textContent = text;
            menu.classList.add('visually-hidden');
            toggle.classList.remove('is-open');
            
            if (typeof onSelect === 'function') onSelect(value);
        });
        
        menu.appendChild(li);
        
        if (!isUsingPlaceholder && index === 0) {
            li.classList.add('selected');
            if (typeof onSelect === 'function') onSelect(value);
        }
    });
}