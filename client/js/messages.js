var bbTags = BBCodeParser.defaultTags();
//Adiciona as tags do bbcode
bbTags["code"] = new BBTag("code", true, false, true, function (tag, content, attr) {
    return "<code>" + content + "</code>";
});
bbTags["img"] = new BBTag("img", true, false, true, function (tag, content, attr) {
    return "<div class=\"material-placeholder\"><img class=\"materialboxed responsive-img\" src=\"" + content + "\"/></div>";
});
bbTags["spoiler"] = new BBTag("spoiler", true, false, false, function (tag, content, attr) {
    console.log(content);
    console.log("kkkk");
    return "<ul class=\"collapsible\" data-collapsible=\"accordion\"><li><div class=\"collapsible-header\">" + ((attr["spoiler"]) ? attr["spoiler"] : "<b>SPOILER:</b> clique aqui para ver o conteúdo...") + "</div><div class=\"collapsible-body\">" + content + "</div></li></ul>";
});
bbTags["color"] = new BBTag("color", true, false, false, function (tag, content, attr) {
    if(attr["color"]) {
        return "<font color=\"" + attr["color"] + "\">" + content + "</font>";
    } else {
        return content;
    }
});
bbTags["size"] = new BBTag("size", true, false, false, function (tag, content, attr) {
    if(attr["size"]) {
        return "<font size=\"" + attr["size"] + "\">" + content + "</font>";
    } else {
        return content;
    }
});
bbTags["quote"] = new BBTag("quote", true, false, false, function (tag, content, attr) {
    if (attr["quote"]) {
        return "<div class=\"card grey lighten-3\"><div class=\"card-content grey-text\"><span class=\"card-title\"><div class=\"white-text chip grey darken-2\"><img src=\"https://tgmbrasil.com.br/download/file.php?avatar=1082_1476114479.gif\" alt=\"Contact Person\">" + attr["quote"] + "</div></span><i><p style=\"margin-left: 20px;\">" + content + "</p></i></div></div>";
    }
    else {
        return "<div class=\"card grey lighten-3\"><div class=\"card-content grey-text\"><span class=\"card-title\"><div class=\"white-text chip grey darken-2\"><img src=\"https://tgmbrasil.com.br/download/file.php?avatar=1082_1476114479.gif\" alt=\"Contact Person\">Não definido</div></span><i><p class=\"text-grey\" style=\"margin-left: 20px;\">" + content + "</p></i></div></div>";
    }
});

function convertToYoutubeEmbed(url) {
    if (url.indexOf('embed') == -1) {
        if (url.indexOf('watch') != -1) {
            return "https://www.youtube.com/embed/" + url.substring(url.indexOf('v=') + 2, url.length);
        }
    }
    else {
        return url;
    }
}
bbTags["youtube"] = new BBTag("youtube", true, false, true, function (tag, content, attr) {
    return "<div><iframe width=\"426\" height=\"240\" src=\"" + convertToYoutubeEmbed(content) + "\" frameborder=\"0\" class=\"video-iframe\" allowfullscreen></iframe></div>";
});

function insertMessage(text, user, date, msgid, avatar, group_colour) {

    if (JsonOptions.notifyOptions == "1")
    {
      notify(user,avatar,text);
    }
    else if (JsonOptions.notifyOptions == "2")
    {

      if (text.indexOf('[quote="'+my_username+'"]') != -1)
      {
        notify(user,avatar,text);
      }
    }

    if (JsonOptions.playNewMessageSound == true)
    {
      if (JsonOptions.newMessageSoundLink != "" && (JsonOptions.newMessageSoundLink.endsWith(".mp3") || JsonOptions.newMessageSoundLink.endsWith(".ogg")))
      {
        var audio = new Audio(JsonOptions.newMessageSoundLink);
        audio.play();
      }
    }

    console.log('group_colour is: ', group_colour);
    var dt = new Date(date);
    var dtHint;

    if (JsonOptions.showDate == true)
    {
      if (JsonOptions.useRelativeTime == true)
      {
        var time = translateRelativeTime(dt);
        dtHint = dt.toLocaleDateString() + " - " + dt.toLocaleTimeString();
      }
      else
      {
        var time = dt.toLocaleDateString() + " - " + dt.toLocaleTimeString();
        dtHint = "";
      }
    }
    else
    {
      var time = "";
    }

    var message_array = document.getElementById("message-collection").getElementsByClassName("collection-item");
    var last_message = message_array[message_array.length - 1];
    if (last_message != null) {
        var last_message_username = last_message.getElementsByClassName("message-name")[0].innerHTML;
    }
    if (last_message != null && last_message_username == user) {
        var message_content = last_message.getElementsByClassName("message-content")[0];
        console.log(text);
        var _emoticon_text_parsed = parseEmoticon(text);
        var rendered = parseTemplate("message-line", {
            _text: parseBBCode(_emoticon_text_parsed)
            , _msgid: String(msgid)
            , _class: (user.substring(0, 1) == "@") ? user.substring(1, user.length) : user
        });
        $(rendered).appendTo($(message_content));
        var msg_array = message_content.getElementsByClassName("message-line");
        msg_array[msg_array.length - 1].innerHTML =  parseEmoticon( parseBBCode(text) );
    }
    else {
        var _emoticon_text_parsed = parseEmoticon(text);
        console.log("emoticon parsed: ", _emoticon_text_parsed);
        var rendered = parseTemplate("message", {
            _css_style: (group_colour == "") ? 'color:black' : 'font-weight:bold; color:#' + group_colour
            , _class: (user.substring(0, 1) == "@") ? user.substring(1, user.length) : user
            , _user: user
            , _avatar: avatar
            , _text:  parseBBCode( _emoticon_text_parsed )
            , _msgid: String(msgid)
            , _date: time
            , _datestring: dt.toString()
            , _datehint: dtHint
        });
        var msg_col = document.getElementById("message-collection");
        $(rendered).appendTo($(msg_col));
        var message_array = document.getElementById("message-collection").getElementsByClassName("message");
        var last_message = message_array[message_array.length - 1];
        var msg_array = last_message.getElementsByClassName("message-content")[0].getElementsByClassName("message-line");
        msg_array[msg_array.length - 1].innerHTML = parseEmoticon( parseBBCode(text) );
    }
    $('.materialboxed').materialbox();
    $('.collapsible').collapsible({
        accordion: true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });

    $('.dropdown-button').dropdown({
    inDuration: 300,
    outDuration: 225,
    constrain_width: false, // Does not change width of dropdown to that of the activator
    hover: false, // Activate on hover
    gutter: 0, // Spacing from edge
    belowOrigin: false, // Displays dropdown below the button
    alignment: 'left', // Displays dropdown with edge aligned to the left of button
    dropup: true
  }
);
}

function parseTemplate(template, json) {
    var templateHTML = null;
    var templates = document.getElementsByTagName("template");
    for (i = 0; i < templates.length; i++) {
        if (templates[i].getAttribute("name") == String(template)) {
            templateHTML = templates[i].innerHTML;
            break;
        }
    }
    if (templateHTML != null) {
        return Mustache.render(templateHTML, json);
    }
    else {
        return -1;
    }
}

function parseBBCode(text) {
    txt = text;
    var parser = new BBCodeParser(bbTags);
    var result = parser.parseString(txt);
    return result;
}

function translateRelativeTime(date) {
  var str = jQuery.timeago(date);
  var words = str.split(" ");

  for(i=0;i<words.length;i++)
  {
    switch(words[i])
    {
      case "a":
          words[i] = "um";
          break;

      case "less":
          words[i] = "menos";
          break;

      case "than":
          words[i] = "de";
          break;

      case "minute":
          words[i] = "minuto";
          break;

      case "minutes":
          words[i] = "minutos";
          break;

      case "ago":
          words[i] = "atrás";
          break;

      case "second":
          words[i] = "segundo";
          break;

      case "seconds":
          words[i] = "segundos";
          break;

      case "day":
          words[i] = "dia";
          break;

      case "days":
          words[i] = "dias";
          break;

      case "month":
          words[i] = "mês";
          break;

      case "months":
          words[i] = "meses";
          break;

      case "year":
          words[i] = "ano";
          break;

      case "years":
          words[i] = "anos";
          break;

      case "about":
          words[i] = "por volta de";
          break;
    }
  }

    str = "";

    for(i=0;i<words.length;i++)
    {
      str+=words[i];

      if (i != words.length)
      {
        str+=" ";
      }

    }

    return str;
  }


function updateRelativeTime(){
  if (JsonOptions.useRelativeTime == false)
  {
    return;
  }

  var msghour = document.getElementsByClassName("message-hour");

  for(i=0;i<msghour.length;i++)
  {
    msghour[i].innerHTML = translateRelativeTime(new Date(msghour[i].getAttribute("date")));
  }

}


setInterval(updateRelativeTime, jQuery.timeago.settings.refreshMillis);
