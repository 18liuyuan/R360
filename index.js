var express =  require('express');
var app = express();

app.set('view engine', 'ejs');



app.use(express.static('public'));
app.get('/home', function(req, res){
    res.redirect('home.html');

});

var server = app.listen(5000, function(){
    console.log('server start.');
});

