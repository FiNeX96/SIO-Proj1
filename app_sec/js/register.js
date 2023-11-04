function doRegister() {
    const username = $("#username").val();
    const password = $("#password").val();

    if (username.length < 6){
      alert("Username must be at least 6 characters long")
      $("#username").val("");
      $("#password").val("");
      return;
    }

    // check if password is atleast 8 characters long, contains a upper case letter and a specialChar

    if (password.length < 10 || password.search(/[A-Z]/) < 0 || password.search(/[0-9]/) < 0 || password.search(/[!@#$%^&*]/) < 0){

      alert("Password must be at least 11 characters long, contain a uppercase letter and a special character")
      $("#username").val("");
      $("#password").val("");
      return;
    }

    const data = {
      username,
      password,
    };

    const url = "http://localhost:5000/register";

    const xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));

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