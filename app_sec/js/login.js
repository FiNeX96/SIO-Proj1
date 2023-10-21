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
        const response = JSON.parse(xhr.responseText);
        localStorage.setItem('access_token', response.access_token);

        setTimeout(function () {
          if (username === "admin") {
            window.location.href = "admin.html";
          }
          else {
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