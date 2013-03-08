# NPM Proxy Server ( NPS ? )

Proxy for [Node.js](http://www.nodejs.org/) [NPM](https://npmjs.org/doc/README.html) [registry](https://npmjs.org) repository.

## Intro

[**Repository**](http://en.wikipedia.org/wiki/Software_repository) is [CouchDB](http://couchdb.apache.org/) database that contains Nodejs modules/packages.  
**Registry** is main repository.  
[**Proxy**](http://en.wikipedia.org/wiki/Proxy_server) is software that acts as an intermediary for requests from clients seeking resources from other servers.  
**Mirror** repository is synchronized with Registry using CouchDB Replication feature.  
[**Cached**](http://en.wikipedia.org/wiki/Cache_%28computing%29) repository is updated from other repository (e.g. Registry) on per request basis.  

## Status 

This is work in progress. (Version 0.0.6)
Now it is just ideas and some materials.. 

Please contact Paul Verest via skype pverest or call '+86 187 01029146' if you are interested in discussing or developing.

## Usage

If you want only to use it, then bookmark (Ctrl+D) and/or star it now and return in June 2013.

0. Install [CouchDB server](http://couchdb.apache.org/#download).
	There is quick installer for Windows since version 1.2  
	For Linux [Apache CouchDB wiki](http://wiki.apache.org/couchdb/Installing_on_Ubuntu) suggest to use [build-couchdb](https://github.com/iriscouch/build-couchdb)
1. Install NPM-Proxy server (this).
	- [ ] <code>npm install npm-proxy</code> // Help on this needed!
	- (Optionally) configure server URL, port, databases etc. (Defaults are http://localhost:6084/cached/, )	
2. Point npm to use NPM-Proxy server.  
	<code>npm config list</code>  
	<code>npm config set registry=http://localhost:6084/cached/</code>
	
Now your npm requests go through npm-proxy.	

## Developing

0. Please contact first. Notes are not full.
1. There is '.project.example.xml' file with example how to configure comfy link in Eclise IDE.   
1. Start CouchDB.  
	GUI environment (like Windows) is recommended. Run 'couchdb.bat' to launch also Erlang emulator, where you can track requests to CouchDB.  
![Erlang_emulator](public/Erlang_emulator.png)
2. main file is 'npm-proxy.js'. Run it with 'node npm-proxy.js' or via start-npm-proxy.bat.

### Ideas

* Use CouachApp to run app (http://couchapp.org/page/index)
 
* use Most Depended-upon Packages list https://npmjs.org/browse/depended

* [add your idea]
 