let url = IP;

// logon???
function logon(){
    // const username = document.getElementById("username").value; 
    const password = document.getElementById("password").value; 

    const formData = new FormData();
    formData.append("password",password);
    
    fetch(url+"logon", {
    method: "POST",
    body: formData,
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        location.replace("index.html?token="+data);
    })
    .catch(error => {
    console.error("couldnt make connection to database", error);
    }); 
}