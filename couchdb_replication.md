# CouchDB Replication

## Questions
Is it possible to set order for database replication?	
http://stackoverflow.com/questions/15285520/couchdb-is-it-possible-to-control-order-of-replication

## Examples
	curl -X POST -H "Content-Type:application/json" http://localhost:5984/_replicate -d '{"source":"http://isaacs.iriscouch.com/registry/", "target":"registry"}'
	
	curl -X POST 'http://localhost:5984/_replicate' -H 'Content-Type: application/json' -d '{"doc_ids": [ "coffee-script", "nodeunit", "npm" ], "source": "http://registry.npmjs.org:5984/registry", "target": "registry", "create_target": true}
	
	
	curl -X POST http://localhost:5984/_replicate -d '{"source":"http://isaacs.iriscouch.com/registry/", "target":"registry"}' -H "Content-Type:application/json" 
	

### Successful:	

	curl -X PUT http://localhost:5984/registry01
	curl -X POST http://localhost:5984/_replicate -d '{"source":"http://isaacs.iriscouch.com/registry/", "target":"registry01"}' -H "Content-Type:application/json"
	
	
	
## Replicate only desired packages	

$ curl -X POST -H "Content-Type:application/json" http://localhost:5984/_replicate -d '{"source":"http://isaacs.iriscouch.com/registry/", "target":"repo1", "doc_ids":["0"]}'

{
    "ok": true,
    "session_id": "f7036ff3fc3fb2f135fefba793149e2d",
    "source_last_seq": 355928,
    "replication_id_version": 2,
    "start_time": "Wed, 27 Feb 2013 09:00:55 GMT",
    "end_time": "Wed, 27 Feb 2013 09:00:58 GMT",
    "docs_read": 1,
    "docs_written": 1,
    "doc_write_failures": 0,
    "history": [{
        "session_id": "f7036ff3fc3fb2f135fefba793149e2d",
        "start_time": "Wed, 27 Feb 2013 09:00:55 GMT",
        "end_time": "Wed, 27 Feb 2013 09:00:58 GMT",
        "start_last_seq": 0,
        "end_last_seq": 355928,
        "recorded_seq": 355928,
        "missing_checked": 1,
        "missing_found": 1,
        "docs_read": 1,
        "docs_written": 1,
        "doc_write_failures": 0
    }]
}

$ curl -X POST -H "Content-Type:application/json" http://localhost:5984/_replicate -d '{"source":"http://isaacs.iriscouch.com/registry/", "target":"repo1", "doc_ids":["0"]}'

{"ok":true,"no_changes":true,"session_id":"f7036ff3fc3fb2f135fefba793149e2d","source_last_seq":35592
8,"replication_id_version":2,"start_time":"Wed, 27 Feb 2013 09:00:55 GMT","end_time":"Wed, 27 Feb 20
13 09:00:58 GMT","docs_read":1,"docs_written":1,"doc_write_failures":0,"history":[{"session_id":"f70
36ff3fc3fb2f135fefba793149e2d","start_time":"Wed, 27 Feb 2013 09:00:55 GMT","end_time":"Wed, 27 Feb
2013 09:00:58 GMT","start_last_seq":0,"end_last_seq":355928,"recorded_seq":355928,"missing_checked":
1,"missing_found":1,"docs_read":1,"docs_written":1,"doc_write_failures":0}]}

## npm install 0

D:\TEMP\npm-test1>npm install 0
npm http GET http://localhost:5984/repo1/0
npm http 200 http://localhost:5984/repo1/0
npm ERR! Error: No compatible version found: 0
npm ERR! No valid targets found.
npm ERR! Perhaps not compatible with your version of node?
npm ERR!     at installTargetsError (C:\Program Files\nodejs\node_modules\npm\li
b\cache.js:563:10)
npm ERR!     at next (C:\Program Files\nodejs\node_modules\npm\lib\cache.js:542:
17)
npm ERR!     at C:\Program Files\nodejs\node_modules\npm\lib\cache.js:522:5
npm ERR!     at saved (C:\Program Files\nodejs\node_modules\npm\node_modules\npm
-registry-client\lib\get.js:138:7)
npm ERR!     at C:\Program Files\nodejs\node_modules\npm\node_modules\graceful-f
s\graceful-fs.js:218:7
npm ERR!     at Object.oncomplete (fs.js:297:15)
npm ERR! If you need help, you may report this log at:
npm ERR!     <http://github.com/isaacs/npm/issues>
npm ERR! or email it to:
npm ERR!     <npm-@googlegroups.com>

npm ERR! System Windows_NT 6.1.7601
npm ERR! command "C:\\Program Files\\nodejs\\\\node.exe" "C:\\Program Files\\nod
ejs\\node_modules\\npm\\bin\\npm-cli.js" "install" "0"
npm ERR! cwd D:\TEMP\npm-test1
npm ERR! node -v v0.8.14
npm ERR! npm -v 1.1.65
npm ERR!
npm ERR! Additional logging details can be found in:
npm ERR!     D:\TEMP\npm-test1\npm-debug.log
npm ERR! not ok code 0
	