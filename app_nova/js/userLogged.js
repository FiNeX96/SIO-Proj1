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

}
window.addEventListener("load", userLogged);
