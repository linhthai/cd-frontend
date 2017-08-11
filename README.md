# cd-frontend
To run Project you will need a node installed in your environment.
> node version 8.2.1 

Next you will need to install gulp
> npm install -g gulp

Next you will need to install bower
> npm install -g bower

Run those commands to get all dependencies:
> npm install
> bower install

Here are few main task that you can do:

* ```gulp``` or ```gulp build``` to build an optimized version of your application in /dist
* ````gulp serve```` to launch a browser sync server on your source files
* ```gulp serve:dist``` to launch a server on your optimized application
* ```gulp test``` to launch your unit tests with Karma
* ```gulp test:auto``` to launch your unit tests with Karma in watch mode
* ```gulp protractor``` to launch your e2e tests with Protractor
* ```gulp protractor:dist``` to launch your e2e tests with Protractor on the dist files
In bower.js file there are specify needed resources for Seed Project.
