# Where's My Stuff???
Web App Companion for Where's My Stuff Android Application

Features:
------
- Ability to post lost and found items for other users to see
- Ability to post doantion requests and ability to offer donations for other users

Known Issues:
-------
- There is no restriction on who is allowed to register as an administrator, which could be subject to abuse
- There is no system in place to prevent a user from redirecting themselves to a user account without properly logging in by typing in the name of the html page they would like to visit
- A user can register with a fake email as long as it is properly formated (in the future email confirmation will be enabled)

Installation:
-------
This application uses multiple CDNs and an external Firebase database, so internet access is required to run the application

Starting the application:
-------
Open home.html in a web browser which acn be found at "root/html/home.html"


Logging in to the application:
-------
Our application uses Firebase Authentification and Firebase Realtime Database to store user information, so a valid email is required to register for the appliaction, and internet access is required at all time to mainitan conection to the database.

