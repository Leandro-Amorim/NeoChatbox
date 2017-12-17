function add_user(username, avatar, group_colour, status) {

  if (JsonOptions.playNewUserSound == true)
  {
    if (JsonOptions.newUserSoundLink != "" && (JsonOptions.newUserSoundLink.endsWith(".mp3") || JsonOptions.newUserSoundLink.endsWith(".ogg")))
    {
      var audio = new Audio(JsonOptions.newUserSoundLink);
      audio.play();
    }
  }

    console.log(username);
    console.log(avatar);
    console.log(group_colour);
    var user_column = document.getElementById("user-column");
    var rendered = parseTemplate("user-list-child", {
        _class: (status == 'aus') ? 'orange-text' : 'teal-text',
        _css_style: (group_colour == "") ? "color:black" : 'color:#' + group_colour
        , _avatar: avatar
        , _user: String(username)
    });
    console.log(rendered);
    $(rendered).appendTo(user_column);
}

function remove_user(username) {
    var els = document.getElementById("user-column").getElementsByClassName("user-list-child");
    for (var i = 0; i < els.length; i++) {
        if (els[i].getElementsByClassName("user-list-name")[0].innerHTML == username) {
            document.getElementById("user-column").removeChild(els[i]);
            break;
        }
    }
}

function user_exists(username) {
    var els = document.getElementById("user-column").getElementsByClassName("user-list-child");
    for (var i = 0; i < els.length; i++) {
        if (els[i].getElementsByClassName("user-list-name")[0].innerHTML == username) {
            return true;
        }
    }
    return false;
}

function change_user_status(username, status) {
    var els = document.getElementById("user-column").getElementsByClassName("user-list-child");
    if (status == "on") {
        console.log('status is on');
        console.log(els);
        for (var i = 0; i < els.length; i++) {
            if (els[i].getElementsByClassName("user-list-name")[0].innerHTML == username || els[i].getElementsByClassName("user-list-name")[0].innerHTML == '@' + username) {
                console.log(els[i]);
                els[i].getElementsByClassName("status-icon")[0].setAttribute('class', 'small secondary-content status-icon material-icons teal-text');
            }
            console.log(els[i].getElementsByClassName('user-list-name')[0].innerHTML);
        }
        console.log('////----------------/////')
    }
    else if (status == "aus") {
        console.log('status is aus');
        console.log(els);
        for (var i = 0; i < els.length; i++) {
            if (els[i].getElementsByClassName("user-list-name")[0].innerHTML == username || els[i].getElementsByClassName("user-list-name")[0].innerHTML == '@' + username) {
                console.log(els[i]);
                console.log(els[i].getElementsByClassName('status-icon'));
                els[i].getElementsByClassName("status-icon")[0].setAttribute('class', 'small secondary-content status-icon material-icons orange-text');
            }
            console.log(els[i].getElementsByClassName('user-list-name')[0].innerHTML);
        }
        console.log('////----------------/////')
    }
}
