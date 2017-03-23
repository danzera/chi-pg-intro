var editing = false;
var bookId = 0;

$(document).ready(function(){
  console.log('jQuery sourced');
  getBooks();

  $('#books').on('click', '.delete', function(){
    console.log('Delete book: '+ $(this).data('book'));
    bookId = $(this).data('book');
    $.ajax({
      type: 'DELETE', // Similar SELECT or GET
      url: '/books/delete/' + bookId, // e.g. /books/delete/53
      success: function(res) {
        // refresh books list
        getBooks();
      }
    });
  });

  $('#books').on('click', '.edit', function(){
    console.log($(this).data('book'));
    editing = true;
    $('#formTitle').text("You are now editing...");
    bookId = $(this).data('book');
    $('#title').val($(this).data('title'));
    $('#author').val($(this).data('author'));
    $('#publisher').val($(this).data('publisher'));
    $('#year').val($(this).data('year'));
  });

  $('#bookForm').on('submit', function(event) {
    event.preventDefault();
    if ($('#title').val() === '' ||
        $('#author').val() === '' ||
        $('#publisher').val() === '' ||
        $('#year').val() === '') {
          alert('zOMG! Please complete all input fields!');
    } else {
      console.log($('#title').val(), $('#author').val());
      if (editing) {
        editing = false;
        $('#formTitle').text("Add new entry");
        $.ajax({
          type: "PUT", // Similar to POST (data & req.body)
          url: "books/update/" + bookId, // e.g. /books/update/53
          data: {
            title: $('#title').val(),
            author:$('#author').val(),
            publisher: $('#publisher').val(),
            year: $('#year').val()},
          success: function(response) {
            console.log('did we get here?');
            // Refresh our data
            getBooks();
          } // end success
        }); // end AJAX
      } else { // !editing
        $.ajax({
          type: "POST",
          url: "/books/add",
          data: {
            title: $('#title').val(),
            author:$('#author').val(),
            publisher: $('#publisher').val(),
            year: $('#year').val()},
          success: function(response) {
            // Refresh our data
            getBooks();
          } // end success
        }); // end AJAX
      } // end else AJAX statement
      clearForm();
    } // end main else statement
  });
});

function clearForm() {
  $('#title').val('');
  $('#author').val('');
  $('#publisher').val('');
  $('#year').val('');
}

function getBooks() {
  $.ajax({
    type: "GET",
    url: "/books",
    success: function(response) {
      console.log(response);
      $('#books').empty();
      for(var i = 0; i < response.length; i++) {
        var book = response[i];
        $('#books').append('<tr></tr>');
        var $el = $('#books').children().last();
        $el.append('<td>' + book.id + '</td>');
        $el.append('<td>' + book.author + '</td>');
        $el.append('<td>' + book.title + '</td>');
        $el.append('<td>' + book.publisher + '</td>');
        $el.append('<td>' + book.year + '</td>');
        $el.append('<td><button class="delete" data-book="' +
        book.id + '">Delete</button></td>');
        $el.append('<td><button class="edit" data-book="' +
        book.id + '" data-author="' +
        book.author + '" data-title="'+
        book.title + '"data-publisher="' +
        book.publisher + '"data-year="' +
        book.year +'">Edit</button></td>');
      }
    }
  });
}
