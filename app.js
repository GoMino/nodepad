
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

//app.get('/', routes.index);
app.get('/', function(req, res) {
  res.redirect('/documents')
});

// Error handling
function NotFound(msg) {
  this.name = 'NotFound';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

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


app.get('/documents/new', function(req, res) {
  res.render('documents/new.jade', {
    locals: { d: new Document(), title: 'New Document'}
  });
});

// List
app.get('/documents.:format?', routes.readDocs);

// Create 
//app.post('/documents.:format?', routes.createDoc){
app.post('/documents.:format?', function(req, res) {
  var d = new Document(req.body);
  console.log("creating document: " + req.body + "vs " + d);
  //d.user_id = req.currentUser.id;
  d.save(function() {
    switch (req.params.format) {
      case 'json':
        var data = d.toObject();
        // TODO: Backbone requires 'id', but can I alias it?
        data.id = data._id;
        res.send(data);
      break;

      default:
        //req.flash('info', 'Document created');
        res.redirect('/documents');
    }
  });
});

// Read
app.get('/documents/:id.:format?/edit', function(req, res) {
  Document.findOne({ _id: req.params.id }, function(err, d) {
    res.render('documents/edit.jade', {
      locals: { d: d , title: 'Edit Document'}
    });
  });
});


// Update
app.put('/documents/:id.:format?', function(req, res) {
  // Load the document
  Document.findOne({ _id: req.params.id }, function(err, d) {
    // Do something with it
    d.title = req.body.title;
    d.data = req.body.data;
    console.log("updating document: " + d.title);

    // Persist the changes
    d.save(function() {
      // Respond according to the request format
      switch (req.params.format) {
        case 'json':
          res.send(d.__doc);
         break;

         default:
          res.redirect('/documents');
      }
    });
  });
});

// Delete
app.del('/documents/:id.:format?', function(req, res, next) {
// Load the document
  Document.findOne({ _id: req.params.id }, function(err, d) {
  	//if (!d) return next(new NotFound('Document not found'));
    // Do something with it
    
    //d.title = req.body.title;
    //d.data = req.body.data;
    console.log("deleting document: " + req.params.id);

    // Persist the changes
    d.remove(function() {
      // Respond according to the request format
      switch (req.params.format) {
        case 'json':
          res.send(d.__doc);
         break;

         default:
          res.redirect('/documents');
      }
    });
  });
});





app.listen(3000);
//var port = process.env.PORT || 3000;
//app.listen(port, "0.0.0.0");
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

exports.Document = Document;
