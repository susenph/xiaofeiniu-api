const pool = require('../../pool');
const express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
    var sql = 'SELECT * FROM xfn_settings';
    
    pool.query(sql, function(err, result) {
        if(err) throw err;
        if(result.affectedRows > 0){
            res.send({ code: 200, data: result });
        }else{
            res.send({ code: 301, msg: 'SELECT SETTINGS  ERROR' });
        }
    });
});