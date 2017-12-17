//var socket = io.connect("191.6.198.85:21094");
var socket = io('127.0.0.1:21094', {
    'forceNew': true
});
document.getElementsByClassName("userView-name")[0].innerHTML = "";
var CHAT_MSG_LIMIT = 50;
$(document).keydown(function (event) {
    if (event.which == "17") cntrlIsPressed = true;
});
$(document).keyup(function () {
    cntrlIsPressed = false;
});
var cntrlIsPressed = false;

function updateMessagesEdit(username) {
    console.log('username: ', my_username);
    $("." + username).click('*', function (event) {
        if (cntrlIsPressed) {
            socket.emit('check_edit_message', {
                message_id: event.target.id
            });
        }
    });
}

function check_command(str, command) {
    if (str.substr(0, command.length) == command) {
        return true;
    }
    else {
        return false;
    }
}
var get_archive = false;
$('#formdefault').submit(function () {
    var messageText = $("#inputdefault").val();
    if (messageText.substr(0, 1) == '/') {
        var arguments = messageText.split(' ');
        arguments.splice(0, 1);
        if (check_command(messageText, '/ban')) {
            if (arguments[0] != '') {
                var send_data = {
                    user_target: arguments[0]
                }
                socket.emit('ban', send_data);
            }
        }
        else if (check_command(messageText, '/unban')) {
            if (arguments[0] != '') {
                var send_data = {
                    user_target: arguments[0]
                }
                socket.emit('unban', send_data);
            }
        }
        else if (check_command(messageText, '/add-emoticon')) {
            if (arguments[0] != '' && arguments[1] != '' && arguments[2] != '') {
                var send_data = {
                    name: arguments[0]
                    , url: arguments[1]
                    , category: arguments[2]
                , }
                socket.emit('create_emoticon', send_data);
                console.log('em_sending');
            }
        }
        else if (check_command(messageText, '/remove-emoticon')) {
            if (arguments[0] != "" && arguments[1] != "") {
                var send_data = {
                    name: arguments[0]
                    , category: arguments[1]
                , };
                socket.emit('delete_emoticon', send_data);
            }
        }
        else if (check_command(messageText, '/kick')) {
            if (arguments[0] != "") {
                var send_data = {
                    user_target: arguments[0]
                };
                console.log(arguments[0]);
                socket.emit("kick_user", send_data);
            }
        }
        else if (check_command(messageText, '/mod')) {
            if (arguments[0] != "") {
                var send_data = {
                    user_target: arguments[0]
                };
                console.log(arguments[0]);
                socket.emit('set_mod', send_data);
            }
        }
        else if (check_command(messageText, '/unmod')) {
            if (arguments[0] != "") {
                var send_data = {
                    user_target: arguments[0]
                }
                console.log(arguments[0]);
                socket.emit('remove_mod', send_data);
            }
        }
    }
    else {
        var send_data = {
            message_text: messageText
        , };
        socket.emit('post_message', send_data);
    }
    $('#inputdefault').val('');
    return false;
});

function message_list_scroll_down() {
    document.getElementById('message_list_column').scrollTop = 9999999;
}
var typing = false;
var notPressTimming = null;
$("#inputdefault").keydown(function () {
    console.log('is typing');
    clearInterval(notPressTimming);
    if (!typing) {
        //"Fala" para o servidor que eu estou digitando
        socket.emit('typing', {
            type: 'is_typing'
        });
        typing = true;
    }
});
$("#inputdefault").keyup(function () {
    console.log('keyup');
    notPressTimming = setTimeout(function () {
        //"Fala" para o servidor que eu parei de digitar
        socket.emit('typing', {
            type: 'not_is_typing'
        });
        typing = false;
    }, 400);
});
socket.on('typing', function (recdata) {
    username = recdata.username;
    if (recdata.type == "is_typing") {
        var els = document.getElementById("user-column").getElementsByClassName("user-list-child");
        console.log('status is on');
        console.log(els);
        for (var i = 0; i < els.length; i++) {
            if (els[i].getElementsByClassName("user-list-name")[0].innerHTML == username || els[i].getElementsByClassName("user-list-name")[0].innerHTML == '@' + username) {
                console.log(els[i]);
                $(els[i].getElementsByClassName("is-typing-icon")[0]).css("opacity", "1");
            }
            console.log(els[i].getElementsByClassName('user-list-name')[0].innerHTML);
        }
        console.log('////----------------/////');
        console.log(recdata.username + ' typing...');
    }
    else {
        var els = document.getElementById("user-column").getElementsByClassName("user-list-child");
        console.log('status is on');
        console.log(els);
        for (var i = 0; i < els.length; i++) {
            if (els[i].getElementsByClassName("user-list-name")[0].innerHTML == username || els[i].getElementsByClassName("user-list-name")[0].innerHTML == '@' + username) {
                console.log(els[i]);
                $(els[i].getElementsByClassName("is-typing-icon")[0]).css("opacity", "0");
            }
            console.log(els[i].getElementsByClassName('user-list-name')[0].innerHTML);
        }
        console.log('////----------------/////');
        console.log(recdata.username + ' is not typing...');
    }
});
socket.on('post_message', function (recdata) {
    if (document.getElementById("message-collection").childNodes.length > CHAT_MSG_LIMIT) {
        document.getElementById("message-collection").removeChild(document.getElementById("message-collection").childNodes[0]);
    }
    insertMessage(recdata.message_text, recdata.username, recdata.time, recdata.message_id, recdata.avatar, recdata.group_colour);
    message_list_scroll_down();
    updateMessagesEdit(my_username);
});
socket.on('edit_message', function (data) {
    var txt = parseBBCode(data.new_message);
    document.getElementById(data.message_id).innerHTML = txt;
    document.getElementById(data.message_id).setAttribute("class", "message-line " + data.username);
    $('.materialboxed').materialbox();
    $('.collapsible').collapsible({
        accordion: true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
});
socket.on('error', function (data) {
    console.log("Error received!");
    console.log(data);
    if (data == "not_logged") {
        document.getElementById("message_list_column").innerHTML = parseTemplate("error-message", {
            status: "403"
            , text: "Você não está logado."
        });
        document.getElementsByClassName("userView-rank")[0].innerHTML = "Null";
    }
    else if (data == "banned") {
        document.getElementById("message_list_column").innerHTML = parseTemplate("error-message", {
            status: "403"
            , text: "Você está banido."
        });
        document.getElementsByClassName("userView-rank")[0].innerHTML = "Banido";
    }
});
socket.on('check_edit_message', function (data) {
    if (data.can) {
        var txtvalue = data.message_text;
        var otherHTML = document.getElementById(data.message_id).innerHTML;
        document.getElementById(data.message_id).innerHTML = "<form id=\"form_" + data.message_id + "\"><input id=\"input_" + data.message_id + "\" type=\"text\" autocomplete=\"off\"></form>";
        $(document.getElementById("input_" + data.message_id)).val(txtvalue);
        document.getElementById('message_list_column').scrollTop += 15;
        $("#" + "form_" + data.message_id).submit(function (event) {
            var send_object = {
                message_id: event.target.id.substring("form_".length, event.target.id.length)
                , new_message: $("#input_" + event.target.id.substring("form_".length, event.target.id.length)).val()
            };
            document.getElementById(data.message_id).innerHTML = otherHTML;
            document.getElementById(data.message_id).setAttribute("class", "message-line");
            socket.emit('edit_message', send_object);
            return false;
        });
    }
});
socket.on('my_info', function (data) {
    document.getElementsByClassName("userView-name")[0].innerHTML = data.username;
    document.getElementById('user_view').setAttribute("src", data.avatar);
    document.getElementsByClassName('userView-rank')[0].innerHTML = data.group_name;
    document.getElementsByClassName('userView-rank')[0].setAttribute("style", (data.group_colour != "") ? "color:#" + data.group_colour : "color:black");
    my_username = (data.username.substring(0, 1) == "@") ? data.username.substring(1, data.username.length) : data.username;
    updateMessagesEdit(my_username);
    //console.log('mr, ', rendered);
    //$('.userView-rank')[0].innerHTML = data.group_name;
});

function apply_limit_for_messages(limit) {
    var sz = document.getElementById('message-collection').childNodes.length - limit;
    for (var i = 0; i < sz; i++) {
        document.getElementById('message-collection').removeChild(document.getElementById('message-collection').childNodes[i]);
    }
}
socket.on('get_messages', function (recdata) {
    $("#message-collection").empty();
    for (var i = 0; i < recdata.messages.length; i++) {
        insertMessage(recdata.messages[i].message, recdata.messages[i].username, recdata.messages[i].date, recdata.messages[i].id, recdata.messages[i].avatar, recdata.messages[i].group_colour);
        console.log('group color of message received is: ', recdata.messages[i].group_colour);
    }
    apply_limit_for_messages(CHAT_MSG_LIMIT);
    message_list_scroll_down();
});
socket.on('get_emoticons', function (recdata) {
    for (var i = 0; i < recdata.emoticons.length; i++) {
        addEmoticon(recdata.emoticons[i].url, ':' + recdata.emoticons[i].name + ':');
    }
});
socket.on('create_emoticon', function (recdata) {
    addEmoticon(recdata.url, ':' + recdata.name + ':', recdata.category);
});
socket.on('user_connect', function (recdata) {
    if (!user_exists(recdata.username)) {
        add_user(recdata.username, recdata.avatar, recdata.group_colour, recdata.status);
    }
    console.log('user connect: ', recdata.username);
});
socket.on('user_disconnect', function (recdata) {
    if (user_exists(recdata.username)) {
        console.log("user exists");
        remove_user(recdata.username);
    }
    console.log('user_disconnect: ', recdata.username);
});
socket.on('chat_settings', function (recdata) {
    console.log(recdata);
    TempJson = JSON.parse(recdata.json_settings);
    applyConfig();
});
socket.on('PANIC', function (recdata) {
    insertMessage(recdata.message_text, 'LadyAnna', '', -1);
    console.log('FALHA FATAL!');
});
socket.on('disconnect', function (recdata) {
    alert('desconectado do servidor.');
});
socket.on('kick', function (recdata) {
    if (user_exists(recdata.username)) {
        insertMessage(recdata.username + ' foi desconectado do servidor.', '', '', -1);
        remove_user(recdata.username);
    }
});
socket.on('get_archive', function (recdata) {
    $("#message-collection").empty();
    for (var i = 0; i < recdata.messages.length; i++) {
        insertMessage(recdata.messages[i].message, recdata.messages[i].username, recdata.messages[i].date, recdata.messages[i].id, recdata.messages[i].avatar);
    }
});
socket.on('add_mod', function (recdata) {
    if (recdata.user_target == my_username) {
        set_mod(recdata.user_target);
        my_username = "@" + my_username;
    }
});
socket.on('remove_mod', function (recdata) {
    console.log(recdata);
    if ("@" + recdata.user_target == my_username) {
        my_username = my_username.substring(1, my_username.length);
    }
    remove_mod(recdata.user_target);
});
socket.on('change_status', function (recdata) {
    console.log('status changed');
    console.log(recdata);
    change_user_status(recdata.username, recdata.status);
});
socket.on('update_chat_header', function (recdata) {});
$("#get_archive_button").click(function () {
    if (!get_archive) {
        socket.emit('get_archive');
        get_archive = true;
    }
    else {
        socket.emit('get_messages');
        get_archive = false;
    }
    console.log("clicked");
});