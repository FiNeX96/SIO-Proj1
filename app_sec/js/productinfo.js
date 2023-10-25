function getProductFromURL() {
    // Get the current URL
    var url = window.location.search;

    // Use URLSearchParams to parse the query parameters
    var urlParams = new URLSearchParams(url);

    // Get the value of the "product" parameter
    var product = urlParams.get("product");

    // Display the product value in the console (you can use it as needed)
    console.log("Product: " + product);
    getProduct(product);
  }

  function getProduct(product_name) {
    var url = "http://localhost:5000/get_product/" + product_name;
    var xhttp = new XMLHttpRequest();
    //document.getElementById("nome_produto").innerHTML = product_name;
    $("#nome_produto").textContent = product_name;

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var produto = JSON.parse(this.responseText);
        //console.log(produto.imglink)
        document.getElementById("price_produto").textContent =
          produto.price + "€";
        document.getElementById("descrição_produto").textContent =
          produto.description;
        document.getElementById("imagem_produto").src =
          "img/" + produto.imglink;
      }
    };
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader(
      "Authorization",
      "Bearer " + + localStorage.getItem("access_token")
    );
    xhttp.send();
  }

  // Call the function when the page loads
  window.addEventListener("load", getProductFromURL);