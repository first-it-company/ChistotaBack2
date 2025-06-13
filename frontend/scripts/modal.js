export function initModal() {
    const modal = document.querySelector('.modal')
    if (!modal) return

    const openButtons = document.querySelectorAll('.modal-open')
    const closeButton = modal.querySelector('.modal__close')
    const overlay = modal.querySelector('.modal__overlay')

    const STATE_CLASSES = {
        isActive: 'is-active',
        isLock: 'is-lock',
    }

    const openModal = () => {
        modal.classList.add(STATE_CLASSES.isActive)
        document.documentElement.classList.add(STATE_CLASSES.isLock)
    }

    const closeModal = () => {
        modal.classList.remove(STATE_CLASSES.isActive)
        document.documentElement.classList.remove(STATE_CLASSES.isLock)
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
