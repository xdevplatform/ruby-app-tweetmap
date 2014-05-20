def tw_client
  puts $TWITTER_CONFIG
  Twitter::Streaming::Client.new do |config|
    config.consumer_key        = $TWITTER_CONFIG[:consumer_key]
    config.consumer_secret     = $TWITTER_CONFIG[:consumer_secret]
    config.access_token        = $TWITTER_CONFIG[:access_token]
    config.access_token_secret = $TWITTER_CONFIG[:access_token_secret]
  end
end

def broadcast_tweet(tweet); WebsocketRails[:tweets].trigger('stream', tweet); end

namespace :twitter do

  task :stream => :environment do
    begin
      tw_client.sample do |object|
        if object.is_a?(Twitter::Tweet)
          hash =  object.to_h
          broadcast_tweet hash
        end
      end
    rescue => e
      puts "Rescue in main block: #{e.message}"
      retry
    end
  end

  task :test_stream => :environment do
    test_obj = {
        text: 'this is a test',
        name: 'test'
    }
    while true
      broadcast_tweet test_obj
      sleep 2
    end
  end
end