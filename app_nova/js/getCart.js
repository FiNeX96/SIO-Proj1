function getCart() {

    // get local storage

    // check if document.cookie with username is empty

    if (document.cookie != null && document.cookie != "") {
        var cookie = document.cookie.split('; ').find(row => row.startsWith('username=')).split('=')[1];
    }

    if (cookie == "") {
        document.querySelector(".cart-container").innerHTML = '<h2 style="text-align:center" >No products in cart</h1>';
        document.getElementById("shipping").innerHTML = "0€";
        document.getElementById("subtotal").innerHTML = "0€";
        document.getElementById("total").innerHTML = "0€";
        $("#checkoutbutton").prop("disabled", true);
        $("#checkoutbutton").addClass("disabled-button");
        $("#checkoutbutton").innerHTML = "Cart is empty"
        return 1;
    }

    var username = document.cookie.split('; ').find(row => row.startsWith('username=')).split('=')[1];

    //console.log(localStorage.getItem(username));

    var cart = JSON.parse(localStorage.getItem("cart_" + username));



    if (cart == null || cart.length == 0 || cart == []) {
        document.querySelector(".cart-container").innerHTML = '<h2 style="text-align:center"> No products in cart </h2>';
        document.getElementById("shipping").innerHTML = "0€";
        document.getElementById("subtotal").innerHTML = "0€";
        document.getElementById("total").innerHTML = "0€";
        $("#checkoutbutton").prop("disabled", true);

        // Optionally, you can also change its appearance to make it appear "greyed out"
        $("#checkoutbutton").addClass("disabled-button");
        $("#checkoutbutton").innerHTML = "Cart is empty"

        return 1;
    }
    fetchData(cart);
}


async function fetchData(cart) {
    var subtotal = 0;
    for (let cart_item in cart) {
        let product_name = cart[cart_item].product;
        let product_quantity = cart[cart_item].quantity;
        let response = await fetch("http://localhost:5000/getinfo/" + product_name);
        let data = await response.json();
        const productContainer = document.querySelector(".cart-container");
        const productCard = document.createElement("tr");
        productCard.innerHTML = `
            <td class="align-middle"><img src="img/${data.imglink}" alt="" style="width: 50px;"> ${product_name}</td>
            <td class="align-middle">${data.price}€</td>
            <td class="align-middle">
                <div class="input-group quantity mx-auto" style="width: 100px;">
                    <div class="input-group-btn">
                        <!--
                        <button class="btn btn-sm btn-primary btn-minus" >
                        <i class="fa fa-minus"></i>
                        </button>
                        -->
                    </div>
                    <input type="text" class="form-control form-control-sm bg-secondary text-center" value="${product_quantity}">
                    <div class="input-group-btn">
                        <!--
                        <button class="btn btn-sm btn-primary btn-plus">
                            <i class="fa fa-plus"></i>
                        </button>
                        -->
                    </div>
                </div>
            </td>
            <td class="align-middle">${product_quantity * data.price}€</td>
            <td class="align-middle">
            <button class="btn btn-sm btn-primary" onclick="(() => removeCart('${product_name}'))()">
            <i class="fa fa-times"></i>
            </button>
            </td>
        `;
        productContainer.appendChild(productCard);
        subtotal += product_quantity * data.price;
    }
    //console.log(subtotal);
    // <h6 class='font-weight-medium' id = >
    let total = subtotal + 10;
    $("#subtotal").replaceWith('<h6 class="font-weight-medium" id = "subtotal">' + subtotal + '€</h6>')
    $("#total").replaceWith('<h5 class="font-weight-bold" id = "total" >' + total + '€</h5>')
}

fetchData().catch((error) => console.error(error));


function removeCart(productName) {

    var username = document.cookie.split('; ').find(row => row.startsWith('username=')).split('=')[1];

    //console.log(localStorage.getItem(username));

    var cart = JSON.parse(localStorage.getItem("cart_" + username));

    // remove productName entry from cart

    cart = cart.filter(item => item.product !== productName);

    // Save the updated cart back to the local storage

    localStorage.setItem("cart_" + username, JSON.stringify(cart));

    // refresh page

    location.reload();


}