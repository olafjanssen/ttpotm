
build: node_modules
	@mkdir -p dist/api
	@node metalsmith/index.js
	@cp -R metalsmith/static/* dist/
	@mv dist/htaccess dist/.htaccess

node_modules: package.json
	@npm install

.PHONY: build
