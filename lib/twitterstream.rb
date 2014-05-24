require 'thread'
require 'twitter'

class TwitterStream

  def initialize
    @callbacks = []
    stream
  end

  def tw_client
    Twitter::Streaming::Client.new do |config|
      config.consumer_key = $TWITTER_CONFIG["consumer_key"]
      config.consumer_secret = $TWITTER_CONFIG["consumer_secret"]
      config.access_token = $TWITTER_CONFIG["access_token"]
      config.access_token_secret = $TWITTER_CONFIG["access_token_secret"]
    end
  end

  def ontweet(&block)
    @callbacks << block
  end

  def filter bounds
    @filter_bounds = bounds
  end

  def stream
    puts "Making connection to streaming Twitter API..."
    Thread.new do
      retry_count = 0
      begin
        @filter_bounds = "-180,-90,180,90"
        tw_client.filter(locations: @filter_bounds) do |object|
          if object.is_a?(Twitter::Tweet)
            @callbacks.each { |c| c.call(object.to_h) }
            retry_count = 0
          end
        end
      rescue => e
        retry_count += 1
        puts "Error connecting to stream: #{e.message}"
        retry_delay = retry_count * 5
        puts "Reconnecting in #{retry_delay} seconds\n"
        sleep retry_delay
        retry
      end
    end
  end
end