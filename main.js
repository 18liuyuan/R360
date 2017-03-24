var express =  require('express');
var app = express();
var router = require('./router/index.js');


app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(router);


var server = app.listen(5000, function(){
    console.log('server start, port 5000.');
});

