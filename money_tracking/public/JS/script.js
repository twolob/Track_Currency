const submitButton = document.querySelector('#submit');

function toggleMenu() {
    const navBar = document.querySelector('.nav-bar');
    navBar.classList.toggle('active');
}

setTimeout(()=>{
    document.querySelector('#log-err-message').textContent = '';
}, 6000);

setTimeout(()=>{
    document.querySelector('#reg-err-message').textContent = '';
}, 6000);