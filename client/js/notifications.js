/**
 * Notify-me - NeoChatbox Edition
 *
 * @author Mr.Rafael | Led
 * @profile http://www.tgmbrasil.com.br/memberlist.php?mode=viewprofile&u=1397
 * @profile https://tgmbrasil.com.br/memberlist.php?mode=viewprofile&u=1074
 */

var isOnTab = true;

window.onfocus = function() {
		isOnTab = true;
	};

window.onblur = function() {
		isOnTab = false;
	};


  function notify(user, photo, message) {

  		if(Notification.permission == "granted" && isOnTab == false) {
  			var note = new Notification(user, {"body":message,"icon":photo});
  			}
  	}
