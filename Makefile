
build: node_modules
	@mkdir -p dist/api
	@node metalsmith/index.js
	@cp -R metalsmith/static/* dist/
	@cp -R metalsmith/static/.htaccess dist/
	@cp ./node_modules/fuse.js/dist/fuse.min.js dist/js/

node_modules: package.json
	@npm install

.PHONY: build
