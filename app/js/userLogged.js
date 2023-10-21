function userLogged() {


    if (checkCookie("username")) {
        var username = document.cookie.split('; ').find(row => row.startsWith('username=')).split('=')[1];
    }
    else{
        return;
    }

    if (username == "admin"){
        $("#logintext").html( "Admin Panel" );
        $("#logintext").attr("href", "admin.html");
    }
    else{
    $("#logintext").replaceWith('<a href="user_detail.html" class="nav-item nav-link"> ' + username + '</a>');
}
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


function checkCookie(name) {
    if (document.cookie == "") {
        return false;
    }
    var cookieArr = document.cookie.split(";");
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        if(name == cookiePair[0].trim()) {
            return true;
        }
    }
    console.log("huh??")
    return false;
}
