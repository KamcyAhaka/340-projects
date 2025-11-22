const showPasswordBtn = document.querySelector('.show-password-btn');



showPasswordBtn.addEventListener('click', () => {
    const passwordInput = document.querySelector('#account_password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        showPasswordBtn.textContent = 'Hide';
    } else {
        passwordInput.type = 'password';
        showPasswordBtn.textContent = 'Show';
    }
});
