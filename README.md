sample-ruby-app
=================

Sample Ruby App to consume and display the Twitter public API. Uses Websockets to push to the client.

REQUIREMENTS
============

To run this sample code, you'll need to install the following libraries:

- Ruby >= 2.0.0
- RVM (optional)
- Bundler


GETTING STARTED
============

To configure and run this example, you'll need to do the following:

- Clone this repo

- Generate access tokens for your application at https://apps.twitter.com/

- Create a file `config/twitter.yml` and supply your access tokens in this file:

		consumer_key: API_KEY	    
		consumer_secret: API_SECRET  	
		access_token: ACCESS_TOKEN  	
		access_token_secret: ACCESS_TOKEN_SECRET    

- `cd <project_root>`

- `brew link autoconf` (bundle install will tell you to do this if you have not already)

- `bundle install`

- `bundle exec ruby app.rb <ENV>` #ENV defaults to development`

- Open [http://localhost:8181/map](http://localhost:8181/map)




