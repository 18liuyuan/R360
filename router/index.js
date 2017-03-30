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


router.get('/api/get_station', function(req, res){
     if(!dbConnected){
        res.send({
            result : -1,
            message : 'database not connected.'
        });
    } else {
        db.get_station(req.query, function(data){
            res.send(data);
        });
    }
});


router.get('/api/get_stccode', function(req, res){
     if(!dbConnected){
        res.send({
            result : -1,
            message : 'database not connected.'
        });
    } else {
        db.get_stccode(req.query, function(data){
            res.send(data);
        });
    }
});

router.get('/api/get_act', function(req, res){
    if(!dbConnected){
        res.send({
            result : -1,
            message : 'database not connected.'
        });
    } else {
        db.get_act(req.query, function(data){
            res.send(data);
        });
    }
});


router.get('/api/get_base_data', function(req, res){
    if(!dbConnected){
        res.send({
            result : -1,
            message : 'database not connected.'
        });
    } else {
        db.get_base_data(req.query, function(data){
            res.send(data);
        });
    }
});

module.exports = router;