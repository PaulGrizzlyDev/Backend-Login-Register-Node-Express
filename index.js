const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { countries} = require('countries-list');
const { query } = require('express');

const routes = require('./src/routes/v1');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
routes(app);
mongoose.connect('mongodb://localhost/blindMatch', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=> { console.log("Conectado");})
.catch( error =>{ console.log("error")});


app.get("/country", (request, response) => {
response.json(countries[request.query.code]);
});
app.listen(4000, function(){
    console.log("runnning");
})