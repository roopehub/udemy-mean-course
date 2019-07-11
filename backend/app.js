const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect(
  "mongodb+srv://hcroope:9cB4qQrXiW1hImr4@mean-cluster-free-w5gfn.mongodb.net/node-angular", { //?retryWrites=true&w=majority
  useNewUrlParser: true
}).then(() => {
  console.log('connected to db');
}).catch(() => {
  console.log('db connection failed');
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use("/images", express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, PUT');
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});

module.exports = app;
