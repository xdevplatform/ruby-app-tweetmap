require 'yaml'

twitter_config = File.join(__dir__, 'twitter.yml')
$TWITTER_CONFIG  = YAML::load_file(twitter_config)[(ENV['RACK_ENV'] || :development).to_s]