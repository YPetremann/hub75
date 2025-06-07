all: build upload
build:
	arduino-cli compile
upload:
	arduino-cli upload -v
monitor:
	arduino-cli monitor --config baudrate=115200