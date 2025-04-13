let url = "http://"+IP+":3000/";

let initializeCastApi = function() {
    cast.framework.CastContext.getInstance().setOptions({
        receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    });

    //creating listener
    cast.framework.CastContext.getInstance().addEventListener(
        cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
        (event) => {
          if (event.sessionState === "SESSION_STARTED") {
            console.log("Casting started!");
    
            //play media
            playCurrVideo();
          }
        }
    );

  };

window['__onGCastApiAvailable'] = function(isAvailable) {
    if (isAvailable) {
        initializeCastApi();
    }
};

function playCurrVideo(){

    // currentMediaURL = url + _video.Full_Path;
    var currentMediaURL = "http://localhost:3000/The Ghoul.mp3";

    var mediaInfo = new chrome.cast.media.MediaInfo(currentMediaURL, "video/mp4");
    var request = new chrome.cast.media.LoadRequest(mediaInfo);
    var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    console.log(castSession);

    castSession.loadMedia(request).then(
        function() { console.log('Load succeed'); },
        function(errorCode) { console.log('Error code: ' + errorCode); });
}
