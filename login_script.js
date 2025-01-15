document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('login-btn');
     const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageContainer = document.getElementById('message-container');
     // Default admin credentials
   const defaultEmail = 'admin@example.com';
   const defaultPassword = 'password';


  function showMessage(message, type) {
       messageContainer.textContent = message;
       messageContainer.className = `message-container ${type}`;
       messageContainer.style.display = 'block'; // Show the container
      setTimeout(() => {
           messageContainer.style.display = 'none';
       }, 3000); // Hide after 3 seconds
   }

   loginBtn.addEventListener('click', function() {
        const enteredEmail = emailInput.value.trim();
       const enteredPassword = passwordInput.value.trim();

        if (enteredEmail === defaultEmail && enteredPassword === defaultPassword) {
             // Redirect to dashboard or next page
            showMessage('Login Successful','success');
             setTimeout(() => {
                 window.location.href = 'dashboard.html';
               }, 3000);

        } else {
           showMessage('Invalid email or password.', 'error');
         }
     });
});