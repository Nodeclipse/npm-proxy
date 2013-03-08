# NPM config

## Change registry from "https://registry.npmjs.org/" to "http://localhost:5984/repo1/"

'npm config list'

	C:\Users\weibl>npm config list
	; cli configs
	registry = "https://registry.npmjs.org/"
	
	; builtin config undefined
	prefix = "C:\\Users\\weibl\\AppData\\Roaming\\npm"
	
	; node bin location = C:\Program Files\nodejs\\node.exe
	; cwd = C:\Users\weibl
	; HOME = C:\Users\weibl
	; 'npm config ls -l' to show all defaults.
	
	
C:\Users\weibl>npm config set registry=http://localhost:5984/repo1

C:\Users\weibl>npm config list
; cli configs
registry = "http://localhost:5984/repo1/"

; userconfig C:\Users\weibl\.npmrc

; builtin config undefined
prefix = "C:\\Users\\weibl\\AppData\\Roaming\\npm"

; node bin location = C:\Program Files\nodejs\\node.exe
; cwd = C:\Users\weibl
; HOME = C:\Users\weibl
; 'npm config ls -l' to show all defaults.
	
## Change registry to localhost:6084/npm-proxy/
	
npm config set registry=http://localhost:6084/npm-proxy/

npm config list
	
