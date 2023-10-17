function userLogged() {

    var cookie = document.cookie;

    if (cookie == "") {
        return;
    }
    //console.log(cookie)
    // get "username " from the cookie
    var username = cookie.split("=")[1];

    $("#logintext").replaceWith('<a href="user_detail.html" class="nav-item nav-link"> '+username+'</a>');
    $("#registertext").replaceWith('<a href="#" class="nav-item nav-link" onclick="logout()" >Logout</a>');

    // get cart for this user

    var cart = JSON.parse(localStorage.getItem("cart_" + username));
    if (!(cart == null || cart.length == 0 || cart == []) ){
        $("#cartIcon").replaceWith('<span class="badge" id="cartIcon">'+cart.length+'</span>');
    }



}
window.addEventListener("load", userLogged);
