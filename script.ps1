# if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) { Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs; exit }

$mypath = $MyInvocation.MyCommand.Path
$out = Split-Path $mypath -Parent -Resolve
Write-Output "Path of the script : $out"

Set-Location $out

# getting params from the config File
$csvData = Import-Csv -Path .\config.csv
$User = $csvData.user
$Password = $csvData.password
$Port = $csvData.port
Write-Host "Username: $user"
Write-Host "Password: $Password"
Write-Host "Port: $Port"

#check mariaDB add db
#           need to change get-content so we are in the right place
Set-Location "C:\Program Files\MariaDB 11.7\bin"
./mariadb -u $User -p"$Password" -e "CREATE DATABASE movieserver;"
Get-Content "$out\movieserver.sql" | ./mariadb -u $User -p"$Password" -D movieserver
./mysql -u $User -p"$Password" -D movieserver  -e "SHOW TABLES;"
./mysql -u $User -p"$Password" -D movieserver  -e "select * from user;"

# install pm2
$Output = npm list -g pm2
if($Output -like "*pm2*"){
    Write-Host "pm2 is installed"
}else{
    Write-Host "installing pm2 . . ."
    npm install -g pm2
}

Set-Location $out

# getting app ready
npm install ./movieserver-1.0.0.tgz

Set-Location $out'\node_modules\movieserver'

# get the hostname
$HostIP = (
    Get-NetIPConfiguration |
    Where-Object {
        $_.IPv4DefaultGateway -ne $null -and
        $_.NetAdapter.Status -ne "Disconnected"
    }
).IPv4Address.IPAddress

# configure .env file
New-Item -Path . -Name ".env" -ItemType "file" -Value "
        IP=$HostIP
        DB_IP=localhost
        DB_NAME=movieserver
        PORT=$Port
        USER=root
        PASSWORD=$Password     "

# running app
pm2 start main.js
    
