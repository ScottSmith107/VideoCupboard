let url = "http://"+"192.168.1.124"+":3000/";
// let url = "http://"+IP+":3000/";

let _framework;

let initializeCastApi = function() {
    cast.framework.CastContext.getInstance().setOptions({
        receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    });

    //creating listener
    _framework = cast.framework; 
    cast.framework.CastContext.getInstance().addEventListener(
        cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
        (event) => {
          if (event.sessionState === "SESSION_STARTED") {
            console.log("Casting started!");
            //play media
            // playVideoQueue();
            playTestQueue();
            // playSingleVideo();
          }
        }
    );

  };
  //TODO //add prgress event
  // ,
  //       cast.framework.events.EventType.PROGRESS,
  //       (event) => {
  //         updateTimestamp(event);
  //       }

window['__onGCastApiAvailable'] = function(isAvailable) {
    if (isAvailable) {
        initializeCastApi();
    }
};

function playVideoQueue(){

  const queue = createMediaQueue();
  console.log(queue);

  const queueRequest = new chrome.cast.media.QueueLoadRequest({ items: queue });

  var castSession = _framework.CastContext.getInstance().getCurrentSession();
  console.log(castSession);

  castSession.loadMedia(queueRequest)
  .then(
   function() { console.log("media loaded"); },
   function(errorCode) { console.log('Error code: ' + errorCode); }
  )
  .then(play);
}

//creates a mediaQueue will all the items after the video that is playing
//@returns array on queue items 
function createMediaQueue(){
  var queue = [];

  var firstVideo = url + _video.Full_path;
  var firstIndex = findIndex(arrayOfContents, _video.id);
  
  for (let i = firstIndex; i < arrayOfContents.length; i++) {
    const video = arrayOfContents[i];

    let path = video.Full_path.replace(/\\/g, '/');
    path = encodeURI(path);

    const fullUrl = url + path;
    
    const media = new chrome.cast.media.MediaInfo(fullUrl, 'audio/mp3');
    // const media = new chrome.cast.media.MediaInfo(url + video.Full_path, 'video/mp4');
    const item = new chrome.cast.media.QueueItem(media);
    item.autoplay = true;
    item.preloadTime = 10;
    item.startTime = 0;
    queue.push(item);
  }

  return queue;
}

function play(response){
  var player = new _framework.RemotePlayer();
  const controller = new _framework.RemotePlayerController(player);
  if(player.isMediaLoaded){
    console.log("loaded");
    controller.playOrPause();
  }else{
    console.log("not loaded");
  }

}