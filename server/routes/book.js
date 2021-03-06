var express = require('express');
var router = express.Router();
var pg = require('pg');

var config = {
  database: 'chi', // name of your database
  host: 'localhost', // where is your database?
  port: 5432, // port for the database
  max: 10, // how many connections at one time
  idleTimeoutMillis: 30000 // 30 seconds to try to connect
};

var pool = new pg.Pool(config);

router.get('/', function(req, res){
  // SELECT * FROM "books";
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.send(500);
    } else {
      // We connected!!!!
      db.query('SELECT * FROM books ORDER BY "id" DESC;', function(queryError, result){
        done();
        if(queryError) {
          console.log('Error making query.');
          res.sendStatus(500);
        } else {
          // console.log(result); // Good for debugging
          res.send(result.rows);
        }
      });
    }
  });
});

router.post('/add', function(req, res){
  console.log(req.body);
  var title = req.body.title;
  var author = req.body.author;
  var publisher = req.body.publisher;
  var year = req.body.year;
  // INSERT INTO "books" ("author", "title") VALUES ('David Mitchel','Cloud Atlas');
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.send(500);
    } else {
      // We connected!!!!
      db.query('INSERT INTO books (author, title, publisher, year) ' +
               'VALUES ($1,$2,$3,$4);',
               [author, title, publisher, year], function(queryError, result){
        done();
        if(queryError) {
          console.log('Error making query.');
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });
    }
  });
});

router.delete('/delete/:bookId', function(req, res) {
  var bookId = req.params.bookId; // store bookId in variable for deletion
  console.log('Deleting book: ', bookId);
  // DELETE FROM "books" WHERE "id" = bookId
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.send(500);
    } else {
      // We connected!!!!
      db.query(('DELETE FROM books WHERE id = ' + bookId), function(queryError, result) {
        done();
        if(queryError) {
          console.log('Error making query.');
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      }); // end db.query
    } // end errorConnectingToDatabase if/else
  });
});

// '/books/update/:bookId' 'PUT' AJAX
router.put('/update/:bookId', function(req, res) {
  var bookId = req.params.bookId; // store bookId in variable for deletion
  var title = req.body.title;
  var author = req.body.author;
  var publisher = req.body.publisher;
  var year = req.body.year;
  console.log('Updating book: ', bookId);
  // UPDATE "books" SET title = 'HANGRY CATERPILLAR', author = 'Eric Carl' WHERE "id" = 52;
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.sendStatus(500);
    } else {
      // We connected!!!!
      db.query(("UPDATE books " +
                "SET title = $1, author = $2, publisher = $3, year = $4 " +
                "WHERE id = $5;"),
                [title, author, publisher, year, bookId], function(queryError, result) {
        done();
        if(queryError) {
          console.log('Error making query.');
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      }); // end db.query
    } // end errorConnectingToDatabase if/else
  });
});

module.exports = router;
