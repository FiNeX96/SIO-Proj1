var token = localStorage.getItem('access_token');
var decoded_token = parseJWT(token);
var username = decoded_token.sub;
var user_div = document.getElementById("user");
user_div.innerHTML = "User: " + username;

function toggleElements() {
    var atualPassword = document.getElementById("atual_password");
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

    if (atualPassword.style.display === "block") {
        atualPassword.style.display = "none";
    } else {
        atualPassword.style.display = "block";
    }

    if (enterButton.style.display === "block") {
        enterButton.style.display = "none";
    } else {
        enterButton.style.display = "block";
    }
}

function toggleElements2() {
    var atualPassword = document.getElementById("atual_password2");
    var enterButton = document.getElementById("enter2");

    if (atualPassword.style.display === "block") {
        atualPassword.style.display = "none";
    } else {
        atualPassword.style.display = "block";
    }
    if (enterButton.style.display === "block") {
        enterButton.style.display = "none";
    } else {
        enterButton.style.display = "block";
    }
}

function resetPassword() {
    // Generate a random password
    var atualPassword = document.getElementById("atual_password2");
    var enterButton = document.getElementById("enter2");
    atualPassword.style.display = "none";
    enterButton.style.display = "none";



    var randomPassword = generateRandomPassword();
    var token = localStorage.getItem('access_token');
    if (!token) {
        return;
    }

    var decoded_token = parseJWT(token);
    var username = decoded_token.sub;
    var data = {
        password: atualPassword,
        username: username,
        newPassword: randomPassword
    };

    console.log("data =", JSON.stringify(data));
    var xhr = new XMLHttpRequest();
    var url = "http://localhost:5000/resetPassword";
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
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
    var atualPassword = document.getElementById("atual_password").value.trim();
    if (newPassword == "" || confirmPassword == "" || atualPassword == "") {
        alert("Fill all the fields to change password")
    }
    else if (newPassword == atualPassword) {
        alert("cant change to same password");
    }
    else if (newPassword != confirmPassword) {
        alert("Passwords do not match. Please try again.")
    }
    else {
        // Passwords match; proceed to update password
        var token = localStorage.getItem('access_token');
        if (!token) {
            return;
        }

        var decoded_token = parseJWT(token);
        var username = decoded_token.sub;

        var data = {
            atualPassword: atualPassword,
            username: username,
            newPassword: newPassword // Assuming "newPassword" is the field for the new password
        };

        var xhr = new XMLHttpRequest();
        var url = "http://localhost:5000/updatePassword"; // Replace with your server endpoint

        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'));

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    alert("Password Updated! Logging out in 5 seconds");
                    var atualPassword = document.getElementById("atual_password");
                    var newPasswordInputs = document.getElementById("new_password");
                    var newPasswordConfirmInputs = document.getElementById("new_password_confirm");
                    var enterButton = document.getElementById("enter");

                    enterButton.style.display = "none";
                    newPasswordInputs.style.display = "none";
                    newPasswordConfirmInputs.style.display = "none";
                    atualPassword.style.display = "none";
                    var resetText = document.getElementById("resetText").style.display = "block";
                    var resetButton = document.getElementById("reset").style.display = "block";
                } else {
                    var errorResponse = JSON.parse(xhr.responseText);
                    alert(errorResponse.error);
                }
            }
        };

        xhr.send(JSON.stringify(data));
        setTimeout(function () {
            window.location.href = "index.html";
            localStorage.removeItem('access_token');
        }, 5000);
    } 
}


fetch("http://localhost:5000/get_orders/" + username, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("access_token"),
    }
})
    .then((response) => response.json())
    .then((data) => {
        console.log(data.length);
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



                const tdCountry = document.createElement("td");
                tdCountry.textContent = order.country;
                row.appendChild(tdCountry);

                const tdCity = document.createElement("td");
                tdCity.textContent = order.city;
                row.appendChild(tdCity);



                const tdProductsInfo = document.createElement("td");
                const viewDetailsButton = document.createElement("button");
                viewDetailsButton.textContent = "View Details";
                viewDetailsButton.addEventListener("click", () => {
                    openModal(order.products_info); // Pass the order data to the openModal function
                });
                tdProductsInfo.appendChild(viewDetailsButton);
                row.appendChild(tdProductsInfo);

                const tdTotalPrice = document.createElement("td");
                tdTotalPrice.textContent = order.total_price + "€";
                row.appendChild(tdTotalPrice);

                const paymentMethod = document.createElement("td");
                paymentMethod.textContent = order.payment_type ;
                row.appendChild(paymentMethod);

                tableBody.appendChild(row);
            });
        } else {
            document.getElementById("viewOrder").style.display = "none";
            document.getElementById("orders").textContent = "No orders to display.";
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


// <script> , onclick , onchange ,
// <button onclick="funçao()"> </button>


// button id = "button"
// button.addEventListener("click", function() {