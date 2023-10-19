
function showPopup(productName) {

  if (document.cookie != null && document.cookie != "") {
    var cookie = document.cookie.split('; ').find(row => row.startsWith('username=')).split('=')[1];
}

  if (cookie == "") {
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
    popup.innerText = `You need to login to add products to cart`;
    setTimeout(() => {
      popup.style.display = 'none';
    }, 2000); // Hide the popup after 3 seconds (adjust as needed)
    console.log("no cookie")
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
  console.log("incrementCart() called");
  // get value of id cartIcon and convert to int
  var cartIcon = document.getElementById("cartIcon").innerHTML;
  var cartIconInt = parseInt(cartIcon);
  // increment value
  cartIconInt++;
  // update value
  document.getElementById("cartIcon").innerHTML = cartIconInt;
}
