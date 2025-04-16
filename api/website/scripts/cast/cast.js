let url = "http://"+"192.168.1.124"+":3000/";
// let url = "http://"+IP+":3000/";

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

    player = new _framework.RemotePlayer();
    playerController = new _framework.RemotePlayerController(player);

    cast.framework.CastContext.getInstance().addEventListener(
      cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
      (event) => {
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

function setup(){
  _queue = createQueue();
  console.log(_queue);
  playVideo(_queue[0]);
}

function playVideo(media){

  const request = new chrome.cast.media.LoadRequest(media);

  var castSession = _framework.CastContext.getInstance().getCurrentSession();

  castSession.loadMedia(request)
  .then(
   function() { 
    console.log("media loaded"); 

   },
   function(errorCode) { console.log('Error code: ' + errorCode); }
  )
  .then(play);
}

function createQueue(){
  var queue = [];

  var firstVideo = url + _video.Full_path;
  var firstIndex = findIndex(arrayOfContents, _video.id);
  
  for (let i = firstIndex; i < arrayOfContents.length; i++) {
    const video = arrayOfContents[i];

    //check if folder
    if(video.folder == 0){
      let path = video.Full_path.replace(/\\/g, '/');
      path = encodeURI(path);
      const fullUrl = url + path;
      
      // needs testing \\  v v v v v v 

      //checking fileType
      if(video.Name.split(".")[video.Name.split(".").length-1] == "mp3" || video.Name.split(".")[video.Name.split(".").length-1] == "MP3"){
        const media = new chrome.cast.media.MediaInfo(fullUrl, 'audio/mp3');
      }else{
        const media = new chrome.cast.media.MediaInfo(url + video.Full_path, 'video/mp4');
      }
      queue.push(media);
    }
  }

  return queue;
}

function play(response){

  playerController.addEventListener(
    _framework.RemotePlayerEventType.CURRENT_TIME_CHANGED,
    function() {
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
      if (player.playerState === 'IDLE') {
        console.log('media ended');
        
        videoIndex++;
        if(videoIndex <= (_queue.length-1)){
          playVideo(_queue[videoIndex]);
          console.log('playing next in queue');
          console.log(_queue[videoIndex]);
        }else{
          console.log("end of queue reached");
          videoIndex = 0;

        }
      }
    }
  );

}
