PACKS = tables routes lib
BUILD_MACHINE = PUT_YOUR_ADDRESS
DEPLOY_MACHINE = PUT_YOUR_ADDRESS
KEY = testkey.pem
all: clean install 

clean:
	-rm -fr node_modules
	-rm -fr logs
	-rm -fr pids

install:
	-mkdir pids;mkdir logs;\
	npm install
	-mkdir tables
	-mkdir routes
	_mkdir lib

build:
	rm -rf  _tmp_packs
	-mkdir _tmp_packs
	-for d in $(PACKS); do \
		cp -rf $$d _tmp_packs; \
	done
	cp package.json _tmp_packs;\
	cd _tmp_packs;\
	tar -zcvf packs.tar.gz *;\
	cd ..;\
	scp -i $(KEY) _tmp_packs/packs.tar.gz ubuntu@$(BUILD_MACHINE):downloads;\
	ssh -i $(KEY) ubuntu@$(BUILD_MACHINE) "curl https://gist.github.com/iamhamilton/605139b02dff1e749aac/raw/2910ffd0480dd923fc9ad7288127eafe92710ef1/build.sh | bash";\

testbuild:
	ssh -i $(KEY) ubuntu@$(BUILD_MACHINE) "curl https://gist.github.com/iamhamilton/7b2936ca05d95ce0f1b7/raw/4b13ce42d49ceb9bfc17019c6b5d23e1447fdc25/hello.sh | bash";\

deploy:
	ssh -i $(KEY) ubuntu@$(BUILD_MACHINE) ". bar2.sh $(DEPLOY_MACHINE)"
	ssh -i $(KEY) ubuntu@$(DEPLOY_MACHINE) "sudo rm -rf ql.io-template;tar -zxvf deploy.tar.gz;cd ql.io-template;sudo bin/start.sh &"

start:
	ssh -i $(KEY) ubuntu@$(DEPLOY_MACHINE) "cd ql.io-template;bin/start.sh &"

stop:
	ssh -i $(KEY) ubuntu@$(DEPLOY_MACHINE) "cd ql.io-template;bin/stop.sh"
	
	

