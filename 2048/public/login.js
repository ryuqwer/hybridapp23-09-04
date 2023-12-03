document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // 서버로 요청을 보내기 전에 입력된 정보를 서버에서 검증할 수 있도록 함
      fetch('/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `username=${username}&password=${password}`,
      })
      .then(response => {
          return response.json(); // 서버에서의 응답을 JSON으로 파싱
      })
      .then(data => {
          if (data.success) {
              alert('Login successful!');
              window.location.href = '/2048TNT.html';
          } else {
              console.log('Login failed. Please check your username and password.');
          }
      })
      .catch(error => console.error('Error:', error));
  });
});