var htmlparser = require("htmlparser2");
var fs = require('fs');

//parse a template
fs.readFile('test/test.tpl.html', 'utf8', function (err, data) {
    
  //component tree to build from template nodes
  var components = [];

  //leave if ther was a problem opening the file
  if (err) {
    return console.log(err);
  }

  //opentags
  var open = 0;

  var root = 0; 
  
  //current working kind
  var current = {};
  var lastParent = {};
    
  //parse the HTML
  var parser = new htmlparser.Parser({
        onopentag: function(name, attribs){
            //create a new kind
            var kind = {tag: name, kind: attribs.kind};
            
            //if we're inside a tree, we need to append components
            if(open > 0) {
                current.components = current.components || [];
                current.components.push(kind);
                lastParent = current;
                current = kind;
            } else {
                //push the kind if we're not inside an open tag
                root = components.push(kind);
                current = components[open];
            }
            
            open ++;
        },
        ontext: function(text){
           
        },
        onclosetag: function(tagname){
            //reduce the number of tags open
            open --;
            //set the current tag to the last open
            if(open <= 0) { 
                current = components[root];
            } else {
                current = lastParent;
            }
        },
        onend: function(){
            console.log(JSON.stringify(components));
        }
    });

    parser.write(data);
    parser.end();
});

