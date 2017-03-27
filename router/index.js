var express = require('express');
var router = express.Router();
var db = require('./db.js');

var dbConnected = false;

db.start(function(data){
    console.log(JSON.stringify(data));
    if(data.result == 2){
        dbConnected = true;
    }
});


router.get('/home', function(req, res){
    res.redirect('home.html');

});


router.get('/report', function(req, res){
    res.redirect('report.html');
});

router.get('/api/get_report_data', function(req, res){
    if(!dbConnected){
        res.send({
            result : -1,
            message : 'database not connected.'
        });
    } else {
        db.get_irecord(req.query, function(data){
            res.send(data);
        });
    }
});

module.exports = router;