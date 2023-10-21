function addToCart(productName) {

    // Retrieve the username from the document's cookies
    if (checkCookie("username")) {
        var username = document.cookie.split('; ').find(row => row.startsWith('username=')).split('=')[1];
    }
    // Check if the cart for the user already exists in the local storage
    let cart = JSON.parse(localStorage.getItem("cart_"+username));

    // If the cart does not exist, create a new empty array
    if (!cart) {
        cart = [];
    }

    // Check if the product already exists in the cart
    let product = cart.find(item => item.product === productName);

    // If the product exists, increase its quantity
    if (product) {
        product.quantity++;
    } else {
        // If the product does not exist, add it to the cart with a quantity of 1
        cart.push({ product: productName, quantity: 1 });
    }

    // Save the updated cart back to the local storage
    localStorage.setItem("cart_"+username, JSON.stringify(cart));
    //console.log(localStorage);
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