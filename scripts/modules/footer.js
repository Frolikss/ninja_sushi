function footerQuicktipToggle() {
    const active = 'footer__quicktip_active';
    const quickTipDiv = document.querySelector('.footer__quicktip');
    const quickTipBtn = document.querySelector('.footer__quicktip--button');
    
    quickTipBtn.addEventListener('click', event => {
        quickTipDiv.classList.toggle(active);
    })
}

export {footerQuicktipToggle};