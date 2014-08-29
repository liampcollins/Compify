
$(document).ready(function() {

  var clock = document.getElementById("countdown-holder-1")  
    
  var year =  $("#countdown-holder-1").data("year")
  var month =  $("#countdown-holder-1").data("month")
  var day =  $("#countdown-holder-1").data("day")
  var hours = $("#countdown-holder-1").data("hours")
  var minutes = $("#countdown-holder-1").data("minutes")
  var seconds = $("#countdown-holder-1").data("seconds")
  
  var targetDate = new Date(year, month, day); // Jan 1, 2050;  


  clock.innerHTML = countdown(targetDate).toString();  
  setInterval(function(){  
    clock.innerHTML = countdown(targetDate).toString();  
  }, 1000);  

});