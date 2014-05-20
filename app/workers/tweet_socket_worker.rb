class TweetSocketWorker
  include Sidekiq::Worker

  sidekiq_options unique: :all

  def perform
    Thread.new do
      while true
        broadcast_tweet tweet_queue
        sleep 2
        tweet_queue = []
      end
    end
    p "Streaming"
    stream
  end

  def tw_client
    puts $TWITTER_CONFIG
    Twitter::Streaming::Client.new do |config|
      config.consumer_key        = $TWITTER_CONFIG[:consumer_key]
      config.consumer_secret     = $TWITTER_CONFIG[:consumer_secret]
      config.access_token        = $TWITTER_CONFIG[:access_token]
      config.access_token_secret = $TWITTER_CONFIG[:access_token_secret]
    end
  end

  def broadcast_tweet(tweets)
    p tweets.size
    p tweets
    WebsocketRails[:tweets].trigger('stream', tweets)
  end

  def queue_tweet_for_broadcast(t)
    tweet_queue << t if tweet_queue.size < 10
  end

  def tweet_queue
    @_tweet_queue ||= []
    @_tweet_queue
  end

  def stream
    retry_count = 0
    begin
      tw_client.filter(locations: "-180,-90,180,90") do |object|
        if object.is_a?(Twitter::Tweet)
          hash =  object.to_h
          queue_tweet_for_broadcast hash
          retry_count = 0
        end
      end
    rescue => e
      retry unless e.message.downcase.include? 'Turbo'
      retry_count += 1
      puts "Rescue in main block: #{e.message}"
      puts "\n\nReconnecting in #{retry_count * 10} seconds\n\n"
      sleep (retry_count * 10)
      retry
    end
  end

end