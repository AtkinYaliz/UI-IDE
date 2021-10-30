

<details><summary># MAC #</summary>
  

### Applications ###
- Chrome, FireFox
- HomeBrew  
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
- Development
  - Git
  - Node (https://tecadmin.net/install-nvm-macos-with-homebrew/, nvm install 14, nvm use 11, nvm alias default 6)
  - VS Code, IntelliJ, Sublime, Postman, Robo 3T, DBeaver, TextWrangler(BBEdit)
  - IntelliJ
    ```
    Open IntelliJ IDEA, go to Tools->Create Command-Line Launcher: idea .
    # if no admin rights are present:
    create /usr/local/bin/idea file and put the following two lines
    #!/bin/sh
    open -na "IntelliJ IDEA CE.app" --args "$@"
  
    Code Style > Java > Code Generation > Comment Code
    ```
  - iTerm2 (export into ~/Library/ApplicationSupport/iTerm2/DynamicProfiles/aytekin.plist)
  - Docker, Kubernetes, minikube
  - Java: https://www.oracle.com/java/technologies/javase-downloads.html
    if no admin rights are present: copy the new version into /Library/Java/JavaVirtualMachine folder.
- Productivity
  - Spectacle
  - Tureng, Mini Calendar (AppStore)
  - Pinta
  - Android File Transfer
  - Google Drive Back up
  - VLC
  - TeamViewer

  
## shortcuts ##
AC2V2zZQ  
F11	=> Show desktop  
Cmd + Shift + . => show hidden files  
Cmd + Q         => close the application without trace  
Cmd + \`        => tab between windows of same application  
cp -a <_source>/. <_dest> => copy the content of the <_source> into <_dest> recursively(a) including hidden files/folders(.)  
ln -s <_source> <_dest>	=> creates a link of <_source> in the <_dest> folder  
chown <_user> <_file> => changes the owner of <_file> to <_user>  
chmod -R 777 <_directory>  
defaults write -g com.apple.mouse.scaling -float 10  
lsof -i tcp:3000  

```
$ /usr/libexec/java_home -V

// .zshrc
$ export JAVA_HOME=$(/usr/libexec/java_home -v 1.8.0)
```

```sh
# MongoDB  
$ ./mongod --dbpath ../data/db
$ mongo (another cmd)
$ show dbs
$ use <db>
$ db
$ show collections
$ db.<collection>.drop()
$ db.<collection>.insert({…})
$ db.<collection>.find()

# NPM
$ sudo chown -R $(whoami) <path> | $(npm config get prefix)
```
  
## ~/.zshrc

https://ohmyz.sh/#install

```sh
ZSH_THEME="af-magic"	# robbyrussell, agnoster, af-magic

# ALIAS'S
alias ..='cd ../'
alias ...='cd ../../'
alias cd..='cd ../'
alias cls='clear && printf "\e[3J"'
alias pss='ps aux | grep'
alias l='ls -CF'
alias la='ls -a'
alias ll='ls -all'
alias ld='ls -l'

alias gs='git status'
alias gb='git branch'
alias gc='git checkout'
alias gl='git pull'
alias gp='git push'

#alias mongod='mongod --dbpath /usr/local/var/mongodb'  #~/Documents/mongodb/data/db'
alias d='docker'
alias di='docker images'
alias ds='docker container ls'
alias k='kubectl'
alias mk='minikube'


#export JAVA_HOME=$(/usr/libexec/java_home -v 1.8.0)

export M2_HOME="/Users/aytyaliz/Library/apache-maven-3.8.1"
#export GIT_PATH="/Users/aytyaliz/Library/git/git-2.31.1"
export JAVA_PATH="/Users/aytyaliz/Library/Java/JavaVirtualMachines/jdk-11.0.10.jdk/Contents/Home/bin"

export PATH=${M2_HOME}/bin:${JAVA_PATH}:$PATH
```

</details>  

- - - -

<details><summary># AWS #</summary>

```sh
# Installations
sudo apt-get update
sudo apt-get git
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y nodejs-legacy
sudo apt-get install build-essential
sudo apt-get npm

# Deployment
$ ssh -i \~/.ssh/lh-accountancy-dev.pem ubuntu@ec2-35-177-20-202.eu-west-2.compute.amazonaws.com
$ tar -cvzf lh-accountancy.tar.gz lh-accountancy
$ scp -i \~/.ssh/lh-accountancy-dev.pem lh-accountancy.tar.gz ubuntu@ec2-35-177-20-202.eu-west-2.compute.amazonaws.com:\~

$ sudo tar -xzvf lh-accountancy.tar.gz
$ npm run build-dev (export NODE_ENV=dev)
$ npm run publish-dev > ../lh-accountancy.log 2>&1 &
$ nohup node ./lh-accountancy/dist/src/index.js > lh-accountancy.log 2>&1 &
```
</details>

- - - -

<details><summary># GIT #</summary>

```sh
# Branch
$ git br -a                    # Lists both remote-tracking branches and local branches
$ git br -d branchName         # Deletes a branch
$ git br -D branchName         # --delete --force
$ git br -f branchName         # Resets <branchname> to <startpoint>
$ git ps -d origin branchName  # Deletes a remote branch

# Fetch
$ git fetch --all    # Fetch all remotes
$ git fetch --prune  # After fetching, remove any remote tracking branches which no longer exist on the remote

# Clone
$ git clone -b develop repository-url.git

# Unstage changes
$ git reset HEAD . | fileName1 fileName2

# restore a previous commit's state:
$ git reset --hard a0e4812dbc
$ git ps origin develop --force
```
```sh
$ git remote get-url origin
$ git remote set-url origin https://github.com/USERNAME/REPOSITORY.git

$ git remote set-url origin http://...
$ git remote remove origin
$ git remote add origin http://...

$ git config credential.helper store
$ git config --global credential.helper cache
$ git push http://example.com/repo.git
  # Username: <type your username>
  # Password: <type your password>
#
#
# fatal: Authentication failed for 'https://github.com/aytekinyaliz/repo-name.git/'
# https://medium.com/@ginnyfahs/github-error-authentication-failed-from-command-line-3a545bfd0ca8
# GitHub Developer Settings -> Personel access tokens -> Generate new token
$ git clone https://private_repo.git
  # username: aytekinyaliz
  # password: <generated_token>
```
</details>
  
- - - -
  
<details><summary># DOCKER #</summary>

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

</details>
  
- - - -
  
<details><summary># KUBERNETES #</summary>

```sh
# install kubectl
# install azure cli
$ az login
$ az aks get-credentials --resource-group=enablers-aks-rg --name=enablers-aks-cluster --admin

$ kubectl get nodes
$ kubectl cluster-info
$ kubectl get ns
$ kubectl get pods -n namaspaceName
$ kubectl logs -n namaspaceName --tail=1000 -f podName
$ kubectl exec -it -n namaspaceName podName sh
$ kubectl get pods -n namaspaceName | grep -i 7DD863D35E
$ kubectl get deploy -n namaspaceName

$ kubectl describe -n namaspaceName pod podName
$ kubectl delete -n namaspaceName pod podName
$ kubectl scale deployment -n namaspaceName --replicas=0 serviceName
$ kubectl get logs -n namaspaceName podName
  
# ssh #
$ cd ~/.ssh
$ ssh-keygen -t rsa: Creates id_rsa and id_rsa.pub
$ Enter passphrase (empty for no passphrase):
$ Enter same passphrase again:
$ cat id_rsa.pub
  - ssh-rsa AAAAB3NzaC1yc...

$ ssh _yaliz_@yaliz-identity-manager.serra.pw
```
</details>
  
- - - -
  
<details><summary># MONGO #</summary>

```js
// FIND
db.Clients.find({ industry: 'Automotive' });  
db.Clients.find({ $where: function() { return this.industry ==  'Automotive' } })  
  
// SELECT & JOIN
db.Projects.find({ clientId: {  
   $in: db.Clients.find({ countryId: 'AU' }).map(x => x._id)  
}}, { _id: 1, name: 1, budget: 1 })  

const clients = db.Clients
   .find({ countryId: 'IE' })
   .map( x => x._id )
db.Projects
   .find({ clientId: {$in: clients} }, { _id: 0, name:1 })
   .sort({ name: 1 })

// INSERT
const clients = [...];
clients.forEach( client => {
    client._id = ObjectId().str;
    db.Clients.insert( client );
});

db.ClientsXX.find({}).forEach(x => {
    const xNew = Object.assign({}, x, {_id: x._id.valueOf(), leads: [], planners: []});
    db.getCollection('Clients').insert( xNew );
});  

// UPDATE (the first match)
db.Formats.update({ countryId: 'GB' },
   {
      $set: {
         parentId: null
      }
   }
)
db.Formats.updateMany({ countryId: 'GB' },
   {
      $set: {
         parentId: null
      }
   }
)

db.Formats.updateMany({},
   {
      $unset: { parentId:1 }
   }, false, true
);
```
</details>
  
- - - -
  
<details><summary># REDIS #</summary>

```ssh
$ wget http://download.redis.io/redis-stable.tar.gz
$ tar xvzf redis-stable.tar.gz
$ cd redis-stable
$ make

$ sudo apt-get install make
$ make distclean
$ make

$ nohup src/redis-server ./redis.conf &
$ src/redis-cli


> config set stop-writes-on-bgsave-error no
> CONFIG GET databases
> INFO keyspace
> select dbNumber
> KEYS *
> TYPE "q:job:3"
> get keyName
> hkeys q:job:3
```
</details>

- - - -
  
<details><summary># KAFKA #</summary>
  
```sh
$ brew install kafka
$ brew install zookeeper

# uncomment the following line in "/usr/local/etc/kafka/server.properties"
# listeners = PLAINTEXT://9092
# or add the following 2 lines
# port = 9092
# advertised.host.name = localhost

$ zkServer start
$ kafka-server-start /usr/local/etc/kafka/server.properties
$ kafka-server-stop
$ zkServer stop

# Create a topic
$ kafka-topics --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic test

# Send a message
$ kafka-console-producer --broker-list localhost:9092 --topic test
  >HELLO Kafka

# Receive a message
$ kafka-console-consumer --bootstrap-server localhost:9092 --topic test --from-beginning
  HELLO Kafka
```
  
Version: kafka_2.12-2.4.1
```sh
# Kafka cluster with 2 brokers
$ cp config/server.properties config/server-1.properties
$ cp config/server.properties config/server-2.properties
$ vim config/server-1.properties
  broker.id: 1
  log.dirs = /tmp/kafka-logs-1
  listeners = PLAINTEXT://9093
$ vim config/server-2.properties
  broker.id: 2
  log.dirs = /tmp/kafka-logs-2
  listeners = PLAINTEXT://9094

$ bin/zookeeper-server-start.sh config/zookeeper.properties
$ bin/kafka-server-start.sh config/server-1.properties
$ bin/kafka-server-start.sh config/server-2.properties

$ bin/kafka-topics.sh --create --bootstrap-server localhost:9093 --partitions 2 --replication-factor 2 --topic myTopicName
$ bin/kafka-topics.sh --list --bootstrap-server localhost:9093 -> myTopicName
```

</details>

- - - -

<details><summary># Education System #</summary>
  
  
How does National Curriculum work?
The National Curriculum is constructed in five Key Stages (**KS**):

KS1 - Foundation year and Years [1, 2] - for pupils aged between 5 and 7 years old.  
KS2 - Years [3, 4, 5, 6] - for pupils aged between 8 and 11 years old.  
KS3 - Years [7, 8, 9] - for pupils aged between 12 and 14 years old.  
KS4 - Years [10, 11] - for pupils aged between 15 and 16 years old.  
KS5 - Years [12, 13] - for pupils aged between 17 and 18 years old.  
  
In state schools each year that a pupil studies is given a number.  
*Primary education* starts in Year 1.  
*Seconday education* starts at the age of 11 (Year 7) for most pupils, but in some HMC schools pupils join the school at 13+ (Year 9).  
  
At the age of 16 (the end of KS4 and Year 11), all pupils take a series of exams called the General Certificate of Secondary Education (**GCSE**), usually in about eight to ten subjects, which must include English and Mathematics.  
  
KS5 is for pupils aged 16-18 (sometimes 19) and most schools take Advanced Level (**A-Levels**) exams after a two-year course.
  
</details>
  
- - - -
  
<details><summary># youtube-dl #</summary>
  

youtube-dl  --config-location .  
youtube-dl  -o '~/Downloads/%(title)s.%(ext)s' --prefer-ffmpeg https://m.twitch.tv/videos/327690336
  
```
# youtube-dl.conf
-u mikecostea@gmail.com
-p Mikecostea1
-i
-c
--no-warnings
--console-title
--batch-file='batch-file.txt'
-o '%(playlist_title)s/%(playlist_index)s-%(title)s.%(ext)s'
-f 'best[tbr<=1000]/worst[[height>=720]]/best[[height<720]]'

# batch-file.txt
https://learning.oreilly.com/videos/distributed-systems-in/9781491924914
https://www.oreilly.com/videos/distributed-systems-in/9781491924914
```
  
Udeler: https://github.com/FaisalUmair/udemy-downloader-gui
  
</details>
  
https://help.github.com/articles/basic-writing-and-formatting-syntax  
