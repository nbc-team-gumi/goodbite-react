const express = require('express');
const path = require('path');
const http2 = require('http2');
const fs = require('fs');
const app = express();
const port = 443;

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', function(req, res) {
  const httpVersion = req.httpVersion;
  console.log(`HTTP Version: ${httpVersion}`);
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// HTTPS/HTTP2 서버를 생성
const server = http2.createSecureServer({
  key: fs.readFileSync(path.join(__dirname, 'goodbite.site-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'goodbite.site-crt.pem'))
}, app);

server.listen(port, () => {
  console.log(`HTTP/2 Server running on port ${port}`);
});