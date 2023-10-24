function doRegister() {
    event.preventDefault();
    const username = $("#username").val();
    const password = $("#password").val();

    const data = {
      username,
      password,
    };

    const url = "http://localhost:5000/register";

    const xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("token"));

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          $("#register-success").html(
            "Successfully registered . Make sure to login now"
          );
          
            setTimeout(function () {
                window.location.href = "index.html";
            }, 2000);
            
        } else {
          $("#register-success").html("Error trying to register");
        }
      }
    };
    xhr.send(JSON.stringify(data));

    // clear the password and username fields
    $("#username").val("");
    $("#password").val("");
  }