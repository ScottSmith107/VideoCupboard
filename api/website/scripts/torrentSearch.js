// onload function to get sid for qbittornt 
function onload(){

    //reach out to backend to get sid
    fetch(url+"auth", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(console.log(response))
    .catch(error => {
        console.error("couldnt reach torrent client", error);
    });
}

//searches for torrents bassed off input from user
function search(){
    const query = document.getElementById("searchInput").Value;
    
    //reach out to backend with query 
    fetch(url+"search", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(listQuery)
    .catch(error => {
        console.error("couldnt reach torrent client", error);
    });

}
//list all 
listQuery => function(response){
    console.log(response);

}

//addes selected torrent and sends it to qbittorrent
function addTorrent(){

    //reach out to backend with query 
    fetch(url+"addTorrent", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(listQuery)
    .catch(error => {
        console.error("couldnt reach torrent client", error);
    });
}