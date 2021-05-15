//Get the button:
mybutton = document.getElementById("back-top");
mybutton.style.display = "none";
const minTh = 100;
const maxTh = 1000;

function scrollFunction() {
  var scrollTop = document.documentElement.scrollTop;
  if (scrollTop < minTh) {
    mybutton.style.display = "none";
  } else if (scrollTop < maxTh) {
    mybutton.style.display = "block";
    mybutton.style.opacity = (scrollTop - minTh) / (maxTh - minTh);
  } else {
    mybutton.style.display = "block";
  }
}

// When the user scrolls down 100px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  window.scrollTo({top: 0, behavior: 'smooth'});
}