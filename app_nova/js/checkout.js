async function checkoutData() {
    var username = document.cookie.split('; ').find(row => row.startsWith('username=')).split('=')[1];
    var cart = JSON.parse(localStorage.getItem("cart_" + username));

    var subtotal = 0;
    for (let cart_item in cart) {
        let product_name = cart[cart_item].product;
        let product_quantity = cart[cart_item].quantity;
        let response = await fetch("http://localhost:5000/getinfo/" + product_name);
        let data = await response.json();
        let product_price = data.price;
        subtotal += product_price * product_quantity;
        var productcard = document.getElementById("products");
        var div = document.createElement("div");
        div.innerHTML = `
            <div class="d-flex justify-content-between">
            <p>${product_name} x ${product_quantity}</p>
            <p>${(product_price * product_quantity).toFixed(2)}€</p>
            </div>
        `;
        productcard.appendChild(div);

    }
    $("#subtotal").html(subtotal.toFixed(2) + "€");
    $("#shipping").html("10€");
    $("#total").html((subtotal + 10).toFixed(2) + "€");

}

function checkout()
{
    
    const popup = document.createElement("div");
    popup.id = "popup";
    popup.style.position = "fixed";
    popup.style.left = "50%";
    popup.style.top = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.zIndex = "1";
    popup.style.backgroundColor = "white";
    popup.style.padding = "20px";
    popup.style.borderRadius = "5px";
    popup.style.border = "1px solid black";
    popup.style.display = 'block';

    var firstname = document.getElementById("firstname").value;
    var lastname = document.getElementById("lastname").value;
    var email = document.getElementById("email").value;
    var phonenumber = document.getElementById("phonenumber").value;
    var shippingaddress = document.getElementById("shippingaddress").value;
    var country = document.getElementById("country").value;
    var city = document.getElementById("city").value;
    var zipcode = document.getElementById("zipcode").value;


        // Validation for First Name and Last Name - Ensure they are not empty
        if (!firstname.trim() || !lastname.trim()) {
            popup.innerText = "First Name and Last Name are required.";
            document.body.appendChild(popup);
            return;
        }
    
        // Validation for Email - Ensure it's a valid email address
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!email.match(emailPattern)) {
            popup.innerText = "Input a valid email!";
            document.body.appendChild(popup);
            return;
        }
    
        // Validation for Phone Number - You can add more specific phone number validation if needed
        if (!phonenumber.trim()) {
            popup.innerText = "Put a valid phone number!";
            document.body.appendChild(popup);
            return;
        }
    
        // Validation for Shipping Address - Ensure it's not empty
        if (!shippingaddress.trim()) {
            popup.innerText = "Shipping address is required";
            document.body.appendChild(popup);
            return;
        }
    
        // Validation for City - Ensure it's not empty
        if (!city.trim()) {
            popup.innerText = "Put a valid city!";
            document.body.appendChild(popup);
            return;
        }
    
        // Validation for ZIP Code - You can add more specific ZIP code validation if needed
        if (!zipcode.trim()) {
            popup.innerText = "Put a valid zip code!";
            document.body.appendChild(popup);
            return;
        }


    var username = document.cookie.split('; ').find(row => row.startsWith('username=')).split('=')[1];
    var cart = JSON.parse(localStorage.getItem("cart_" + username));
    var total = document.getElementById("total").innerHTML.split("€")[0];

    var data = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        phonenumber: phonenumber,
        shippingaddress: shippingaddress,
        country: country,
        city: city,
        zipcode: zipcode,
        cart: cart,
        total: total,
        username: username
    };

    xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/checkout", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
                // create a popup saying sucess checkout
                popup.innerText = "Checkout successful!";
                document.body.appendChild(popup);
        }
    };


}

