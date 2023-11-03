function doLogin() {
    const username = $("#username").val();
    const password = $("#password").val();

    const data = {
      username,
      password,
    };
    //console.log(username)

    const url = "http://localhost:5000/login";

    const xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          $("#login-success").html("Successfully logged in");
          let expiryDate = new Date();
          expiryDate.setTime(
            expiryDate.getTime() + 30 * 24 * 60 * 60 * 1000
          ); // sets the cookie to expire after 30 days
          document.cookie =
            "username=" +
            encodeURIComponent(username) +
            "; expires=" +
            expiryDate.toUTCString() +
            "; path=/";

          setTimeout(function () {
            if (username === "admin"){
              window.location.href = "admin.html";
            }
            else{
            window.location.href = "index.html";
            }
          }, 2000);
        } else {
          $("#login-success").html("Wrong username or password. Try again");
        }
      }
    };
    xhr.send(JSON.stringify(data));

    // clear the password and username fields
    $("#username").val("");
    $("#password").val("");

    // setup login cookie

    //console.log("Cookie = " + document.cookie);
  }