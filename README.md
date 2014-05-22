sample-rails-app
=================

Sample Rails App to consume and display the Twitter public API. Uses Websockets to push to the client.

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

- `bundle install`

- `ruby app.rb`

- Open [http://localhost:8181/tweets](http://localhost:8181/tweets)




