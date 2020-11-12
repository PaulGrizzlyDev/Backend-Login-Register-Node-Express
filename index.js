const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const routes = require('./src/routes/v1');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
 

app.use(bodyParser.json())
routes(app);

mongoose.connect('mongodb://localhost/blindMatch', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=> { console.log("Conection OK ");})
.catch( error =>{ console.log("error")});


app.listen(4000, function(){
    console.log("runnning");
})