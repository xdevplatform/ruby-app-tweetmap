require 'json'
require 'eventmachine'
require 'em-websocket'
require 'sinatra/base'
require './config/twitter.rb'
require './lib/tweet_socket_worker'

def run(opts)

  EM.run do
    clients = []
    EM::WebSocket.run(:host => "0.0.0.0", :port => 8080) do |ws|
      ws.onopen {
        puts "WebSocket connection open"
        clients << ws
      }

      ws.onclose {
        puts "Websocket connection closed"
        clients.delete ws
      }
    end

    stream = TwitterStream.new
    stream.ontweet { |tweet|
      clients.each { |client|
        client.send tweet.to_json
      }
    }

    server = opts[:server] || 'thin'
    host = opts[:host] || '0.0.0.0'
    port = opts[:port] || '8181'

    unless ['thin', 'hatetepe', 'goliath'].include? server
      raise "Need an EM webserver, but #{server} isn't"
    end

    Rack::Server.start({
                           app: MapApp,
                           server: server,
                           Host: host,
                           Port: port
                       })

  end
end

class MapApp < Sinatra::Base

  configure do
    set :threaded, false
  end

  get '/map' do
    erb :index
  end
end

run app: MapApp.new