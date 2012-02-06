var app = require('../app');

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.readDocs =  function(req, res) {
  // Some kind of Mongo query/update
  app.Document.find().all(function(documents) {
    switch (req.params.format) {
      // When json, generate suitable data
      case 'json':
        res.send(documents.map(function(d) {
          return d.toObject();
        }));
      break

      // Else render a database template (this isn't ready yet)
      default:
        //res.render('documents/index.jade', {
            //locals: { documents: documents }
        //}); 
        res.render('index', { title: 'Express2' })
    }
  });
  
};

exports.createDoc = function(req, res) {
  var document = new app.Document(req.body['document']);
  document.save(function() {
    switch (req.params.format) {
      case 'json':
        var data = document.toObject();
        res.send(data);
       break;

       default:
        res.redirect('/documents');
    }
  });
};

