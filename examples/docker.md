```sh
# Images
$ d system prune:
  Removes images, containers, volumes, and networks — not associated with a container
$ d images: Lists running images
$ d image ls -a: Lists all images
$ d image rm -f <imageId1> <imageId2>: Deletes selected images (-f will force)
$ d rmi -f <imageId1> <imageId2>: Deletes selected images (-f will force)


# Private Container Registry
$ az acr login --name <registry-name>: Login to Azure container registry
$ d login <registry-name>.azurecr.io: Login to Azure container registry
$ d build -t vedubox.azurecr.io/samples/hello-world-svc:v1
  Creates an image with that repository name and v1 tag
$ d tag hello-world-svc vedubox.azurecr.io/samples/hello-world-svc
  Create an alias of the image with the fully qualified path to your registry
$ d push vedubox.azurecr.io/samples/hello-world-svc:v1
  Pushes the image with the fully qualified path to your private registry
$ az acr repository delete --name <registry-name> --image samples/nginx:latest
  Removes images from your Azure container registry
```

```sh
# Containers
$ d ps: Lists running containers ($ docker container ls)
$ d ps -a: Lists all containers ($ docker container ls -a)
$ d rm -f <containerId1> <containerId2>: Deletes containers
$ d create <imageId>: Creates a container from the image
$ d start <containerId1> <containerId2>: Starts containers
$ d stop <containerId1> <containerId2>: Stops containers
$ d container prune: Remove all stopped containers
```

```sh
# Build & Run (Run = Create + Start)
$ d build .: Builds the docker file and creates the image w/ Repository and Tag as <none>
$ d build -t <tagName> .: Builds the docker file and creates the image w/ tag name
  tagName: repoName/projectName:latest (default latest)
$ docker-compose up -d —build
$ docker-compose down
$ docker-compose run | stop
$ docker-compose ps

# 3000: exposed port in the dockerfile
#       (this one will overwrite the "EXPOSE 9000" in the Dockerfile)
# 8080: port on the localhost host machine
# imageName should be the last parameter
# -it: start container instance interactively
# —rm: specifies that the container should be removed when you stop it

$ d run -it <imageName> sh:
  Creates and runs a new container from the image and then sh into it.
$ d run -d --name <containerName> -p 8080:3000 <imageName>:
  Creates and runs a new container from the image at the background
$ d run -d -e "PORT=4001" -e "API_URL=http://172.17.0.1:4000" <imageName>:
  Creates and runs a new container from the image w/ environment variable

$ d exec -it <containerId> sh
  Executes an additional command (eg. sh, redis-cli) in a container
  (-it = -i -t = interactive terminal)
$ d logs <containerId> --tail=1000 -f
$ d network ls
$ d network inspect bridge
```

```sh
# Mongo/Bitnami Mongo, Kong, Redis
$ d pull mongo
  d run --name mongoInstance -p 27017:27017 mongo
$ d pull bitnami/mongodb
$ d pull pantsel/konga
$ d pull redis
  d run --name redisInstance -p 6379:6379 redis

$ brew install redis
  if permission denied: sudo chown -R $(whoami) $(brew --prefix)/*
```

Let's run 2 containers under bridge network. The inspect would be like the following:

- 172.17.0.0: docker bridge
- 172.17.0.1: host
- 172.17.0.2: container1
- 172.17.0.3: container2

```sh
# Network is 'bridge' (the default one)
$ docker run -d --name graphql-api-server -p 4002:9000 -e "PORT=9000" graphql-api-server
$ docker run -d --name graphql-server -p 4000:9000 -e "PORT=9000" -e "API_URL=http://172.17.0.2:9000" graphql-server

# Network is 'myNetwork'. So we can use container name
$ docker run -d --name graphql-api-server --network myNetwork -p 4002:9000 -e "PORT=9000" graphql-api-server
$ docker run -d --name graphql-server --network myNetwork -p 4000:9000 -e "PORT=9000" -e "API_URL=http://graphql-api-server:9000" graphql-server

$ docker build -t ylz-identity-manager .
$ docker run -d --name ylz-identity-manager --network ylz -p 10000:9000 -e "mongoUrl=mongodb://host.docker.internal:2017/IdentityManager" -e "apiPrefix=/api" -e "corsOrigin=[\"http://localhost\"]" -e "nodeEnv=dev" -e "port=9000" -e "secret=qwerty12345asdfg67890" -e "swaggerUrl=/_docs" -e "swaggerDefinition={\"basePath\":\"/api\",\"info\": {\"description\": \"Identity Manager API with Swagger\",\"title\": \"Identity Manager API documentation\",\"version\": \"\"}}" ylz-identity-manager
```
