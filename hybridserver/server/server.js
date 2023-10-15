const express = require('express');
const app = express();
const port = 5000;


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // 모든 origin에서의 요청을 허용
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  
  app.get('/hi', hi);
  
  app.listen(port, start_server);
  
  function hi(req, res) {
    res.send('세상아 안녕');
  }
  
  function start_server() {
    console.log(`서버 시작했다 (http://localhost:${port})`);
  }

// app.get('/hi', hi);
// app.listen(port,start_server);



// function hi(req, res)
// {
//     res.setHeader('Access-Control-Allow-Origin', 'http://your-client-origin.com');
//     res.send('세상아 안녕');
// }

// function start_server()
// {
//     console.log('서버 시작했다( http://localhost:${port} )');
// }