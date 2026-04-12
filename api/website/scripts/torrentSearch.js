let url = IP;
let urlParams = new URLSearchParams(window.location.search);
let userID;

// onload function to get sid for qbittornt 
function onload(){

    userID = urlParams.get("userID");

    // sets up onsubmit for form 
    document.getElementById("searchForm").addEventListener("submit", function(e){
        e.preventDefault();
        search();
    });

    // reach out to backend to get qbit sid
    fetch(url+"auth")
    .then(response => response.text())
    .then(data => {
        console.log("result from auth", data);

        if (data == "Fails."){
            document.getElementById("error").innerText = "Failed to connect to QBIT client";
        }else if(data == "Your IP address has been banned after too many failed authentication attempts."){
            document.getElementById("error").innerText = data;
        }
    })
    .catch(error => {
        console.error("couldnt reach torrent client", error);
    });

    checkDownloads();
}

//searches for torrents bassed off input from user
function search(){
    const query = document.getElementById("searchInput").value;
    const search = new URL(url+"torrentSearch");
    search.searchParams.append("query",query);

    //reach out to backend with query 
    fetch(search)
    .then(response => response.json())
    .then(data =>{
            document.getElementById("searchResults").innerHTML = "";
            console.log("search results");
            console.log(data);
            
            data.forEach(item => {
                if(item.seeders != 0){
                    makeWidget(item.fileName, item.magnetUrl, item.seeders, item.size, item.files);
                }
            });
            
        })
    .catch(error => {
        console.error("couldnt reach torrent client", error);
    });

}

//displays each entry
function makeWidget(name, magnet, seeders, size, files){
    const main = document.getElementById("searchResults");

    const div = document.createElement("div");
    div.className ="torrent";

    const contentP = document.createElement("p");
    contentP.className = "name"; 
    contentP.innerText = name;
    contentP.id = magnet;
    
    const contentS = document.createElement("p");
    contentS.className = "seeders"; 
    contentS.innerText = "seeders :" + seeders;
    contentS.id = magnet;

    const contentSize = document.createElement("p");
    contentSize.className = "Size"; 
    contentSize.innerText = "size :" + Math.round(size/1000000) + "MB";
    contentSize.id = magnet;

    const contentFiles = document.createElement("p");
    contentFiles.className = "contentFiles"; 
    contentFiles.innerText = "Number of files :" + files;
    contentFiles.id = magnet;

    const button = document.createElement("button");
    button.innerHTML = "Download"
    button.className = "torrentButton";
    button.onclick = () =>{ //addes selected torrent and sends it to qbittorrent
        const search = new URL(url+"addTorrent");
        search.searchParams.append("magnet",magnet);

        fetch(search)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("couldnt reach torrent client", error);
        });
    }

    div.appendChild(contentP);
    div.appendChild(contentS);
    div.appendChild(contentSize);
    div.appendChild(contentFiles);
    div.appendChild(button);
    main.appendChild(div);
}

//pulls down all current downloads every x
const interval = setInterval(checkDownloads, 5000);
//checks the status of all current torrents.
function checkDownloads(){

    fetch(url+"getTorrents")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        maindiv = document.getElementById("downloading").innerHTML = "";

        data.forEach(item => {
            makeTorrentWidget(item.name, item.num_seeds, item.eta, item.dlspeed, item.state, item.hash, item.progress) ;
        });
    })
    .catch(error => {
        console.error("couldnt reach torrent client", error);
    });
}

function makeTorrentWidget(name, seeders, eta, dlspeed,state,hash, progress){
    maindiv = document.getElementById("downloading");

    if(state == "stalledUP" || state == "pausedUP"){
        eta = 0;
    }

    const torrentDiv = document.createElement("div");
    torrentDiv.className = "TorrentDiv";
    torrentDiv.id = "TorrentDiv";

    const contentName = document.createElement("p");
    contentName.className = "torrentName"; 
    contentName.innerText = name;

    const contentSeeders = document.createElement("p");
    contentSeeders.className = "torrentSeeders"; 
    contentSeeders.innerText = "Seeders : " + seeders;

    const contentEta = document.createElement("p");
    contentEta.className = "torrentEta"; 
    contentEta.innerText = "ETA : " + Math.round(eta/60) + " Minutes";
    
    const contentSpeed = document.createElement("p");
    contentSpeed.className = "torrentDlspeed"; 
    contentSpeed.innerText = "Download-Speed : " + Math.round(dlspeed/1000000) + " Mib/s";

    const contentProgress = document.createElement("p");
    contentProgress.className = "torrentprogress"; 
    contentProgress.innerText = "progress: " + Math.round(progress * 100) +"%";

    const contentState = document.createElement("p");
    contentState.className = "torrentState"; 
    contentState.innerText = "State : " + state;

    const buttonRemove = document.createElement("button");
    buttonRemove.innerHTML = "Remove"
    buttonRemove.className = "torrentButton";
    buttonRemove.id = "removeTorrentButton";
    buttonRemove.onclick = () =>{ //removes this torrent and deletes any files
        const search = new URL(url+"removeTorrent");
        search.searchParams.append("hash",hash);
        
        fetch(search)
        .then(response => response.text())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("couldnt reach torrent client", error);
        });
    }

    const buttonPause = document.createElement("button");
    buttonPause.innerHTML = "Pause"
    buttonPause.className = "torrentButton";
    buttonPause.id = "pauseTorrentButton";
    buttonPause.onclick = () =>{ //Pauses this torrent
        if(state == "pausedDL"){
            const search = new URL(url+"resumeTorrent");
            search.searchParams.append("hash",hash);
            
            fetch(search)
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error("couldnt reach torrent client", error);
            });
        }else{

            const search = new URL(url+"pauseTorrent");
            search.searchParams.append("hash",hash);
            
            fetch(search)
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error("couldnt reach torrent client", error);
            });
        }
        
    }

    torrentDiv.appendChild(contentName);
    torrentDiv.appendChild(contentSeeders);
    torrentDiv.appendChild(contentEta);
    torrentDiv.appendChild(contentSpeed);
    torrentDiv.appendChild(contentState);
    torrentDiv.appendChild(contentProgress);
    torrentDiv.appendChild(buttonRemove);
    torrentDiv.appendChild(buttonPause);
    maindiv.appendChild(torrentDiv);

}
