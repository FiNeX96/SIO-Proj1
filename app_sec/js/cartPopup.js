function showPopup(productName) {

  var token = localStorage.getItem('access_token');

  if (!token) {
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
    popup.textContent = `You need to login to add products to cart`;
    setTimeout(() => {
      popup.style.display = 'none';
    }, 2000); // Hide the popup after 3 seconds (adjust as needed)
    return null;
  }

  const popup = document.getElementById('popup');
  popup.style.display = 'block';
  popup.textContent = `${productName} added to the cart!`;

  setTimeout(() => {
    popup.style.display = 'none';
  }, 2000); // Hide the popup after 3 seconds (adjust as needed)

  return "success"

}

function incrementCart() {
  var cartIcon = document.getElementById("cartIcon").textContent;
  var cartIconInt = parseInt(cartIcon);
  // increment value
  cartIconInt++;
  // update value
  document.getElementById("cartIcon").textContent = cartIconInt;
}




