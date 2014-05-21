sample-rails-app
=================

Sample Rails App to consume and display the Twitter public API. Uses Websockets to push to the client.

REQUIREMENTS
============

To run this sample code, you'll need to install the following libraries:

- Ruby >= 2.0.0
- RVM (optional)
- Bundler
- Redis

####Installing Redis
You can install redis on Mac OSX using [homebrew](http://brew.sh/) simply with.

	brew install redis

Platform independent instructions on installing redis can be found here.
- http://redis.io/topics/quickstart

####Dependency Notes
You need the latest XCode command line tools to compile the websockets dependency. 
You can do so with the following command:

	xcode-select --install
  
Also, if you need to link to gcc on your computer, you can do the following:

	ln -s /usr/bin/gcc /usr/bin/gcc-4.2
  
For more information, please read the following resources: 

- [Github: cannot install on osx 10.9](https://github.com/faye/websocket-driver-ruby/issues/11)
- [stackoverflow: OS X Mountain Lion: gcc-4.2 No such file or directory](http://stackoverflow.com/questions/12256616/os-x-mountain-lion-gcc-4-2-no-such-file-or-directory)


GETTING STARTED
============

On the command line, run the following from the project root directory:

- `bundle install`
- `foreman start`
- open [http://localhost:3000/tweets](http://localhost:3000/tweets)




