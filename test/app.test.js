// Force test environment
process.env.NODE_ENV = 'test';
var app = require('../app'),
    assert = require('assert'),
    lastID = '';

module.exports = {
 'POST /documents.json': function() {
    assert.response(app, {
        url: '/documents.json',
        method: 'POST',
        data: JSON.stringify({ document: { title: 'Test' } }),
        headers: { 'Content-Type': 'application/json' }
      }, {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      },

      function(res) {
        var document = JSON.parse(res.body);
        assert.equal('Test', document.title);
      });
  },

  'GET /': function() {
    assert.response(app,
      { url: '/'},
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }},
      function(res) {
        // All done, do some more tests if needed
        assert.includes(res.body, '<title>Express</title>');
        //process.exit();
      }
    );
  }
  
}

