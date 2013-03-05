# CouchDB notes

http://isaacs.iriscouch.com/registry
http://registry.npmjs.org:5984/registry
http://registry.npmjs.org
https://registry.npmjs.org
http://isaacs.ic.ht/registry (said on https://github.com/isaacs/npmjs.org#installing)



## Replication 

http://guide.couchdb.org/draft/replication.html

> Each replication request is assigned a session_id, which is just a UUID; you can also talk about a replication session identified by this ID.

> The next bit is the replication history. CouchDB maintains a list of history sessions for future reference. The history array is currently capped at 50 entries.

### Continuous Replications

http://guide.couchdb.org/draft/replication.html#continuous
At the time of writing, CouchDB doesn’t remember continuous replications over a server restart.



## http://wiki.apache.org/couchdb/Replication
### New features introduced in CouchDB 1.2.0

CouchDB 1.2 ships with a new replicator implementation.

TODO
http://wiki.apache.org/couchdb/Replication
http://wiki.apache.org/couchdb/How_to_replicate_a_database  

Command list
/_active_tasks
/_utils
/_design/

---


Replicate only desired packages:

'curl -X POST -H "Content-Type:application/json" http://192.168.56.101:5984/_replicate -d '{"source":"http://isaacs.iriscouch.com/registry/", "target":"registry", "doc_ids":["testmod","underscore","mongodb"]}'' 

/_replicate -d '{"source":"http://isaacs.iriscouch.com/registry/", "target":"registry", "doc_ids":["testmod","underscore","mongodb"]}'


## registry database 

UI is https://npmjs.org/

DB is at http://isaacs.iriscouch.com/registry
 
http://isaacs.iriscouch.com/_utils/database.html?registry

1 project is 1 couchdb doc. Example [10tcl](https://npmjs.org/package/10tcl)

http://isaacs.iriscouch.com/_utils/document.html?registry/10tcl
http://isaacs.iriscouch.com/registry/10tcl