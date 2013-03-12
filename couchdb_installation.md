
## Installing CouchDB on Ubuntu

Installing CouchDB 1.2.1 on Ubuntu Server Precise 12.04

http://wiki.apache.org/couchdb/Installing_on_Ubuntu

http://mirrors.cnnic.cn/apache/couchdb/1.2.1/apache-couchdb-1.2.1.tar.gz

https://github.com/iriscouch/build-couchdb

https://github.com/iriscouch/build-couchdb#requirements
On Ubuntu and Debian:
sudo apt-get install help2man make gcc zlib1g-dev libssl-dev rake help2man

https://github.com/iriscouch/build-couchdb#getting-the-code
You will need the Git tool. Check out the code and pull in the third-party submodules.
git clone git://github.com/iriscouch/build-couchdb
cd build-couchdb
git submodule init
git submodule update

How to Build CouchDB

Just run Rake.



--- CouchDB on Ubuntu
https://apps.ubuntu.com/cat/applications/couchdb/
This package adds the /etc/init.d/couchdb script



