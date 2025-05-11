// let url = "https://"+IP+":3000/";
let url = "https://desktop-4krngi0.taileab52c.ts.net/";

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

      // console.log("url: ", fullUrl); 
      // console.log("video"); 
      // console.log(video); 

      // checking fileType
      if(video.Name.split(".")[video.Name.split(".").length-1] == "mp3" || video.Name.split(".")[video.Name.split(".").length-1] == "MP3"){
        var media = new chrome.cast.media.MediaInfo(fullUrl, 'audio/mp3');
        media.streamType = chrome.cast.media.StreamType.BUFFERED;
        media.contentUrl = media.contentId;
        media.metadata = new chrome.cast.media.GenericMediaMetadata();
        media.metadata.title = video.Name;
        media.autoplay = true;
        media.preloadTime = 10;
        media.startTime = 0;
      }else{
        var media = new chrome.cast.media.MediaInfo(fullUrl, 'video/mp4');
        media.contentUrl = media.contentId;
        media.streamType = chrome.cast.media.StreamType.BUFFERED;
        media.metadata = new chrome.cast.media.GenericMediaMetadata();
        media.metadata.title = video.Name;
        media.autoplay = true;
        media.preloadTime = 10;
        media.startTime = 0;
      }
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
        if (player.playerState === 'IDLE') {

          //need to wait as it will 
          // be idle for a moment before switching
          setTimeout(() => {
    
            if (player.playerState === 'IDLE') {
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
          }, 2000);

        }
    }
  );

  // playerController.addEventListener(
  //   _framework.RemotePlayerEventType.IS_MEDIA_LOADED_CHANGED,
  //   () => {
  //       console.log("Media loaded state changed:", player.isMediaLoaded);
  //       if (player.isMediaLoaded) {
  //         // playerController.playOrPause();
  //       }
  //   }
  // );

}









// let url = "http://"+IP+":3000/";

// let initializeCastApi = function() {
//     cast.framework.CastContext.getInstance().setOptions({
//         receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
//       autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
//     });

//     //creating listener
//     cast.framework.CastContext.getInstance().addEventListener(
//         cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
//         (event) => {
//           if (event.sessionState === "SESSION_STARTED") {
//             console.log("Casting started!");
    
//             //play media
//             playCurrVideo();
//           }
//         }
//     );

//   };

// window['__onGCastApiAvailable'] = function(isAvailable) {
//     if (isAvailable) {
//         initializeCastApi();
//     }
// };

// function playCurrVideo(){

//     // currentMediaURL = url + _video.Full_Path;
//     var currentMediaURL = "https://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3";

//     var mediaInfo = new chrome.cast.media.MediaInfo(currentMediaURL, "video/mp4");
//     var request = new chrome.cast.media.LoadRequest(mediaInfo);
//     var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
//     console.log(castSession);

//     castSession.loadMedia(request).then(
//     function() { 
//       console.log('Load succeed');

//       var player = new cast.framework.RemotePlayer();
//       var playerController = new cast.framework.RemotePlayerController(player);

//       playerController.addEventListener(
//         cast.framework.RemotePlayerEventType.IS_MEDIA_LOADED_CHANGED,
//         () => {
//             console.log("IS_MEDIA_LOADED_CHANGED:", player.isMediaLoaded);
//             if (player.isMediaLoaded) {
//                 console.log("Media loaded, playing...");
//                 playerController.playOrPause(); // play when ready
//             }
//         }
//     );
  
//     playerController.addEventListener(
//         cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED,
//         () => {
//             console.log("Player state:", player.playerState);
//         }
//     );

//       console.log(player);
//       if(player.isMediaLoaded == true){
//         console.log("loaded");
//         playerController.playOrPause();
//       }else{
//         console.log("not loaded");
//       }
//     },
//     function(errorCode) { console.log('Error code: ' + errorCode); });
// }