require 'thread'
require 'twitter'

class TweetQueue
  @tweet_queue = Queue.new

  def self.push data
    @tweet_queue.push data
  end

  def self.pop
    @tweet_queue.pop
  end

end

class TweetSocketWorker

  def initialize
    @tweet_queue = Queue.new
    @clients = []
  end

  def retrieve_data
    @tweet_queue.pop.to_json
  end

  def work
    Thread.new do
      while true
        @clients.each do |client|
          client.send @tweet_queue.pop.to_json
        end
        sleep 2
      end
    end
    stream
  end

  def register_client client
    @clients << client
  end

  def remove_client client
    @clients.delete client
  end

  def tw_client
    Twitter::Streaming::Client.new do |config|
      config.consumer_key = "anmMaSX0JxdpsPVgVh4ILUL2Q" #$TWITTER_CONFIG[:consumer_key]
      config.consumer_secret = "YqCUzKYMfAPALs9LvnbkqyZD8uz7vSMfujpJbX8RiN6Yth8wJv" #$TWITTER_CONFIG[:consumer_secret]
      config.access_token = "99428558-DeQx0ViftBnzWDBfcxcO84RwpkRVytjVGHY4CZJQZ" #$TWITTER_CONFIG[:access_token]
      config.access_token_secret = "LYgSOdXONheOaGXkDezSPHeg5GKYcyMv3YlDfZiTT49i7" #$TWITTER_CONFIG[:access_token_secret]
    end
  end

  def queue_tweet_for_broadcast(t)
    tweet_queue << t if tweet_queue.size < 10
  end

  def stream
    Thread.new do
      retry_count = 0
      begin
        tw_client.filter(locations: "-180,-90,180,90") do |object|
          if object.is_a?(Twitter::Tweet)
            hash = object.to_h
            # @tweet_queue.push hash
            TweetQueue.push hash
            retry_count = 0
            sleep(1/100)
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