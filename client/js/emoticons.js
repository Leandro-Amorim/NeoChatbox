var Emoticons = {};
function parseEmoticon(text) {
    var txt = text;
    console.log(txt);
    console.log('//////////////////////////////');
    if (txt.indexOf(":") == -1) {
        console.log(': not exists');
        return text;
    }
    $.each(Emoticons, function (key, value) {
        txt = replaceAll(txt, ':' + String(key) + ':', value);
        console.log(txt);
    });
    console.log("emoticon parsed, result: ", txt);
    return txt;
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function addEmoticon(img, alt) {
    var emoticon_html = parseTemplate("emoticon-template", {
        url: img
        , value: alt
    });
    Emoticons[replaceAll(alt, ":", "")] = "<img src=\"" + img + "\"></img>";
    console.log(emoticon_html);
    var x = $(emoticon_html).appendTo("#emoticons-dropdown");
    console.log(x);
    console.log(document.getElementById("emoticons-dropdown").innerHTML);
    $(".emoticon").last().click(function () {
        console.log(this.alt);
        $("#inputdefault").val($("#inputdefault").val() + this.alt);
    });
}

function addCategory(category) {
    var menu = document.getElementById("emoticon-menu");
    var li_el = document.createElement("LI");
    var att = document.createAttribute("class");
    att.value = "dropdown-header";
    li_el.setAttributeNode(att);
    var textnode = document.createTextNode(category);
    li_el.appendChild(textnode);
    menu.appendChild(li_el);
}