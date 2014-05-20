twitter_config_path = File.join Rails.root, 'config', 'twitter.yml'
$TWITTER_CONFIG = YAML.load_file(twitter_config_path)[Rails.env].symbolize_keys
