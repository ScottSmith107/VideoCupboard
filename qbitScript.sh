#!/bin/bash

name="$1"
hash="$2"
path="$3"

echo "Triggered: $name $hash $path" >> /tmp/torrent.log

curl -G "https://www.scottsmith.co.nz/torrentFinished" \
  --data-urlencode "name=$name" \
  --data-urlencode "hash=$hash" \
  --data-urlencode "path=$path"
