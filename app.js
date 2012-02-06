
/**
 * Module dependencies.
 */

var express = require('express'),
    mongoose = require('mongoose'),
    routes = require('./routes'),
    models = require('./models.js'),
    Document

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

models.defineModels(mongoose, function() {
 //Here we use the schema for model "Document"
  app.Document = Document = mongoose.model('Document');
 // app.User = User = mongoose.model('User');
 // app.LoginToken = LoginToken = mongoose.model('LoginToken');
 // db = mongoose.connect(app.set('db-uri'));
  //db = mongoose.connect('mongodb://localhost/nodepad');
  db = mongoose.connect('mongodb://gomino:567340@staff.mongohq.com:10097/nodepad');
})

app.configure('development', function(){
  app.use(express.logger());
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  //db = mongoose.connect('mongodb://localhost/nodepad');
});

app.configure('production', function(){
  app.use(express.logger());
  app.use(express.errorHandler()); 
  //db = mongoose.connect('mongodb://localhost/nodepad');
});

app.configure('test', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  //db = mongoose.connect('mongodb://localhost/nodepad');
});


// Routes

app.get('/', routes.index);

// :format can be json or html

app.get('/documents', function(req, res) {
    //console.log('get request');
  Document.find({}, function(err, documents) {
    //console.log('inside get request');
    documents = documents.map(function(d) {
     //console.log(d);
     return { title: d.title, id: d._id };
    });
    console.log(documents);
    res.render('documents/index.jade', {
      locals: { documents: documents, title: 'Documents' }
    });
  });
});

app.get('/documents/:id.:format?/edit', function(req, res) {
  Document.findById(req.params.id, function(d) {
    res.render('documents/edit.jade', {
      locals: { d: d }
    });
  });
});

app.get('/documents/new', function(req, res) {
  res.render('documents/new.jade', {
    locals: { d: new Document(), title: 'New Document'}
  });
});

// List
app.get('/documents.:format?', routes.readDocs);

// Create 
app.post('/documents.:format?', routes.createDoc);

// Read
app.get('/documents/:id.:format?', function(req, res) {
});

// Update
app.put('/documents/:id.:format?', function(req, res) {
});

// Delete
app.del('/documents/:id.:format?', function(req, res) {
});





//app.listen(3000);
var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0");
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

exports.Document = Document;
