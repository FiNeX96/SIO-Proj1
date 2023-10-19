function userLogged() {


    if (document.cookie == "") {
        return;
    }


    if (document.cookie != null && document.cookie != "") {
        var username = document.cookie.split('; ').find(row => row.startsWith('username=')).split('=')[1];
    }

    //console.log(cookie)
    // get "username " from the cookie


    $("#logintext").replaceWith('<a href="user_detail.html" class="nav-item nav-link"> ' + username + '</a>');
    $("#registertext").replaceWith('<a href="#" class="nav-item nav-link" onclick="logout()" >Logout</a>');

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
window.addEventListener("load", userLogged);
