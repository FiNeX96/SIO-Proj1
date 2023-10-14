
function showPopup(productName) {

  var cookie = document.cookie;

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
