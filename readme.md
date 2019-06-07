avatar art created from https://www.pixilart.com/draw


## Overview:

When a song link like https://open.spotify.com/track/5L7EXyTTHGUPUBTicr4do2?si=DbPsY-OGQti7EWpdd4soJQ
is posted to a groupchat that the bot is registered with, the id of the track is extracted from
the url using regex (in this case the id is "5L7EXyTTHGUPUBTicr4do2") and then uses the
spotify api to add the song to a playlist I created. Look at ./src/server.js



## Problems:

1. Whenever the dyno was cycled (every 24 hours), the instance restarts, causing my

refresh token from logging into the spotify api to be lost. This makes the bot stops working. I needed to find a way to store the token somewhere, and I looked/tried many services:

- Firebase's Cloud Firestore and Google Docs API
  - requires a file to log in, not available to do on heroku
- Heroku's mongoose db mlab add-on
  - Confusing, feels like a lot of extra work, `db.once('open', function callback() {` seems like it has to wrap everything, and I'm not sure how I feel
  - Confusing, feels like a lot of extra work, `db.once('open', function callback() {` seems like it has to wrap everything, and I'm not sure how I feelbout hosting an api inside an event function
- Heroku's Redis add-on
  - Database gets cleared whenever the instance restarts/dyno cycles


Eventually I found the Heroku Postgres add-on (https://www.heroku.com/postgres) where I
have a single database with a single table with a single column of type `TEXT` with
a single row that stores my refresh token. Yay! Now I don't have to log in everytime the
instance restarts!



2. The free tier of Heroku makes the app sleep for 18 hours a day. I upgraded to the
hobby tier ($7 a month) so it can be available 24/7. It also comes with the Postgres add on.
