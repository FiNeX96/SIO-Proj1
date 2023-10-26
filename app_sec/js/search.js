const urlParams = new URLSearchParams(window.location.search);
const productName = urlParams.get("product");
console.log(productName);
document.getElementById("product_name").textContent = productName;

fetch("http://localhost:5000/search/" + productName,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " +  localStorage.getItem("access_token"),
    }
  }
)
  .then((response) => {
    if (response.status !== 200) {
      document.getElementById("viewDetails").style.display = "none";
      document.getElementById("notfound").style.display = "block";
      return;
    }
    else {
      document.getElementById("notfound").style.display = "none";
    }
    return response.json();
  })
  .then((data) => {
    data.forEach((element) => {
      var table_body = document.getElementById("search_table");
      var table_row = document.createElement("tr");
      var td = document.createElement("td");
      td.textContent = element.name;
      var td2 = document.createElement("td");
      td2.textContent = element.price+"€";
      var td3 = document.createElement("td");
      var button = document.createElement("button");
      button.className = "btn btn-primary";
      button.id = "viewDetailsButton_" + element.name;
      button.textContent = "View Details";

      button.addEventListener("click", function () {
        const productName = button.id.replace("viewDetailsButton_", "");
        //console.log(productName);
        window.location.href = "detail.html?product=" + productName;
      });

      td3.appendChild(button);
      table_row.appendChild(td);
      table_row.appendChild(td2);
      table_row.appendChild(td3);
      table_body.appendChild(table_row);
    });
  });