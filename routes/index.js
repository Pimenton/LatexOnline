var express = require('express');
var router = express.Router();
var fs = require('fs');
var exec = require('child_process').exec;

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Latex Online Editor' });
});

var ids = 0;

router.post('/compile', function(req, res){
  var id = ids++;

  var tree = req.body.tree;


  var code =
      "\\documentclass{article}"+
      "\\begin{document}\n"+
        generateCode(tree)+
      "\\end{document}";
    console.log(code);

    fs.writeFile(__dirname+'/../public/code_'+id+'.tex', code, function() {

    //Compile two times two avoid latex errors
    exec('latex -output-directory=' + __dirname + '/../public/ ' + __dirname + '/../public/code_' + id + '.tex', function () {
      exec('latex -output-directory=' + __dirname + '/../public/ ' + __dirname + '/../public/code_' + id + '.tex', function () {
        res.send({url: '/code_' + id + '.dvi'});
      });
    });
  });
});

module.exports = router;

function generateCode(tree){
  if (!tree || tree == undefined || tree.length == 0) return "";

  var code = "";
  for (var i=0; i<tree.length; i++){
    var element = tree[i];
    if (typeof functions[element.kind] == 'function') {
      code += functions[element.kind](element);
    }
  }
  return code;
}

var functions = [];

functions['title'] = function(element){
  var code = "";

  if (element.title != ""){
    code += "\\title{"+element.title+"}\n";
  }
  if (element.authors != ""){
    code += "\\author{"+element.authors+"}\n";
  }

  code += "\\maketitle\n";
  return code;
  //TODO: implement date
};

functions['section'] = function(element){
  var code =
      "\\section{"+element.title+"}\n"+
      element.text+
      "\n";

  code += generateCode(element.childs);
  code += "\n";
  return code;
};