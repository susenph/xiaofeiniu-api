const pool = require('../../pool');
const express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
    var appName = req.query.appName;
    var apiUrl = req.query.apiUrl;
    var adminUrl = req.query.adminUrl;
    var appUrl = req.query.appUrl;
    var icp = req.query.icp;
    var copyright = req.query.copyright;

    if(!appName){
        res.send({ code: 401, msg: 'APPNAME CAN NTO BE EMPTY' });
        return;
    }
    if(!apiUrl){
        res.send({ code: 401, msg: 'APIURL CAN NTO BE EMPTY' });
        return;
    }
    if(!adminUrl){
        res.send({ code: 401, msg: 'ADMINURL CAN NTO BE EMPTY' });
        return;
    }
    if(!appUrl){
        res.send({ code: 401, msg: 'APPURL CAN NTO BE EMPTY' });
        return;
    }
    if(!icp){
        res.send({ code: 401, msg: 'ICP CAN NTO BE EMPTY' });
        return;
    }
    if(!copyright){
        res.send({ code: 401, msg: 'COPYRIGHT CAN NTO BE EMPTY' });
        return;
    }

    var sql = 'UPDATE xfn_settings SET appName=?, apiUrl=?, adminUrl=?, appUrl=?, icp=?, copyright=? WHERE sid=1';
    
    pool.query(sql, [appName, apiUrl, adminUrl, appUrl, icp, copyright], function(err, result) {
        if(err) throw err;
        if(result.affectedRows > 0){
            res.send({ code: 200, msg: 'UPDATE SUCCESS' });
        }else{
            res.send({ code: 301, msg: 'UPDATE  ERROR' });
        }
    });
});

module.exports = router;