# Project Title

This basic full stack web app allows you to upload your open mp3/mp4's for anyone on the local network to watch and, with some port forwarding the greater world.

## Deployment

You have two options 

### Option 1

You can download directly from the main, which will get you all the code.
You get it running from here you will need to npm install.

Then add a .env; here is a template
```bash
IP=
DB_IP=
DB_NAME=
PORT=
USER=root
PASSWORD= 
```

You can either set up ur own DB or install MariaDB and use the provided SQL file

I like pm2 for the deployment, so you don't need a tab open, but to each their own.

### Option 2

1. You will need to have npm, node.js, and MariaDB already installed for this method or else the installer will fail. 

2. For this option, you can go to the installer branch.
I have elected to exclude my scripts from that installer, so you may see what the installer and the powershell script will be doing before running it.

3. Once installed, all you need to do is run the mysetup.exe and give it some creds so it can add the SQL file to your mariaDB and then the port that the db is hosted on.

4. Then you will be able to see the app running on https://localhost:3000/ or https://YOUR_IPV4:3000/
