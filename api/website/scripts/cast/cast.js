window['__onGCastApiAvailable'] = function(isAvailable) {
    console.log("meow");
    if (isAvailable) {
        console.log("meow");
        initializeCastApi();
    }
  };
  
function initializeCastApi() {
  const context = cast.framework.CastContext.getInstance();
  context.setOptions({
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
    autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
  });
}

// from cast sample

let castPlayer = new CastPlayer();
window['__onGCastApiAvailable'] = function (isAvailable) {
  if (isAvailable) {
    castPlayer.initializeCastPlayer();
  }
};

CastPlayer.prototype.initializeCastPlayer = function () {
    var options = {};
  
    // Set the receiver application ID to your own (created in the
    // Google Cast Developer Console), or optionally
    // use the chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
    options.receiverApplicationId = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
  
    // Auto join policy can be one of the following three:
    // ORIGIN_SCOPED - Auto connect from same appId and page origin
    // TAB_AND_ORIGIN_SCOPED - Auto connect from same appId, page origin, and tab
    // PAGE_SCOPED - No auto connect
    options.autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;
  
    /** The following flag enables Cast Connect(requires Chrome 87 or higher) */
    options.androidReceiverCompatible = true;
  
    cast.framework.CastContext.getInstance().setOptions(options);
  
    this.remotePlayer = new cast.framework.RemotePlayer();
    this.remotePlayerController = new cast.framework.RemotePlayerController(this.remotePlayer);
    this.remotePlayerController.addEventListener(
      cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
      function (e) {
        this.switchPlayer(e.value);
      }.bind(this)
    );
  };
  