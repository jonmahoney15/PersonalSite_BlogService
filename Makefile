build-dev:
	docker build -t personal-site-blog-api-dev -f Dockerfile.dev .

build-prod: 
	docker build -t personal-site-blog-api-prod -f Dockerfile .
