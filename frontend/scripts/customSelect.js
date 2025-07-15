export function initCustomSelect() {
    const customSelects = document.querySelectorAll('.custom-select');
    
    if (!customSelects.length) return;
    
    customSelects.forEach(select => {
        const trigger = select.querySelector('.custom-select__trigger');
        const dropdown = select.querySelector('.custom-select__dropdown');
        const placeholder = select.querySelector('.custom-select__placeholder');
        const hiddenInput = select.querySelector('.custom-select__input');
        const options = select.querySelectorAll('.custom-select__option');
        
        if (!trigger || !dropdown || !placeholder || !hiddenInput) return;
        
        // Делаем trigger доступным для табуляции
        trigger.setAttribute('tabindex', '0');
        
        // Открытие/закрытие дропдауна
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Закрыть все другие селекты
            closeAllSelects(select);
            
            const isOpen = dropdown.classList.contains('is-open');
            
            if (isOpen) {
                closeSelect(select);
            } else {
                openSelect(select);
            }
        });

        // Поддержка навигации с клавиатуры
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                trigger.click();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (!dropdown.classList.contains('is-open')) {
                    openSelect(select);
                } else {
                    const firstOption = dropdown.querySelector('.custom-select__option');
                    if (firstOption) firstOption.focus();
                }
            }
        });

        // Навигация по опциям
        options.forEach((option, index) => {
            option.setAttribute('tabindex', '0');
            
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    option.click();
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextOption = options[index + 1];
                    if (nextOption) nextOption.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevOption = options[index - 1];
                    if (prevOption) {
                        prevOption.focus();
                    } else {
                        trigger.focus();
                    }
                }
            });
        });
        
        // Выбор опции
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const value = option.getAttribute('data-value');
                const text = option.textContent.trim();
                
                // Обновляем значения
                placeholder.textContent = text;
                placeholder.classList.add('has-value');
                hiddenInput.value = value;
                
                // Убираем выделение с других опций
                options.forEach(opt => opt.classList.remove('is-selected'));
                
                // Выделяем выбранную опцию
                option.classList.add('is-selected');
                
                // Закрываем дропдаун
                closeSelect(select);
                
                // Триггерим событие change для совместимости с формами
                const changeEvent = new Event('change', { bubbles: true });
                hiddenInput.dispatchEvent(changeEvent);
            });
        });
    });
    
    // Закрытие селектов при клике вне их
    document.addEventListener('click', () => {
        closeAllSelects();
    });
    
    // Закрытие селектов при нажатии Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllSelects();
        }
    });
    
    function openSelect(select) {
        const trigger = select.querySelector('.custom-select__trigger');
        const dropdown = select.querySelector('.custom-select__dropdown');
        
        trigger.classList.add('is-open');
        dropdown.classList.add('is-open');
    }
    
    function closeSelect(select) {
        const trigger = select.querySelector('.custom-select__trigger');
        const dropdown = select.querySelector('.custom-select__dropdown');
        
        trigger.classList.remove('is-open');
        dropdown.classList.remove('is-open');
    }
    
    function closeAllSelects(exceptSelect = null) {
        customSelects.forEach(select => {
            if (select !== exceptSelect) {
                closeSelect(select);
            }
        });
    }
} 