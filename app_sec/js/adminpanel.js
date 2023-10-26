const tableBody = document.querySelector("#viewDetails tbody");
const notfoundElement = document.getElementById("notfound");

function createAccordion(order) {
    const row = tableBody.insertRow();

    const orderIDCell = row.insertCell();
    orderIDCell.textContent = order.ORDER_id;

    const usernameCell = row.insertCell();
    usernameCell.textContent = order.username;

    const detailsCell = row.insertCell();
    detailsCell.className = "accordion-container";

    const viewDetailsButton = document.createElement("button");
    viewDetailsButton.textContent = "View Details";
    viewDetailsButton.className = "btn btn-primary";

    const updateButton = document.createElement("button");
    updateButton.textContent = "Update";
    updateButton.className = "btn btn-primary mx-2";

    let updateForm = createUpdateForm(order);
    let detailsContent = createDetailsContent(order);

    viewDetailsButton.addEventListener("click", () => {
        updateForm.style.display = "none";
        detailsContent.style.display = "block";
    });

    updateButton.addEventListener("click", () => {
        updateForm.style.display = "block";
        detailsContent.style.display = "none";
    });

    detailsCell.appendChild(viewDetailsButton);
    detailsCell.appendChild(updateButton);
    detailsCell.appendChild(updateForm);
    detailsCell.appendChild(detailsContent);
}

const productCardsContainer = document.getElementById("productCards");

fetch("http://localhost:5000/get_products", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("access_token"),
    }
})
    .then((response) => response.json())
    .then((data) => {
        if (data.length === 0) {
            // Handle case when no products are available
            productCardsContainer.textContent = "<p>No products available.</p>";
        } else {
            // Clear any existing content in the product cards container
            productCardsContainer.textContent = "";

            data.forEach((product) => {
                createProductCard(product);
            });
        }
    })
    .catch((error) => {
        console.error("Error fetching product data:", error);
        productCardsContainer.innerHTML = "<p>Error loading products.</p>";
    });

function createProductCard(product) {
    const card = document.createElement("div");
    card.classList.add("col-12", "col-md-6", "col-lg-4");

    card.innerHTML = `
        <div class="card mb-4">
            <img src="img/${product.imglink}" class="card-img-top" style="max-width: 200px; max-height: 200px;" alt="${product.name}">
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text price">Price: $${product.price}</p>
                <p class="card-text">${product.description}</p>
                <p class="card-text stock" id="stock-${product.name}">Stock: ${product.stock} units</p>
                <button class="btn btn-primary change-stock-button" data-product="${product.name}">Change Stock</button>
                <button class="btn btn-primary change-price-button" data-product="${product.name}">Change Price</button>
            </div>
        </div>
    `;

    const changeStockButton = card.querySelector(".change-stock-button");

    changeStockButton.addEventListener("click", function () {
        const productName = changeStockButton.getAttribute("data-product");
        changeStock(productName);
    });

    const changePriceButton = card.querySelector(".change-price-button");

    changePriceButton.addEventListener("click", function () {
        const productName = changeStockButton.getAttribute("data-product");
        changePrice(productName);
    });

    productCardsContainer.appendChild(card);
}

function changeStock(productName) {
    const stockElement = document.getElementById(`stock-${productName}`);
    const newStockValue = prompt(`Enter new stock value for ${productName}:`);

    if (newStockValue === null) {
        return; // User canceled the input
    }

    const parsedStockValue = parseInt(newStockValue);

    if (isNaN(parsedStockValue) || parsedStockValue < 0) {
        alert("Please enter a valid stock value.");
        return;
    }

    // Send an API request to update the stock value
    fetch(`http://localhost:5000/update_stock/${productName}`, {
    method: 'PUT',
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("access_token"),
    },
    body: JSON.stringify({ newStock: parsedStockValue }),
})
        .then(response => {
            if (response.ok) {
                stockElement.textContent = `Stock: ${parsedStockValue} units`;
                location.reload();
            } else {
                alert('Failed to update stock. Please try again.');
            }
        })
        .catch(error => {
            alert('An error occurred. Please try again.');
        });
}



function changePrice(productName) {
    const priceElement = document.getElementById(`price-${productName}`);
    const newPriceValue = prompt(`Enter new stock value for ${productName}:`);

    if (newPriceValue === null) {
        return; // User canceled the input
    }

    const parsedPriceValue = parseInt(newPriceValue);

    if (isNaN(parsedPriceValue) || parsedPriceValue < 0) {
        alert("Please enter a valid price value.");
        return;
    }

    // Send an API request to update the stock value
    fetch(`http://localhost:5000/update_price/${productName}`, {
    method: 'PUT',
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("access_token"),
    },
    body: JSON.stringify({ newPrice: parsedPriceValue }),
})
        .then(response => {
            if (response.ok) {
                location.reload();
            } else {
                alert('Failed to update stock. Please try again.');
            }
        })
        .catch(error => {
            alert('An error occurred. Please try again.');
        });
}


function createUpdateForm(order) {
    const updateForm = document.createElement("form");
    updateForm.className = "update-form";
    updateForm.style.display = "none"; // Initially hide the update form
    console.log(order)
    updateForm.innerHTML = `
    
        <input type="text" name="firstname" value="${order.firstname}" placeholder="First Name">
        <input type="text" name="lastname" value="${order.lastname}" placeholder="Last Name">
        <input type="email" name="email" value="${order.email}" placeholder="Email">
        <input type="tel" name="phonenumber" value="${order.phonenumber}" placeholder="Phone Number">
        <input type="text" name="ship_address" value="${order.ship_address}" placeholder="Shipping Address">
        <input type="text" name="country" value="${order.country}" placeholder="Country">
        <input type="text" name="city" value="${order.city}" placeholder="City">
        <input type="text" name="zip_code" value="${order.zip_code}" placeholder="Zip Code">
        <textarea name="products_info" placeholder="Products Info">${order.products_info}</textarea>
        <button type="submit">Update</button>
    `;

    // Add a submit event handler for the update form
    updateForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const updatedData = {
            order_id: order.ORDER_id,
            firstname: updateForm.elements.firstname.value,
            lastname: updateForm.elements.lastname.value,
            email: updateForm.elements.email.value,
            phonenumber: updateForm.elements.phonenumber.value,
            ship_address: updateForm.elements.ship_address.value,
            country: updateForm.elements.country.value,
            city: updateForm.elements.city.value,
            zip_code: updateForm.elements.zip_code.value,
            products_info: updateForm.elements.products_info.value,
        };
        
        fetch("http://localhost/change_order", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("access_token"),
            }
        })
.then((response) => {
    if (response.ok) {
        // Handle success
    } else {
        // Handle errors
    }
})
.catch((error) => {
    // Handle network errors
});
    });

    return updateForm;
}

function createDetailsContent(order) {
    const detailsContent = document.createElement("div");
    detailsContent.className = "accordion-content";

    detailsContent.innerHTML = `
        <div class="order-details">
            <p><strong>Order ID:</strong> ${order.ORDER_id}</p>
            <p><strong>Username:</strong> ${order.username}</p>
            <p><strong>First Name:</strong> ${order.firstname}</p>
            <p><strong>Last Name:</strong> ${order.lastname}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Phone Number:</strong> ${order.phonenumber}</p>
            <p><strong>Shipping Address:</strong> ${order.ship_address}</p>
            <p><strong>Country:</strong> ${order.country}</p>
            <p><strong>City:</strong> ${order.city}</p>
            <p><strong>Zip Code:</strong> ${order.zip_code}</p>
            <p><strong>Products Info:</strong> ${order.products_info}</p>
        </div>
    `;

    detailsContent.style.display = "block"; // Initially show the details content
    detailsContent.style.backgroundColor = "#f0f0f0";
    detailsContent.style.border = "1px solid #ddd";
    detailsContent.style.padding = "10px";
    detailsContent.style.marginTop = "10px";

    const orderDetails = detailsContent.querySelector(".order-details");
    orderDetails.style.fontFamily = "Arial, sans-serif";
    orderDetails.style.fontSize = "16px";
    orderDetails.style.color = "#333";

    return detailsContent;
}

fetch("http://localhost:5000/get_all_orders",{
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("access_token"),
    }
})
    .then((response) => response.json())
    .then((data) => {
        console.log(data);

        if (data.length === 0) {
            notfoundElement.style.display = "block";
        } else {
            notfoundElement.style.display = "none";

            data.forEach((order) => {
                createAccordion(order);
            });
        }
    })
    .catch((error) => {
        console.error("Error fetching order data:", error);
        notfoundElement.style.display = "block";
    }); 
