Live on http://cool-new-sounds-bot.herokuapp.com/

## Overview:

When a song link like https://open.spotify.com/track/5L7EXyTTHGUPUBTicr4do2?si=DbPsY-OGQti7EWpdd4soJQ
is posted to a groupchat that the bot is registered with, the id of the track is extracted from
the url using regex (in this case the id is "5L7EXyTTHGUPUBTicr4do2") and then uses the
spotify api to add the song to a playlist I created. Soundcloud links just get added to a database. Look at ./src/server.js



## Problems:

1. Whenever the dyno was cycled (every 24 hours), the instance restarts, causing my
refresh token from logging into the spotify api to be lost. This makes the bot stops working. I needed to find a way to store the token somewhere, and I looked/tried many services:

- Firebase's Cloud Firestore and Google Docs API
  - requires a file to log in, not available to do on heroku
- Heroku's mongoose db mlab add-on
  - Confusing, feels like a lot of extra work, `db.once('open', function callback() {` seems like it has to wrap everything, and I'm not sure how I feelbout hosting an api inside an event callback
- Heroku's Redis add-on
  - Database gets cleared whenever the instance restarts/dyno cycles


Eventually I found the *Heroku Postgres* add-on (https://www.heroku.com/postgres) where I
have a single database with a single table with a single column of type `TEXT` with
a single row that stores my refresh token. Yay! Now I don't have to log in everytime the
instance restarts!


2. The free tier of Heroku makes the app sleep for 18 hours a day. I upgraded to the
hobby tier ($7 a month) so it can be available 24/7. It also comes with the Postgres add on.


3. Getting everything to start up on the same terminal is a thing I've never had to deal with before. Normally I just run the server and the
app on 2 different terminals.

- When heroku runs `npm install` it only installs from the top level package.json's dependencies.
  - All I had to do to fix this was call `npm install ./app` ONCE in my terminal to add the directories dependencies to the top level's. Very nifty.
- How was I supposed to run the react app and the node.js server at the same time? I always had them run on 2 terminals because I thought that the React app build process was a dynamic thing that required a script run to serve the app. **WRONG**
  - I made a build script `"build": "npm run build --prefix ./app",` which runs `npm build` on the `./app` directory. This creates the `./app/build` directory. That directory is served from my node server (!!!) using `app.use(express.static("./app/build"))` so I can route all routes to any file in there that I wish.

## Future Plans

1. I'm not trying to pay $7 a month forever, especially for an app that receives less than 5 requests a day. I'm on the lookout for another storage servce where I can just store my little 16 digit refresh token. Maybe aws? Why are the implementations so hard to set up for these :(

2. I want to expand this so that other people can sign up, put in their groupme bot id and spotify playlist, and use it in their own song groups.

3. Once soundcloud allows bot applications I'm going to implement one

## Creds

1. avatar art created from https://www.pixilart.com/draw
