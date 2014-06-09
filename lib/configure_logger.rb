require 'logger'

log_file = File.open("./log/app.log", 'w')
log_file.sync = true
$logger = Logger.new log_file
$logger.level = Logger::INFO