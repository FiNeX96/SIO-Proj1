function logout() {
    // erase cookie

    console.log("logout");
    // delete this cookie
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setTimeout(function () {
        window.location.href = "index.html";
    }, 1000);

}