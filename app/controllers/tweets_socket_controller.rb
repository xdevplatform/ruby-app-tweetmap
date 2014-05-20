class TweetsSocketController < WebsocketRails::BaseController

  def initialize_session
    controller_store[:message_count] = 0
  end

  def stream_tweets

  end

end
