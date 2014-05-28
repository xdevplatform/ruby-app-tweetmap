sample-ruby-app
=================

Sample Ruby App that consumes and from the [Twitter Streaming API](https://dev.twitter.com/docs/api/streaming),
displaying the data on a map.

REQUIREMENTS
============

To run this app, you will need the following dependencies:

- Ruby >= 2.0.0
- Bundler
- RVM (optional)


GETTING STARTED
============

To configure and run this example, do the following:

- Clone this repo or download the code and unzip

- Go to https://apps.twitter.com/ to generate access tokens for your application. 

- Create a file `config/twitter.yml` and supply your access tokens in this file:

		consumer_key: API_KEY	    
		consumer_secret: API_SECRET  	
		access_token: ACCESS_TOKEN  	
		access_token_secret: ACCESS_TOKEN_SECRET    

- `cd sample-ruby-app`

- `brew link autoconf` (bundle install will tell you to do this if you have not already)

- `bundle install`

- `bundle exec ruby app.rb <ENV>` ENV defaults to development`

- Open [http://localhost:8181/map](http://localhost:8181/map)




