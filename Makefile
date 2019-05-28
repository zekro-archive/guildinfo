NPM  = npm
NPX  = npx
NODE = node

# -------------------------------------------------------------

CONFIG = $(CURDIR)/config/private.config.json

# -------------------------------------------------------------

.PHONY: deps build clean run buildrun _make

_make: clean deps build

deps: 
	$(NPM) i

build:
	$(NPX) tsc

clean:
	rm -r $(CURDIR)/dist

clean-modules:
	rm -r $(CURDIR)/node_modules

run: 
	$(NODE) $(CURDIR)/dist/main.js $(CONFIG)

buildrun: build run