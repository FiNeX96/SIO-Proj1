function logout() {
    // erase JWT token
    var token = localStorage.getItem('access_token');
    if (!token) {
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/logout', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            localStorage.removeItem('access_token');
            console.log("logout");
            setTimeout(function () {
                window.location.href = "index.html";
            }, 1000);
        }
    };
    xhr.send();
}
