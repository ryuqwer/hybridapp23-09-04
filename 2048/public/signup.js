document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signup-form');
  
    signupForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${username}&password=${password}`,
      })
      .then(response => {
        if (response.ok) {
          alert('Sign up successful! You can now log in.');
          window.location.href = '/'; // Redirect to login page
        } else {
          alert('Error signing up. Please try again.');
        }
      })
      .catch(error => console.error('Error:', error));
    });
  });