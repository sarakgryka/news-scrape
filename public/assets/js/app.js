


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
  