# Group Chat With Postgresql and React. 

![screenshot 1](https://github.com/OrangeDev22/project-group-chat-app/blob/main/screenshots/screenshot__4.JPG?raw=true)

# How to set up this project

first open your terminal in the client and server folders then in each one execute 

``` npm install ```

Create a postgresql database using the .sql file inside the server folder.

Add the next variables to your server enviroment. 

```
DB_USER=*YOUR DATABASE USER*
DB_PASSWORD=*YOUR USER PASSWORD*
DB_HOST=localhost
DB_PORT=*YOUR POSTGRESQL PORT"
DB_DATABASE=groupchat

SESSION_SECRET=secret
```
now in the server folder execute: 

``` npm run dev ```

and inside the client server:

``` npm start ```

#### you can use this code however you like. 
