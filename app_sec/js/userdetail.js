var username = document.cookie.split('; ').find(row => row.startsWith('username=')).split('=')[1];
      var user_div = document.getElementById("user");
      user_div.innerHTML = "User: " + username;
      function toggleElements(){
    var newPasswordInputs = document.getElementById("new_password");
    var newPasswordConfirmInputs = document.getElementById("new_password_confirm");
    var enterButton = document.getElementById("enter");
    var resetText = document.getElementById("resetText");
    var resetButton = document.getElementById("reset");

    if (newPasswordInputs.style.display === "block") {
        newPasswordInputs.style.display = "none";
    } else {
        newPasswordInputs.style.display = "block";
    }

    if (newPasswordConfirmInputs.style.display === "block") {
        newPasswordConfirmInputs.style.display = "none";
    } else {
        newPasswordConfirmInputs.style.display = "block";
    }

    if (enterButton.style.display === "block") {
        enterButton.style.display = "none";
    } else {
        enterButton.style.display = "block";
    }


}
       
      function resetPassword() {
          // Generate a random password
          var randomPassword = generateRandomPassword();
          var username = document.cookie.split('; ').find(row => row.startsWith('username=')).split('=')[1];
          var data = {
              username: username,
              newPassword: randomPassword // Assuming "newPassword" is the field for the new password
          };
          var xhr = new XMLHttpRequest();
          var url = "http://localhost:5000/resetPassword"; 
          xhr.open("PUT", url, true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        //alert("Password Updated!");
                        var newRandomPassword = document.getElementById("new_random");
                        newRandomPassword.innerHTML = "New Password: " + randomPassword + " . Logging out in 10 seconds";
                        newRandomPassword.style.display = "block";
                        setTimeout(function () {
                        window.location.href = "index.html";
                        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        }, 10000);
                    } else {
                        alert("Error updating password. Please try again.");
                    }
                }
          };
          xhr.send(JSON.stringify(data));
          var newRandomPassword = document.getElementById("new_random");
          newRandomPassword.innerHTML = "New Password: " + randomPassword;
          newRandomPassword.style.display = "block";
      }

      function generateRandomPassword() {
          // Define the characters that can be used in the random password
          var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
          var passwordLength = 10; // Adjust the length as needed

          var randomPassword = "";
          for (var i = 0; i < passwordLength; i++) {
              var randomIndex = Math.floor(Math.random() * characters.length);
              randomPassword += characters.charAt(randomIndex);
          }

          return randomPassword;
      }
      function sendNewPass() {
          var newPassword = document.getElementById("new_password").value.trim();
          var confirmPassword = document.getElementById("new_password_confirm").value.trim();

          if (newPassword !== "" && confirmPassword !== "" && newPassword === confirmPassword) {
              // Passwords match; proceed to update password
              var username = document.cookie.split('; ').find(row => row.startsWith('username=')).split('=')[1];
              
              var data = {
                  username: username,
                  newPassword: newPassword // Assuming "newPassword" is the field for the new password
              };

              var xhr = new XMLHttpRequest();
              var url = "http://localhost:5000/updatePassword"; // Replace with your server endpoint

              xhr.open("PUT", url, true);
              xhr.setRequestHeader("Content-Type", "application/json");

              xhr.onreadystatechange = function () {
                  if (xhr.readyState === 4) {
                      if (xhr.status === 200) {
                          alert("Password Updated!");
                          var newPasswordInputs = document.getElementById("new_password");
                          var newPasswordConfirmInputs = document.getElementById("new_password_confirm");
                          var enterButton = document.getElementById("enter");

                          enterButton.style.display = "none";
                          newPasswordInputs.style.display = "none";
                          newPasswordConfirmInputs.style.display = "none";
                          var resetText = document.getElementById("resetText").style.display = "block";
                          var resetButton = document.getElementById("reset").style.display = "block";
                      } else {
                          alert("Error updating password. Please try again.");
                      }
                  }
              };

              xhr.send(JSON.stringify(data));
          } else {
              if (newPassword === "") {
                  alert("New Password cannot be empty.");
              } else if (confirmPassword === "") {
                  alert("Confirm New Password cannot be empty.");
              } else {
                  alert("Passwords do not match. Please try again.");
              }
          }
      }

      fetch("http://localhost:5000/get_all_orders")
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.length > 0) {
              const tableBody = document.getElementById("table_body");

              data.forEach(order => {
                  const row = document.createElement("tr");

                  const tdFirstname = document.createElement("td");
                  tdFirstname.textContent = order.firstname;
                  
                  row.appendChild(tdFirstname);

                  const tdLastname = document.createElement("td");
                  tdLastname.textContent = order.lastname;
                  row.appendChild(tdLastname);

                  const tdEmail = document.createElement("td");
                  tdEmail.textContent = order.email;
                  row.appendChild(tdEmail);

                  const tdShipAddress = document.createElement("td");
                  tdShipAddress.textContent = order.ship_address;
                  row.appendChild(tdShipAddress);

                  const tdCountry = document.createElement("td");
                  tdCountry.textContent = order.country;
                  row.appendChild(tdCountry);

                  const tdCity = document.createElement("td");
                  tdCity.textContent = order.city;
                  row.appendChild(tdCity);

                  const tdZipCode = document.createElement("td");
                  tdZipCode.textContent = order.zip_code;
                  row.appendChild(tdZipCode);

                  const tdUsername = document.createElement("td");
                  tdUsername.textContent = username;
                  row.appendChild(tdUsername);

                  const tdProductsInfo = document.createElement("td");
                  const viewDetailsButton = document.createElement("button");
                  viewDetailsButton.textContent = "View Details";
                  viewDetailsButton.addEventListener("click", () => {
                      openModal(order.products_info); // Pass the order data to the openModal function
                  });
                  tdProductsInfo.appendChild(viewDetailsButton);
                  row.appendChild(tdProductsInfo);

                  const tdTotalPrice = document.createElement("td");
                  tdTotalPrice.textContent = order.total_price +"€";
                  row.appendChild(tdTotalPrice);

                  tableBody.appendChild(row);
              });
          } else {
              console.error("No data to display in the table.");
          }
        })
        .catch((error) => {
            console.error("Error fetching product data:", error);
        });


        function openModal(order) {
          const modal = document.getElementById("orderModal");
          const closeModalButton = document.getElementById("closeModal");
          const orderDetails = document.getElementById("orderDetails");

          // Populate the modal content with order details
          // You can format the order details as needed
          const productsInfo = JSON.parse(order);
          
          const productInfoHTML = productsInfo.map(product => {
              return `<p>Product: ${product.product}, Quantity: ${product.quantity}</p>`;
          }).join('');
          orderDetails.innerHTML = `
            ${productInfoHTML}
          `;

          modal.style.display = "block";

          // Close the modal when the close button is clicked
          closeModalButton.addEventListener("click", () => {
              modal.style.display = "none";
          });

          // Close the modal when clicking outside the modal content
          window.addEventListener("click", event => {
              if (event.target === modal) {
                  modal.style.display = "none";
              }
          });
      }

      // Close the modal when the user presses the Escape key
      document.addEventListener("keydown", event => {
          if (event.key === "Escape") {
              const modal = document.getElementById("orderModal");
              modal.style.display = "none";
          }
      });
        