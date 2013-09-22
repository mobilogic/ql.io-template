PACKS = tables routes lib
BUILD_MACHINE = 0.0.0.0
DEPLOY_MACHINE = 1.1.1.1
KEY = testkey.pem
all: clean install 

clean:
	-rm -fr node_modules
	-rm -fr logs
	-rm -fr pids

install:
	npm link ql.io-compiler;\
	npm link ql.io-app;\
	-mkdir pids;mkdir logs;\
	npm install
	-mkdir tables
	-mkdir routes
	-mkdir lib

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
	ssh -i $(KEY) ubuntu@$(BUILD_MACHINE) "curl https://gist.github.com/iamhamilton/605139b02dff1e749aac/raw/077b92bafb441654157dfad440443a8213828cd9/build.sh | bash";\


deploy:
	ssh -i $(KEY) ubuntu@$(BUILD_MACHINE) "curl https://gist.github.com/iamhamilton/dfe36c7b2da9e79e2e41/raw/66963c1e7ee06e7c6d64d78c7d589262b4346ba7/deploy.sh | bash -s $(DEPLOY_MACHINE)"
	ssh -i $(KEY) ubuntu@$(DEPLOY_MACHINE) "sudo rm -rf ql.io-template;tar -zxvf deploy.tar.gz;cd ql.io-template;sudo bin/start.sh &"

start:
	ssh -i $(KEY) ubuntu@$(DEPLOY_MACHINE) "cd ql.io-template;bin/start.sh &"

stop:
	ssh -i $(KEY) ubuntu@$(DEPLOY_MACHINE) "cd ql.io-template;bin/stop.sh"
	
	

