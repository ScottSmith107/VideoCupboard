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
        if (data == "Fails."){
            document.getElementById("error").innerText = "Failed to connect to QBIT client";
        }else if(data == "Your IP address has been banned after too many failed authentication attempts."){
            document.getElementById("error").innerText = data;
        }
    })
    .catch(error => {
        console.error("couldnt reach torrent client", error);
    });
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
            console.log("search results");
            console.log(data);
            
            data.forEach(item => {
                if(item.seeders != 0){
                    makeWidget(item.fileName, item.magnetUrl, item.seeders);
                }
            });
            
        })
    .catch(error => {
        console.error("couldnt reach torrent client", error);
    });

}

//displays each entry
function makeWidget(name, magnet, seeders){
    const main = document.getElementById("searchResults");

    const div = document.createElement("div");
    div.className ="torrent";

    const contentP = document.createElement("p");
    contentP.className = "name"; 
    contentP.innerText = name;
    contentP.id = magnet;
    
    const contentS = document.createElement("p");
    contentS.className = "seeders"; 
    contentS.innerText = "seeders: " , seeders;
    contentS.id = magnet;

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
    div.appendChild(button);
    main.appendChild(div);
}

//list all 
listQuery => function(response){
    console.log(response);

}

// get updates on torrents
// get an update on currently downloading torrents every 10 secounds 
function getUpdate(){


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