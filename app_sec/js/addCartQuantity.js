function addToCartQuantity() {

    var quantity = parseInt(document.getElementById("quantity").value);
    var productName = document.getElementById("nome_produto").textContent;

    // Retrieve the username from the document's cookies
    var token = localStorage.getItem('access_token');
    if (!token) {
        return;
    }
    var decoded_token = parseJWT(token);
    var username = decoded_token.sub;
    // Check if the cart for the user already exists in the local storage
    let cart = JSON.parse(localStorage.getItem("cart_" + username));

    // If the cart does not exist, create a new empty array
    if (!cart) {
        cart = [];
    }

    // Check if the product already exists in the cart
    let product = cart.find(item => item.product === productName);

    // If the product exists, increase its quantity
    if (product) {
        product.quantity += quantity;
    } else {
        // If the product does not exist, add it to the cart with a quantity of 1
        cart.push({ product: productName, quantity: 1 });
    }

    // Save the updated cart back to the local storage
    localStorage.setItem("cart_" + username, JSON.stringify(cart));
    //console.log(localStorage);
}

function increaseQuantity() {

    var quantity = document.getElementById("quantity").value;
    quantity++;
    document.getElementById("quantity").value = quantity;

}

function reduceQuantity() {

    var quantity = document.getElementById("quantity").value;
    if (quantity > 1) {
        quantity--;
        document.getElementById("quantity").value = quantity;
    }

}

function incrementCart() {
    //console.log("incrementCart() called");
    // get value of id cartIcon and convert to int
    var quantity = parseInt(document.getElementById("quantity").value);
    var cartIcon = document.getElementById("cartIcon").textContent;
    var cartIconInt = parseInt(cartIcon);
    // increment value
    cartIconInt += quantity;
    // update value
    document.getElementById("cartIcon").textContent = cartIconInt;
}
