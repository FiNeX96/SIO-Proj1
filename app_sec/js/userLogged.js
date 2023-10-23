function userLogged() {
    var token = localStorage.getItem('access_token');
    if (!token) {
        return;
    }

    var decoded_token = parseJWT(token);
    var current_time = Date.now().valueOf() / 1000;
  
    if (decoded_token.exp < current_time) { // token expired
        localStorage.removeItem('access_token');
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:5000/verify', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var username = response.logged_in_as;

            if (username.trim() == "admin"){
                $("#logintext").textContent = "Admin Panel" ;
                $("#logintext").attr("href", "admin.html");
            }
            else{
                $("#logintext").replaceWith('<a href="user_detail.html" id="logintext" class="nav-item nav-link"> ' + username + '</a>');
            }
            $("#registertext").replaceWith('<a href="#" id="registertext" class="nav-item nav-link" >Logout</a>');
            document.getElementById("registertext").addEventListener("click", logout);

            // get cart for this user
            var cart = JSON.parse(localStorage.getItem("cart_" + username));

            // get quantity for each product
            var quantity = 0;
            if (!(cart == null || cart.length == 0 || cart == [])) {
                for (var i = 0; i < cart.length; i++) {
                    quantity += cart[i].quantity;
                }
                $("#cartIcon").replaceWith('<span class="badge" id="cartIcon">' + quantity + '</span>');
            }
        }
    };
    xhr.send();
}
window.addEventListener("load", userLogged);




