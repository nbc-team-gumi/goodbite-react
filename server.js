const express = require('express');
const path = require('path');
const app = express();
const port = 80;

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', function(req, res) {
  const httpVersion = req.httpVersion; // 요청된 HTTP 버전 확인
  console.log(`HTTP Version: ${httpVersion}`); // 콘솔에 HTTP 버전 출력

  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => console.log(`Server running on port ${port}`));