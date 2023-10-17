    function updateSuggestions() {
        const inputSearch = document.getElementById("input_search").value;
        const suggestions = document.getElementById("suggestions");
        suggestions.style.display = "block";
        if( inputSearch != "" ){
        

        console.log(inputSearch);
        fetch("http://localhost:5000/get_products")
            .then((response) => response.json())
            .then((data) => {
                
                suggestions.innerHTML = ""; // Clear previous suggestions

                const filteredProducts = data.filter((product) =>
                    product.name.toLowerCase().includes(inputSearch.toLowerCase())
                );

                filteredProducts.forEach((product) => {
                    console.log(product);

                    const suggestionItem = document.createElement("div");
                    suggestionItem.className = "suggestion-item";
                    suggestionItem.textContent = product.name;

                    suggestionItem.addEventListener("click", () => {
                        document.getElementById("input_search").value = product.name;
                        // const newUrl = `search.html?product=${product.name}`;
                        // window.location.href = newUrl; // Redirect to the new page
                        suggestions.style.display = "none";
                    });

                    suggestions.appendChild(suggestionItem);
                });
            })
            .catch((error) => {
                console.error("Error fetching product data:", error);
            });
        }
            
    }

