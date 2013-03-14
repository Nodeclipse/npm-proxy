[npm-proxy](https://github.com/PaulVI/npm-proxy/)

# NPM Proxy Server ( NPS ? )

Proxy for [Node.js](http://www.nodejs.org/) [NPM](https://npmjs.org/doc/README.html) [registry](https://npmjs.org) repository.

## Dictionary

[**Repository**](http://en.wikipedia.org/wiki/Software_repository) is [CouchDB](http://couchdb.apache.org/) database that contains Nodejs modules/packages.  
**Registry** is main repository.  
[**Proxy**](http://en.wikipedia.org/wiki/Proxy_server) is software that acts as an intermediary for requests from clients seeking resources from other servers.  
**Clone** is a copy of Registry.   
**Mirror** repository is synchronized with Registry using CouchDB Replication feature.  
[**Cached**](http://en.wikipedia.org/wiki/Cache_%28computing%29) repository is updated from other repository (e.g. Registry) on per request basis.  

## Problem addressed

Registry as on March 11th 2013 is 36G of data in 25k projects. (Just navigate to <code>https://registry.npmjs.org/</code>)  
Most development team don't need 99% of those packages, but quick & reliable access to those being used. 
Current [recommendation to speed up access](https://github.com/isaacs/npm/blob/master/doc/cli/registry.md#can-i-run-my-own-private-registry) 
is clone Registry into new Repository (using continuous replication).  
On slow channels replication can't be finished within one session / one attempt. 
But the most important is that every such attempt makes Registry even slower, as ongoing replication creates additional pressure on Registry server 
and uses the same slow channel.

## Status 

This is work in progress. (Version 0.0.6)
Now it is just ideas, some materials and occasionally failing code.. 

Please contact Paul Verest via skype <code>pverest</code>, email ![email](public/weibl-funshion-com2.PNG) or call <code>+86 187 01029146</code>, if you are interested.

## Usage

If you want only to use it, then bookmark (Ctrl+D) and/or star it now and return in June 2013.

0. Install [CouchDB server](http://couchdb.apache.org/#download).
	There is quick installer for Windows since version 1.2  
	For Linux [Apache CouchDB wiki](http://wiki.apache.org/couchdb/Installing_on_Ubuntu) suggest to use [build-couchdb](https://github.com/iriscouch/build-couchdb)
1. Install NPM-Proxy server (this).
	- [ ] <code>npm install npm-proxy</code> // Help on this needed!
	- (Optionally) configure server URL, port, databases etc. (Defaults are http://localhost:6084/cached/, )
2. Run via <code>node npm-proxy.js</code>		
2. Point npm to use NPM-Proxy server:  
	<code>npm config list</code>  
	<code>npm config set registry=http://localhost:6084/cached/</code>
	(Later you can use <code>npm config del registry</code> to reset to default)  
	or  
	Use the <code>--registry</code> option every time:  
	<code>npm --registry http://localhost:6084/cached/ install packagename</code> 
	
Now your npm requests go through npm-proxy.	

## Developing

0. Please [contact](#status) first. Notes are not full. I present what I know with pleasure.
1. There is '.project.example.xml' file with example how to configure comfy link in Eclise IDE.   
1. Start CouchDB.  
	GUI environment (like Windows) is recommended. Run 'couchdb.bat' to launch also Erlang emulator, where you can track requests to CouchDB.  
![Erlang_emulator](public/Erlang_emulator.png)
2. CouchDB Futon UI can be useful <code>http://localhost:5984/_utils/index.html</code>
2. main file is 'npm-proxy.js'. Run it with 'node npm-proxy.js' or via start-npm-proxy.bat.

### Ideas

* Use CouachApp to run app (http://couchapp.org/page/index)
 
* use Most Depended-upon Packages list https://npmjs.org/browse/depended  
[CouchDB: Is it possible to control order of replication?](http://stackoverflow.com/questions/15285520/couchdb-is-it-possible-to-control-order-of-replication)

* [add your idea]
 