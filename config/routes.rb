Rails.application.routes.draw do
  # Sidekiq
  require 'sidekiq/web'
  mount Sidekiq::Web => '/sidekiq'

  resources :tweets
end
