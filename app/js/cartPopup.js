function showPopup(productName) {


  //console.log(checkCookie("username"));
  if (!checkCookie("username")) {
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
    popup.innerText = `You need to login to add products to cart`;
    setTimeout(() => {
      popup.style.display = 'none';
    }, 2000); // Hide the popup after 3 seconds (adjust as needed)
    //console.log("no cookie")
    return null;
  }

  const popup = document.getElementById('popup');
  popup.style.display = 'block';
  popup.innerText = `${productName} added to the cart!`;

  setTimeout(() => {
    popup.style.display = 'none';
  }, 2000); // Hide the popup after 3 seconds (adjust as needed)

  return "success"

}

function incrementCart(){
  //console.log("incrementCart() called");
  // get value of id cartIcon and convert to int
  var cartIcon = document.getElementById("cartIcon").innerHTML;
  var cartIconInt = parseInt(cartIcon);
  // increment value
  cartIconInt++;
  // update value
  document.getElementById("cartIcon").innerHTML = cartIconInt;
}

function checkCookie(name) {
  var cookieArr = document.cookie.split(";");
  for(var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");
      if(name == cookiePair[0].trim()) {
          return true;
      }
  }
  return false;
}


