require 'eventmachine'
require 'em-websocket'
require 'sinatra/base'
require 'thin'
require './lib/tweet_socket_worker'

def run(opts)

  EM.run do
    server = opts[:server] || 'thin'
    host = opts[:host] || '0.0.0.0'
    port = opts[:port] || '8181'
    web_app = opts[:app]

    dispatch = Rack::Builder.app do
      map '/' do
        run web_app
      end
    end

    unless ['thin', 'hatetepe', 'goliath'].include? server
      raise "Need an EM webserver, but #{server} isn't"
    end

    Rack::Server.start({
                           app: dispatch,
                           server: server,
                           Host: host,
                           Port: port
                       })

    tweet_socket_worker = TweetSocketWorker.new
    tweet_socket_worker.stream
  end
end

class MapApp < Sinatra::Base

  configure do
    set :threaded, false
  end

  get '/map' do
    erb :index
  end

  get '/tweets.json' do
    content_type :json
    TweetQueue.pop.to_json
  end

end

run app: MapApp.new