// load product details/reviews on product page

function loadDetails() {
    var url = window.location.search;
    var id = url.split('=')[1];

    var reviews = JSON.parse(localStorage.getItem("reviews_" + id));

    if (reviews == null) {
        return;
    }

    var reviewContainer = document.getElementById("reviewDiv");

    var review_count = reviews.length;

    // add this to the reviewcontainer
    $(reviewContainer).empty();

    for (var i = 0; i < reviews.length; i++) {
        var review = reviews[i]
        //review = review.replace(/(?:\r\n|\r|\n)/g, '<br>');
        var reviewCard = document.createElement('div');

        var h5 = document.createElement('h5');
        h5.textContent = review.user + ' - ' + review.date ;
        reviewCard.appendChild(h5);

        var p = document.createElement('p');
        p.textContent = review.review;
        reviewCard.appendChild(p);

        $(reviewContainer).append(reviewCard);
    }

    $("#product_name").replaceWith('<h3 class="mb-4" id = "product_name" >' + review_count + ' reviews for ' + id + '</h3>')

}

function postReview() {
    // Get the value of the textarea
    var review = document.getElementById("message").value;
    var url = window.location.search;
    var produto = url.split('=')[1];

    var token = localStorage.getItem('access_token');
    if (!token) {
        alert("You must be logged in to post a review!");
        return;
    }

    var decoded_token = parseJWT(token);
    var username = decoded_token.sub;

    let dateObj = new Date();
    let day = dateObj.getDate();
    let month = dateObj.getMonth() + 1; // getMonth() returns month from 0 to 11
    let year = dateObj.getFullYear();

    let date = day + "-" + month + "-" + year;

    // Retrieve existing reviews from localStorage
    var storedReviews = localStorage.getItem("reviews_" + produto);
    var reviews = [];

    if (storedReviews) {
        // If there are existing reviews, parse them into an array
        reviews = JSON.parse(storedReviews);
    }

    var user = {
        "review": review,
        "user": username,
        "date": date
    };

    // Push the new review into the array of reviews
    reviews.push(user);

    // Store the updated array of reviews in localStorage
    localStorage.setItem("reviews_" + produto, JSON.stringify(reviews));

    // Reload the page
    location.href = location.href;

}
