.DEFAULT_GOAL := test

lint:
	node_modules/.bin/standard --fix src

test: lint
	NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest --detectOpenHandles src

