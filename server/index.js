require('dotenv').config();
const path = require('path');
const express = require('express');
const { json } = require('body-parser');
const massive = require('massive');
// const cors = require('cors');

const multer = require('multer');

const { getPics } = require('./cntrl/getPics');
const { uploadPic, deletePic } = require('./cntrl/uploadS3');
const { addTags, getTags, deleteTag } = require('./cntrl/addTags');
const app = express();
const upload = multer();
app.use(json());
app.use(express.static(`${__dirname}/../build`));
// app.use(cors());

const { CONNECTION_STRING, SERVER_PORT } = process.env;

massive(CONNECTION_STRING).then(dbInstance => {
  app.set('db', dbInstance);
  console.log('Database is Connected');
});

app.get('/auth/getPics', getPics);
app.get('/auth/getTags', getTags);
app.post('/auth/uploadPic', upload.single('pic'), uploadPic);
app.post('/auth/deletePic/:id', deletePic);
app.post('/auth/addTags', addTags);
app.post('/auth/deleteTag', deleteTag);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(SERVER_PORT, () => console.log(`Listening on ${SERVER_PORT}`));
