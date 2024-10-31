const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const app = express();
const port = 443;

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', function(req, res) {
  const httpVersion = req.httpVersion;
  console.log(`HTTP Version: ${httpVersion}`);
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// HTTPS 서버를 생성
const server = https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'goodbite.site-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'goodbite.site-crt.pem'))
}, app);

server.listen(port, () => {
  console.log(`HTTPS Server running on port ${port}`);
});
