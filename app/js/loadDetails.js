// load product details/reviews on product page

function loadDetails() {
    var url = window.location.search;
    var id = url.split('=')[1];
    console.log("URL" , id);

    var reviews = JSON.parse(localStorage.getItem("reviews_" + id));

    if (reviews == null) {
        return;
    }


    console.log(reviews);

    var reviewContainer = document.getElementById("reviewDiv");

    var review_count = reviews.length;

    // add this to the reviewcontainer
    $(reviewContainer).empty();

    for (var i = 0; i < reviews.length; i++) {
        var review = reviews[i]
        //review = review.replace(/(?:\r\n|\r|\n)/g, '<br>');
        var reviewCard = `
            <div>
                <h5>
                    ${review.user}<small> - <i>${review.date}</i></small>
                </h5>
                <p >
                    ${review.review}
                </p>
            </div>
        `;
        $(reviewContainer).append(reviewCard);
    }
    $("#product_name").replaceWith('<h3 class="mb-4" id = "product_name" >' + review_count + ' reviews for ' + id + '</h3>')

}




function postReview() {
    // Get the value of the textarea
    var review = document.getElementById("message").value;
    var url = window.location.search;
    console.log("URL = " ,url)
    var produto = url.split('=')[1];

    // Get the value of the cookie
    try{
        var username = document.cookie.split('; ').find(row => row.startsWith('username=')).split('=')[1];
    }
    catch (e){
        alert("You must be logged in to post a review!");
        return;
    }



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

    // Save the current scroll position
    var scrollPosition = window.scrollY;

    // Reload the page
    location.reload();
    var tab = document.getElementById("tabs");
    tab.href = "#tab-pane-3";

    // After the page has been reloaded, restore the scroll position
    window.scrollTo(0, scrollPosition);
}
