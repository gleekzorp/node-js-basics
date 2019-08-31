var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// Read Data
router.get('/get-data', function(req, res, next) {
  var resultArray = []

  mongo.connect(url, function(err, client) {
    assert.equal(null, err);
    var db = client.db('test');
    var cursor = db.collection('user-data').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      client.close();
      res.render('index', { items: resultArray });
    });
  });
});

// Create Data
router.post('/insert', function(req, res, next) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };
  
  mongo.connect(url, function(err, client) {
    assert.equal(null, err);
    var db = client.db('test');
    db.collection('user-data').insertOne(item, function(err, result) {
      assert.equal(null, err);
      console.log('Item inserted');
      client.close();
    });
  });
  res.redirect('/');
});

// Update Data
router.post('/update', function(req, res, next) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };
  var id = req.body.id;
  
  mongo.connect(url, function(err, client) {
    assert.equal(null, err);
    var db = client.db('test');
    db.collection('user-data').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      client.close();
    });
  });
})

// Delete Data
router.post('/delete', function(req, res, next) {
  var id = req.body.id;
  
  mongo.connect(url, function(err, client) {
    assert.equal(null, err);
    var db = client.db('test');
    db.collection('user-data').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Item deleted');
      client.close();
    });
  });
})

module.exports = router;
