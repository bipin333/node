const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

const dataFilePath = 'data.json';

let storedData = {};

try {
  const fileData = fs.readFileSync(dataFilePath, 'utf8');
  storedData = JSON.parse(fileData);
} catch (error) {
  console.error('Error loading data:', error);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/add', (req, res) => {
  const deviceId = req.body.deviceId;
  const newWord = req.body.word;

  if (!storedData[deviceId]) {
    storedData[deviceId] = [];
  }

  storedData[deviceId].unshift(newWord);
  fs.writeFileSync(dataFilePath, JSON.stringify(storedData, null, 2));

  res.redirect('/');
});

app.get('/getWords', (req, res) => {
  const deviceId = req.query.deviceId;
  const words = storedData[deviceId] || [];
  res.json(words);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
