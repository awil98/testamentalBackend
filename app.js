let express = require('express');
let mongoose = require('mongoose');
let morgan = require('morgan');
let helmet = require('helmet');
let api1 = require('./api1.js');

let app = express();

const PORT = process.env.PORT || 3000;

app.use(morgan('short'));
app.use(helmet());
app.use("/v1", api1);

app.listen(PORT, function(){
  console.log(`Server running on port ${PORT}`)
});
