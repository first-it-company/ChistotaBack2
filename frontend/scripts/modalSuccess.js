export function initModalSuccess() {
    const modal = document.querySelector('.modal-success')
    if (!modal) return

    const openButtons = document.querySelectorAll('.modal-success__open')
    const closeButtons = modal.querySelectorAll('.modal-success__close')
    const overlay = modal.querySelector('.modal-success__overlay')

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

    closeButtons.forEach((btn) => {  
        btn.addEventListener('click', closeModal)
    })

    overlay?.addEventListener('click', closeModal)

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal()
    })
}
