let info;
              fetch("http://localhost:5000/get_products")
                .then((response) => response.json())
                .then((data) => {
                  const productContainer =
                    document.querySelector(".product-container");
                  info = data;
                  data.forEach((product) => {
                    const productCard = document.createElement("div");
                    productCard.className = "col-lg-4 col-md-6 col-sm-12 pb-1";

                    // Check if the product is out of stock
                    const isOutOfStock = product.stock === 0;

                    // Define the CSS classes for out of stock and in stock products
                    const productCardClass = isOutOfStock
                      ? "card product-item border-0 mb-4 out-of-stock"
                      : "card product-item border-0 mb-4";

                    productCard.innerHTML = `
                          <div class="${productCardClass}" id="${product.name}">
                              <div class="card-header product-img position-relative bg-transparent border p-0">
                                  <img class="img-fluid w-100" src="img/${
                                    product.imglink
                                  }" alt="${product.name}" />
                              </div>
                              <div class="card-body border-left border-right text-center p-0 pt-4 pb-3">
                                  <h6 class="text-truncate mb-3">${
                                    product.name
                                  }</h6>
                                  <div class="d-flex justify-content-center">
                                      <h6>Price: ${product.price.toFixed(
                                        2
                                      )}€</h6>
                                  </div>
                              </div>
                              <div class="card-footer d-flex justify-content-between bg-light border">
                                  <a href="detail.html?product=${
                                    product.name
                                  }" class="btn btn-sm text-dark p-0"><i class="fas fa-eye text-primary mr-1"></i>View Detail</a>
                                  ${
                                    isOutOfStock
                                      ? '<button class="btn btn-sm text-dark p-0 addToCartBtn" data-product="${product.name}" disabled>Out of Stock</button>'
                                      : `<button class="btn btn-sm text-dark p-0 addToCartBtn" data-product="${product.name}" onclick = "incrementCart()">Add To Cart</button>`
                                  }
                              </div>
                          </div>
                      `;
                    productContainer.appendChild(productCard);
                  });

                  const addToCartButtons =
                    document.querySelectorAll(".addToCartBtn");
                  addToCartButtons.forEach((button) => {
                    button.addEventListener("click", (event) => {
                      const productName =
                        event.target.getAttribute("data-product");
                        if(showPopup(productName)!= null){
                          addToCart(productName);
                        }

                    });
                  });
                })
                .catch((error) => console.error(error));

              function show_prod() {
                const filtername =
                  document.getElementById("filter_byname").value;
                console.log(filtername);

                console.log(info);

                if (filtername == "") {
                  info.forEach((element) => {
                    document.getElementById(element.name).style.display =
                      "block";
                  });
                }

                info.forEach((element) => {
                  if (!element.name.startsWith(filtername)) {
                    document.getElementById(element.name).style.display =
                      "none";
                  } else {
                    document.getElementById(element.name).style.display =
                      "block";
                  }
                });
              }

              function filter_price(filter) {
                console.log(filter);
                const price_all = document.getElementById("price-0");

                for (let index = 0; index < 6; index++) {
                  if (filter == "price-" + index) {
                    const price = document.getElementById("price-" + index);
                    price.checked = true;
                  } else {
                    const price = document.getElementById("price-" + index);
                    price.checked = false;
                  }
                }

                if (price_all.checked) {
                  info.forEach((element) => {
                    document.getElementById(element.name).style.display =
                      "block";
                  });
                }

                const price10 = document.getElementById("price-1");
                console.log(price10.checked);
                if (price10.checked) {
                  info.forEach((element) => {
                    if (element.price <= 10) {
                      document.getElementById(element.name).style.display =
                        "block";
                    } else {
                      document.getElementById(element.name).style.display =
                        "none";
                    }
                  });
                }

                const price20 = document.getElementById("price-2");
                console.log(price20.checked);
                if (price20.checked) {
                  info.forEach((element) => {
                    console.log(element.price);
                    if (element.price >= 10 && element.price <= 20) {
                      console.log(element.price + " -- ");
                      document.getElementById(element.name).style.display =
                        "block";
                    } else {
                      console.log(element.price + " xx");
                      document.getElementById(element.name).style.display =
                        "none";
                    }
                  });
                }

                const price30 = document.getElementById("price-3");
                console.log(price30.checked);
                if (price30.checked) {
                  info.forEach((element) => {
                    if (20 <= element.price && element.price <= 30) {
                      document.getElementById(element.name).style.display =
                        "block";
                    } else {
                      document.getElementById(element.name).style.display =
                        "none";
                    }
                  });
                }

                const price40 = document.getElementById("price-4");
                console.log(price40.checked);
                if (price40.checked) {
                  info.forEach((element) => {
                    if (30 <= element.price && element.price <= 40) {
                      document.getElementById(element.name).style.display =
                        "block";
                    } else {
                      document.getElementById(element.name).style.display =
                        "none";
                    }
                  });
                }
                const price50 = document.getElementById("price-5");
                console.log(price50.checked);
                if (price50.checked) {
                  info.forEach((element) => {
                    if (40 <= element.price && element.price <= 50) {
                      document.getElementById(element.name).style.display =
                        "block";
                    } else {
                      document.getElementById(element.name).style.display =
                        "none";
                    }
                  });
                }
              }