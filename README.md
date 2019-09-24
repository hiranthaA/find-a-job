This simple web application is implemented using ReactJS.

## Running FrontEnd

To run the front end application
  1) Inside the folder open a command prompt or any other terminal.
  2) run command `npm install` to install all the dependancies.
  3) run command `npm start` to start the frontend server.
  
The server will be running on port 3000. Allthough you can run the frontend on different port, Since I have given Redirect URI as `http://localhost:3000/auth/linkedin/callback` in my LinkedIn app, the server should be running on port 3000.

## Running Backend

This is a backend proxy server which will be running on port 2000.
 1) Go inside the `proxy-server` folder and open a command prompt or any other terminal.
 2) run command `npm install` to install the dependancies.
 3) run command `node server.js` to start the proxy server.
 
## You are now fully setup. 
