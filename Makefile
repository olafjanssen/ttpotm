
build: node_modules
	@mkdir -p dist/api
	@node metalsmith/index.js
	@cp -R metalsmith/static/* dist/
	@mv dist/htaccess dist/.htaccess
	@cp ./node_modules/fuse.js/dist/fuse.min.js dist/js/fuse.min.js

node_modules: package.json
	@npm install

.PHONY: build
