function set_mod(username) {
    var users = document.getElementById("user-column").getElementsByClassName("user-list-child");
    for (var i = 0; i < users.length; i++) {
        var user_span = users[i].getElementsByClassName("user-list-name")[0];
        if (username == user_span.innerHTML) {
            user_span.innerHTML = '@' + user_span.innerHTML;
        }
    }
}

function remove_mod(username) {
    var users = document.getElementById("user-column").getElementsByClassName("user-list-child");
    for (var i = 0; i < users.length; i++) {
        var user_span = users[i].getElementsByClassName("user-list-name")[0];
        console.log(user_span.innerHTML.substr(1, user_span.innerHTML.length - 1));
        if (username == user_span.innerHTML.substr(1, user_span.innerHTML.length - 1)) {
            user_span.innerHTML = user_span.innerHTML.substr(1, user_span.innerHTML.length - 1);
        }
    }
}