import IMask from 'imask';
import { closeModal } from './modal.js';


export function initFormFeedback() {
    const forms = document.querySelectorAll('[data-feedback-form]');
    
    forms.forEach(form => {
        const url = form.dataset.url;
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
        const phoneInput = form.querySelector('input[type="tel"]');
        const nameInput = form.querySelector('input[name="name"]');
        const checkbox = form.querySelector('input[type="checkbox"]');
        let phoneMask = null;
        let hasBlockedFirst8 = false;

        if (phoneInput) {
            phoneMask = IMask(phoneInput, {
                mask: '+{7} (000) 000-00-00',
                lazy: false,
                prepare: function (str, masked) {
                    const currentDigits = masked._value.replace(/\D/g, '').slice(1);
                    if (!hasBlockedFirst8 && currentDigits.length === 0 && str === '8') {
                        hasBlockedFirst8 = true;
                        return '';
                    }
                    return str;
                }
            });
        }

        function setError(input, isError) {
            if (isError) {
                input.classList.add('input-error');
            } else {
                input.classList.remove('input-error');
            }
        }

        [nameInput, phoneInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    if (input.classList.contains('input-error')) {
                        setError(input, false);
                    }
                });

                input.addEventListener('focus', () => {
                    if (input.classList.contains('input-error')) {
                        setError(input, false);
                    }
                });
            }
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;

            [nameInput, phoneInput].forEach(input => {
                if (input) setError(input, false);
            });

            if (!form.checkValidity()) {
                form.reportValidity();
                if (nameInput && !nameInput.checkValidity()) {
                    setError(nameInput, true);
                    isValid = false;
                }
                if (phoneInput && !phoneInput.checkValidity()) {
                    setError(phoneInput, true);
                    isValid = false;
                }
                return;
            }

            if (phoneMask && phoneMask.unmaskedValue.length !== 11) {
                setError(phoneInput, true);
                setTimeout(() => phoneInput.focus(), 3000);
                return;
            }

            if (checkbox && !checkbox.checked) {
                setError(checkbox, true);

                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        setError(checkbox, false);
                    }
                }, { once: true });

                setTimeout(() => checkbox.focus(), 3000);
                return;
            }

            const formData = new FormData(form);
            fetch(url, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': csrfToken
                }
            })
            .then(res => {
                if (!res.ok) throw new Error('Ошибка сети');
                return res.json();
            })
            .then(() => {
                const successModal = document.getElementById('success');
                if (successModal) {
                    successModal.classList.add('is-active');
                } else {
                    alert('Форма успешно отправлена!');
                }

                closeModal();

                form.reset();
                if (phoneMask) phoneMask.updateValue();
                
                [nameInput, phoneInput].forEach(input => {
                    if (input) setError(input, false);
                });

                hasBlockedFirst8 = false;
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при отправке формы');
            });
        });
        
    });
}
