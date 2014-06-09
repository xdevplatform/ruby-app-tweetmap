sample-ruby-app
=================

Sample Ruby App that consumes and from the [Twitter Streaming API](https://dev.twitter.com/docs/api/streaming),
displaying the data on a map and streaming the tweets in a pauseable timeline.

Demo
============

Check out a live demo of the app here: http://twitterdevdemo.com/map

### Censor Stream Query Param

Append `?censor=true` to attempt filtering out obscene tweets from the stream (no guarantees!).

Requirements
============

To run this app, you will need the following dependencies:

- Ruby >= 2.0.0
- Bundler
- RVM (optional)


Getting Started
============

To configure and run this example, do the following:

- Go to https://apps.twitter.com/ to generate access tokens for your application, any application built on the twitter API requires authentication tokens. 

- Clone this repo or download the code and unzip

- `cd sample-ruby-app`

- Create a file `config/twitter.yml` and supply your access tokens in this file. You could copy `config/example.twitter.yml` and simply fill it in with your access tokens:

 `cp config/example.twitter.yml config/twitter.yml`
 
```
    development:
      #API key/secret
      consumer_key: API_KEY
      consumer_secret: API_SECRET
      #Access token/secret
      access_token: ACCESS_TOKEN
      access_token_secret: ACCESS_TOKEN_SECRET
```

- If on OSX and using homebrew, you may need `brew link autoconf` if it has not been linked already

- `bundle install`

- `bundle exec ruby app.rb [OPTIONS]`

- Open [http://localhost:8181/map](http://localhost:8181/map)

### Options


```    
    Available options:
        -s, --server SERVER              Server to run
            --host HOST                  Host to run on
        -p, --port PORT                  Server port
        -h, --help                       Show this message
```

