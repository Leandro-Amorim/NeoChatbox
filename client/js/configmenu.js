JsonOptions = new Object();



//Carrega do servidor, senão, usa os valores padrões;

JsonOptions.useRelativeTime = true;
JsonOptions.blockedUsers = [];
JsonOptions.showAvatar = true;
JsonOptions.showDate = true;
JsonOptions.showEditButton = true;
JsonOptions.showImages = true;
JsonOptions.showVideos = true;


JsonOptions.notifyOptions = 0;

JsonOptions.themeName = "";
JsonOptions.css = "";

JsonOptions.playNewMessageSound = true;
JsonOptions.newMessageSoundLink = "";

JsonOptions.playNewUserSound = true;
JsonOptions.newUserSoundLink = "";


var messageHTML = "";
var notificationsHTML = "";
var styleHTML = "";
var audioHTML = "";

function modalOpened()
{

  TempJson = JsonOptions;
  renderConfigHTML();
  document.getElementsByClassName("config-options")[0].innerHTML = messageHTML;

  $(".config-menu-mobile .collection .collection-item").removeClass("active");
  $(".config-menu .collection .collection-item").removeClass("active");

  $(".config-menu .collection .collection-item:first-child").addClass("active");
  $(".config-menu-mobile .collection .collection-item:first-child").addClass("active");


  $('.chips').material_chip();
  $('.materialboxed').materialbox();
  $('select').material_select();

  $("#config-useRelativeTime").prop("checked",TempJson.useRelativeTime);
  $("#config-showAvatar").prop("checked",TempJson.showAvatar);
  $("#config-showDate").prop("checked",TempJson.showDate);
  $("#config-showEditButton").prop("checked",TempJson.showEditButton);
  $("#config-showImages").prop("checked",TempJson.showImages);
  $("#config-showVideos").prop("checked",TempJson.showVideos);
}

function applyConfig()
{
  setTempConfig();
  JsonOptions = TempJson;
  socket.emit('apply_settings', JSON.stringify(TempJson));
  if (JsonOptions.notifyOptions == "1" || JsonOptions.notifyOptions == "2")
  {
    if(Notification.permission != "granted")
    {
    	Notification.requestPermission();
  	}
  }

}

function renderConfigHTML()
{
  var messageOptions = new Object();
  var notificationOptions = new Object();
  var styleOptions = new Object();
  var audioOptions = new Object();




  messageHTML = parseTemplate("config-message",messageOptions);
  notificationsHTML = parseTemplate("config-notifications",notificationOptions);
  styleHTML = parseTemplate("config-style",styleOptions);
  audioHTML = parseTemplate("config-audio",audioOptions);
}

function changeConfigTab(btn)
{
setTempConfig();
  renderConfigHTML();
  switch(btn.innerHTML)
  {
    case "Mensagens":
    document.getElementsByClassName("config-options")[0].innerHTML = messageHTML;
    break;

    case "Notificações":
    document.getElementsByClassName("config-options")[0].innerHTML = notificationsHTML;
    break;

    case "Estilo":
    document.getElementsByClassName("config-options")[0].innerHTML = styleHTML;
    break;

    case "Áudio":
    document.getElementsByClassName("config-options")[0].innerHTML = audioHTML;
    break;
  }

  $("#config-useRelativeTime").prop("checked",TempJson.useRelativeTime);
  $("#config-showAvatar").prop("checked",TempJson.showAvatar);
  $("#config-showDate").prop("checked",TempJson.showDate);
  $("#config-showEditButton").prop("checked",TempJson.showEditButton);
  $("#config-showImages").prop("checked",TempJson.showImages);
  $("#config-showVideos").prop("checked",TempJson.showVideos);


  ////TERMINAR ESSA BOSTA AQUI!!!!!

  $(".config-menu-mobile .collection .collection-item").removeClass("active");
  $(".config-menu .collection .collection-item").removeClass("active");
  $(btn).addClass("active");

  $('.chips').material_chip();
  $('.materialboxed').materialbox();
  $('select').material_select();
}

$(document).ready(function(){
  $('.config-menu .collection').pushpin({ top: $('.config-menu').offset().top });
  $('select').material_select();
});

function setTempConfig()
{
  //TÁ DANDO MERDA DAS GRANDES AQUI, OLHAR DEPOIS


  if (typeof($("#config-useRelativeTime").prop("checked")) != 'undefined') {TempJson.useRelativeTime = $("#config-useRelativeTime").prop("checked");}
  TempJson.blockedUsers = [];
  if (typeof($("#config-showAvatar").prop("checked")) != 'undefined') {TempJson.showAvatar = $("#config-showAvatar").prop("checked");}
  if (typeof($("#config-showDate").prop("checked")) != 'undefined') {TempJson.showDate = $("#config-showDate").prop("checked");}
  if (typeof($("#config-showEditButton").prop("checked")) != 'undefined') {TempJson.showEditButton = $("#config-showEditButton").prop("checked");}
  if (typeof($("#config-showImages").prop("checked")) != 'undefined') {TempJson.showImages = $("#config-showImages").prop("checked");}
  if (typeof($("#config-showVideos").prop("checked")) != 'undefined') {TempJson.showVideos = $("#config-showVideos").prop("checked");}



  if (typeof($("#config-notifyOptions").val()) != 'undefined') {TempJson.notifyOptions = $("#config-notifyOptions").val();}

  if (typeof($(".card.theme-option.active").attr("theme-name")) != 'undefined') {TempJson.themeName = $(".card.theme-option.active").attr("theme-name");}
  TempJson.css = "";

  if (typeof($("#config-playNewMessageSound").prop("checked")) != 'undefined') {TempJson.playNewMessageSound = $("#config-playNewMessageSound").prop("checked");}
  if (typeof($("#config-newMessageSoundLink").val()) != 'undefined') {TempJson.newMessageSoundLink = $("#config-newMessageSoundLink").val();}

  if (typeof($("#config-playNewUserSound").prop("checked")) != 'undefined') {TempJson.playNewUserSound = $("#config-playNewUserSound").prop("checked");}
  if (typeof($("#config-newUserSoundLink").val()) != 'undefined') {TempJson.newUserSoundLink = $("#config-newUserSoundLink").val();}
}
