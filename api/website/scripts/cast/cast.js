let url = IP;
let _framework;
let player;
let playerController;

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
      console.log('SESSION_STATE_CHANGED');
      if (event.sessionState === "SESSION_STARTED") {
        console.log("Casting started!");

        setup();
      }
    }
  );

};

window['__onGCastApiAvailable'] = function(isAvailable) {
    if (isAvailable) {
        initializeCastApi();
    }
};

let videoIndex = 0;
let _queue;

async function setup(){
  _queue = await createQueue();
  console.log("queue:");
  console.log(_queue);
  console.log("");

  playVideo(_queue[0]);
}

let castSession;
let request;

async function playVideo(media){
  console.log("media that will be loaded");
  console.log(media);

  castSession = _framework.CastContext.getInstance().getCurrentSession();

  request = new chrome.cast.media.LoadRequest(media);
  
  castSession.loadMedia(request)
  .then(
   function() { 
    console.log("media 'loaded' ");
   },
   function(errorCode) { 
    console.log(request); 
    console.log('Error code: ' + errorCode); 
   }
  )
  .then(play)
}

function createQueue(){
  var queue = [];

  var firstIndex = findIndex(arrayOfContents, _video.id);
  
  for (let i = firstIndex; i < arrayOfContents.length; i++) {
    const video = arrayOfContents[i];

    //check if folder
    if(video.folder == 0){
      let path = video.Full_path.replace(/\\/g, '/');
      path = encodeURI(path);
      const fullUrl = url + path; 

      // checking fileType
      if(video.Name.split(".")[video.Name.split(".").length-1] == "mp3" || video.Name.split(".")[video.Name.split(".").length-1] == "MP3"){
        var media = new chrome.cast.media.MediaInfo(fullUrl, 'audio/mp3');
      }else{
        var media = new chrome.cast.media.MediaInfo(fullUrl, 'video/mp4');
      }
      
      media.contentUrl = media.contentId;
      media.streamType = chrome.cast.media.StreamType.BUFFERED;
      media.metadata = new chrome.cast.media.GenericMediaMetadata();
      media.metadata.title = video.Name;
      media.autoplay = true;
      media.preloadTime = 10;
      media.startTime = 0;

      queue.push(media);
    }
  }

  return queue;
}

function play(){
  
  player = new _framework.RemotePlayer();
  playerController = new _framework.RemotePlayerController(player);
    
  //event for timstamping
  playerController.addEventListener(
    _framework.RemotePlayerEventType.CURRENT_TIME_CHANGED,
    function() {
      console.log("CURRENT_TIME_CHANGED");
      var time = player.currentTime;
        if(videoIndex > arrayOfContents.length){
  
        }
        else if(videoIndex == arrayOfContents.length){
          updateTimestamp(time,arrayOfContents[videoIndex-1].id);
        }else{
          updateTimestamp(time,arrayOfContents[videoIndex].id);
        }
    }
  );

  playerController.addEventListener(
    _framework.RemotePlayerEventType.PLAYER_STATE_CHANGED,
    function(event) {
        console.log('PLAYER_STATE_CHANGED TO ' + player.playerState);
        
        if (player.playerState === 'IDLE' || player.playerState === 'BUFFERING' ) {

          length = GetVideoLength();

          if (Math.round(player.currentTime) >= length) {
            console.log('media ended');
            
            videoIndex++;
            if(videoIndex <= (_queue.length-1)){
              console.log('playing next in queue');
              console.log("index: " + videoIndex);
              playVideo(_queue[videoIndex]);
            }else{
              console.log("end of queue reached");
      
            }
  
          }

        }
    }
  );

}

//returns the length of the video
function GetVideoLength(){
  const context = _framework.CastContext.getInstance();
  const session = context.getCurrentSession();
  const media = session.getMediaSession();
  return Math.round(media.media.duration);
}