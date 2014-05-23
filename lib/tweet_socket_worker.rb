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

  def stream
    Thread.new do
      retry_count = 0
      begin
        tw_client.filter(locations: "-180,-90,180,90") do |object|
          if object.is_a?(Twitter::Tweet)
            @callbacks.each { |c| c.call(object.to_h) }
            retry_count = 0
          end
        end
      rescue => e
        retry unless e.message.downcase.include? 'Turbo'
        retry_count += 1
        puts "Rescue in main block: #{e.message}"
        puts "\n\nReconnecting in #{retry_count * 10} seconds\n\n"
        sleep 2
        retry
      end
    end
  end
end