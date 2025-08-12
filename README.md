# VideoCupboard Install Guide

This basic full stack web app allows you to upload your open mp3/mp4's for anyone on the local network to watch and, with some port forwarding, the greater world.

## Deployment

You have two options 

### Option 1

You can download directly from the main, which will get you all the code.
You get it running from here, you will need to npm install.

Then add a .env; here is a template
```bash
IP=
DB_IP=
DB_NAME=
PORT=
USER=root
PASSWORD=
STORAGE_DIR= //the location of the /videos/ dir
```

Then run main.js.
You can either set up ur own DB or install MariaDB and use the provided SQL file

I like pm2 for the deployment, so you don't need a tab open, but to each their own.

### Extras

If you want to cast, you will need to tunnel so the cupboard is hosted on HTTPS. 
I've used tailscale, and it works pretty well.
To get this to work, you will need to change the IP in your .ENV to reflect the new URL.

The Watch together feature will need to have additional ports freed up as it uses dedicated websockets to work.
