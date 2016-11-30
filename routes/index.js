var express = require('express');
var router = express.Router();
var fs = require('fs');
var exec = require('child_process').exec;

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Latex Online Editor' });
});

var ids = {};

router.post('/compile', function(req, res){
  var id = 0;
  while(ids[id++]);
  ids[id] = true;

  fs.writeFile(__dirname+'/../public/code_'+id+'.tex', req.body.code, function() {

    //Compile two times two avoid latex errors
    exec('latex -output-directory=' + __dirname + '/../public/ ' + __dirname + '/../public/code_' + id + '.tex', function () {
      exec('latex -output-directory=' + __dirname + '/../public/ ' + __dirname + '/../public/code_' + id + '.tex', function () {
        res.send({url: '/code_' + id + '.dvi'});
      });
    });
  });
});

module.exports = router;
