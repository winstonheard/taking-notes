const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
      if (err) throw err;
      res.json(JSON.parse(data));
    });
  });

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});



app.post('/api/notes', (req, res) => {
  const newNote = { ...req.body, id: uuidv4() };

  fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
  
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
      if (err) throw err;
      const notes = JSON.parse(data);
      const updatedNotes = notes.filter(note => note.id !== noteId);
      fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(updatedNotes), (err) => {
        if (err) throw err;
        res.sendStatus(200);
      });
    });
  });
  

app.listen(PORT, () => {
  console.log(`App is listening on PORT ${PORT}`);
});
