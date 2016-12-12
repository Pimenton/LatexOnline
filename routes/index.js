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

  var code = "\\documentclass{article}\n"+
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

var image = 0;

router.post('/upload', function(req, res) {
    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }
    console.log(__dirname)
    var resource = req.files.resource;
    var dir = __dirname+'/../public/images';//dirs[resource.name.split('.').reverse()[0]] || 'img';
    fs.writeFile( dir + '/image'+image++, resource.data);
    res.render('upload');
});

router.get('/upload', function(req, res) {
    res.render('upload.ejs');
});

router.get('/images', function(req,res){
  var images = [];
  fs.readdir(__dirname+'/../public/images', function(err, dir){
    for (var i=0; i<dir.length; i++) {
      if (dir[i].indexOf('image') == 0) {
          images.push(dir[i])
      }
    }
    res.send(images);
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
  if (element.useDate)
  {
    if (element.date != "")
    {
      code += "\\date{"+element.date+"}\n";
    }
  } else
  {
    code += "\\date{}\n";
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

functions['subsection'] = function(element){
  var code =
      "\\subsection{"+element.title+"}\n"+
      element.text+
      "\n";

  code += generateCode(element.childs);
  code += "\n";
  return code;
};

functions['subsubsection'] = function(element){
  var code =
      "\\subsubsection{"+element.title+"}\n"+
      element.text+
      "\n";
  return code;
};


functions['abstract'] = function(element)
{
  var code = "\\begin{abstract}\n"
              + element.text + "\n"
              + "\\end{abstract}\n";      
  return code;
}