
## Examples
	curl -X POST -H "Content-Type:application/json" http://localhost:5984/_replicate -d '{"source":"http://isaacs.iriscouch.com/registry/", "target":"registry"}'
	
	curl -X POST 'http://localhost:5984/_replicate' -H 'Content-Type: application/json' -d '{"doc_ids": [ "coffee-script", "nodeunit", "npm" ], "source": "http://registry.npmjs.org:5984/registry", "target": "registry", "create_target": true}