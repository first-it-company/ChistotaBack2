let modal, STATE_CLASSES;

export function initModal() {
    modal = document.querySelector('.modal')
    if (!modal) return

    const openButtons = document.querySelectorAll('.modal-open')
    const closeButton = modal.querySelector('.modal__close')
    const overlay = modal.querySelector('.modal__overlay')

    STATE_CLASSES = {
        isActive: 'is-active',
        isLock: 'is-lock',
    }

    openButtons.forEach((btn) => {
        btn.addEventListener('click', openModal)
    })

    closeButton?.addEventListener('click', closeModal)
    overlay?.addEventListener('click', closeModal)

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal()
    })
}

export function openModal() {
    if (!modal) return;
    modal.classList.add(STATE_CLASSES.isActive)
    document.documentElement.classList.add(STATE_CLASSES.isLock)
}

export function closeModal() {
    if (!modal) return;
    modal.classList.remove(STATE_CLASSES.isActive)
    document.documentElement.classList.remove(STATE_CLASSES.isLock)
}
