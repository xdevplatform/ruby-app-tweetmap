require 'json'
require 'eventmachine'
require 'em-websocket'
require 'sinatra/base'
require 'optparse'
require 'tilt/erb'

require_relative 'lib/twitterstream'
require_relative 'lib/configure_logger'

def run(opts)

  $logger.info "Parsing options..."

  options = {}
  OptionParser.new do |opts|
    opts.banner = "Usage: bundle exec ruby app.rb [options]"

    opts.separator ""
    opts.separator "Available options:"

    options[:server] = 'thin'
    opts.on("-s", "--server SERVER", "Server to run") do |v|
      options[:server] = v
    end

    options[:host] = '0.0.0.0'
    opts.on("-h", "--host HOST", "Host to run on") do |v|
      options[:host] = v
    end

    options[:port] = '8181'
    opts.on("-p N", "--port PORT", Integer, "Server port") do |v|
      options[:port] = v
    end

    opts.on("-h", "--help", "Show this message") do
      puts opts
      exit
    end

  end.parse!

  $logger.info "Starting websocket server"
  EM.run do
    clients = []

    stream = TwitterStream.new
    stream.ontweet { |tweet|
      clients.each { |client|
        client.send tweet.to_json
      }
    }

    EM::WebSocket.run(:host => "0.0.0.0", :port => 8080) do |ws|
      ws.onopen { |handshake|
        $logger.info "WebSocket connection open"
        clients << ws
        $logger.info "#{clients.size} clients connected"
      }

      ws.onclose {
        $logger.info "Websocket connection closed"
        clients.delete ws
      }

      ws.onerror { |error|
        if error.kind_of?(EM::WebSocket::WebSocketError)
          $logger.error "Error occured on websocket " + error
        end
      }
    end

    unless ['thin', 'hatetepe', 'goliath'].include? options[:server]
      raise "Need an EM webserver, but #{options[:server]} isn't"
    end

    Rack::Server.start({
                           app: MapApp,
                           server: options[:server],
                           Host: options[:host],
                           Port: options[:port]
                       })

  end
end

class MapApp < Sinatra::Base

  configure do
    set :threaded, false
  end

  get '/' do
    redirect to('/map')
  end

  get '/map' do
    $logger.info "Serving incoming request from #{@request.ip}"
    erb :map
  end

  not_found do
    status 404
    send_file File.join(settings.public_folder, '404.html')
  end

end

$logger.info "Starting application"

run app: MapApp.new
