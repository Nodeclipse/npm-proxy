# URLs

v001
http://localhost:6084/npm-proxy/http://localhost:5984/_utils/


## v002


http://localhost:5984/
http://localhost:6084/hosted/
-> {"couchdb":"Welcome","version":"1.2.1"}

http://localhost:5984/_utils/
http://localhost:6084/hosted//_utils/
->
<html lang="en">
  <head>
    <title>Overview</title>
	
	
http://localhost:6084/hosted//repo1/
{"db_name":"repo1","doc_count":0,"doc_del_count":0,"update_seq":0,"purge_seq":0,"compact_running":false,"disk_size":79,"data_size":0,"instance_start_time":"1362197129455000","disk_format_version":6,"committed_update_seq":0}
	

https://registry.npmjs.org/
http://registry.npmjs.org/	
http://localhost:6084/npm-proxy/
->
{"db_name":"registry","doc_count":23964,"doc_del_count":2146,"update_seq":388982,"purge_seq":0,"compact_running":false,"disk_size":52241932423,"data_size":34157812106,"instance_start_time":"1361366952488079","disk_format_version":6,"committed_update_seq":388982}
	
	
http://registry.npmjs.org/_utils/
http://localhost:6084/npm-proxy//_utils/
-> will show HTML, but it is not functional because it is not server level, but database level.



http://localhost:6084/npm-proxy/cached/

## v005

http://localhost:6084/hosted/
http://localhost:6084/npm-mirror/
http://localhost:6084/npm-proxy/
http://localhost:6084/cached/
http://localhost:6084/virtual/

## v006

http://localhost:5984/npm2_cashed/_all_docs
http://localhost:5984/_utils/database.html?npm2_cashed

http://localhost:5984/npm2_cashed/_active_tasks

http://localhost:5984/_utils/index.html