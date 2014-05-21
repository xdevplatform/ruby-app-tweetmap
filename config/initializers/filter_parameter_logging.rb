# Be sure to restart your server when you modify this file.

# Configure sensitive parameters which will be filtered from the log file.
Rails.application.config.filter_parameters += [:password, :consumer_key, :consumer_secret, :access_token, :access_token_secret]
