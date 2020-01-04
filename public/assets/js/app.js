


$(document).on("click", "#getArt", function() {

console.log("clicked")

$.ajax({
    method: "GET",
    url: "/scrape"
  })
.then(function(data){

    console.log(data)
    location.reload();
})


})

$(document).on("click", ".save", function() {
 console.log("clicked")
    var thisId = $(this).attr("data-id");
  console.log(thisId)
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId,
   
    })
    
      .then(function(data) {
       
        console.log(data);
       
       
      });
 
  });
  $(document).on("click", ".deleteNote", function() {
    console.log("clicked")
       var thisId = $(this).attr("data-id");
     console.log(thisId)
       $.ajax({
         method: "GET",
         url: "/saved/" + thisId,
      
       })
       
         .then(function(data) {
          
           console.log(data);
           location.reload();
          
         });
    
     });
  $(document).on("click", ".addNote", function() {
   
    $("#notes").empty();
    
    var thisId = $(this).attr("data-id");
  
   
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      
      .then(function(data) {
        console.log(data);
      
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
       
        if (data.note) {
       
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  $(document).on("click", "#savenote", function() {

    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        body: $("#bodyinput").val()
       
      }
    
    }) 
      .then(function(data) {
        
        console.log(data.note);
      
        $("#notes").empty();
      });

    $("#bodyinput").val("");
  });
  
  