

<details><summary># MAC #</summary>
  
## ~/.bash_profile ##
$ touch .bash_profile  
```sh
export CLICOLOR=1
export LSCOLORS=ExFxBxDxCxegedabagacad
export PATH=~/...../mongodb/bin:$PATH

# tput setb [1-7] – Set a background color
# tput setaf [1-7] – Set a foreground color using ANSI escape
# tput setf [1-7] – Set a foreground color
#
# tput bold – Set bold mode
# tput dim – turn on half-bright mode
# tput smul – begin underline mode
# tput rmul – exit underline mode
# tput rev – Turn on reverse mode
# tput smso – Enter standout mode (bold on rxvt)
# tput rmso – Exit standout mode
# tput sgr0 – Turn off all attributes
#
# 0 – Black  | 4 – Blue
# 1 – Red    | 5 – Magenta
# 2 – Green  | 6 – Cyan
# 3 – Yellow | 7 – White
#
# $ export PS1='\[$(tput bold)$(tput setb 4)$(tput setaf 7)\] \u@\h:\w $ \[$(tput sgr0)\]'

# λ
export PS1='\[\033[01;32m\]\w \[\033[35;1m\] » \[\033[00m\]'

# remove ' from the following line 
#function getCurrentFolderName() {
#   '# echo $PWD
#   echo /${PWD##*/}
#}
#export PS1='\[$(tput setab 3)$(tput setaf 4)\] $(getCurrentFolderName) » \[$(tput sgr0)\] '

alias l='ls -CF'
alias la='ls -a'
alias ll='ls -all'
alias ld='ls -l'
alias cls='clear && printf "\e[3J"'
alias pss='ps aux | grep'
alias mongod='mongod --dbpath /usr/local/var/mongodb'
alias d='docker'
alias k='kubectl'

alias cd..='cd ../'
alias ..='cd ../'
alias ...='cd ../../'
alias path='echo -e ${PATH//:/\\n}'
eval $(/usr/libexec/path_helper -s)
```

## shortcuts ##
AC2V2zZQ  
F11	=> Show desktop  
Cmd + Shift + . => show hidden files  
Cmd + Q         => close the application without trace  
Cmd + \`        => tab between windows of same application  
cp -a <_source>/. <_dest> => copy the content of the <_source> into <_dest> recursively(a) including hidden files/folders(.)  
ln -s <_source> <_dest>	=> creates a link of <_source> in the <_dest> folder  
chown <_user> <_file> => changes the owner of <_file> to <_user>  
defaults write -g com.apple.mouse.scaling -float 10  

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

### Applications ###
- Chrome, FireFox
- HomeBrew  
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
- Node
- Git
- VS Code, Sublime, Postman, Stuido 3T
- Spectacle
- iTerm2: export into ~/Library/ApplicationSupport/iTerm2/DynamicProfiles/aytekin.plist
- Tureng, Mini Calendar (AppStore)
- Android File Transfer
- Dash for MacOS



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
$ git push -u origin master
  # username: aytekinyaliz
  # password: <generated_token>
```
</details>
  
- - - -
  
<details><summary># DOCKER #</summary>

```sh
# Image
$ docker images        # Lists running images
$ docker image ls -a   # Lists all images, including stopped ones
$ docker image rm imageId1 imageId2   # Deletes selected images (-f will force)
$ docker rmi imageId1 imageId2        # Deletes selected images (-f will force)
  
# Container
$ docker container ls       # Lists running containers (same as $ docker ps)
$ docker container ls -a    # Lists all containers (same as $ docker ps -a)
$ docker container rm containerId1 containerId2       # Deletes containers
$ docker container start containerId1 containerId2    # Starts containers
$ docker container stop containerId1 containerId2     # Stops containers
  
# Must be run first because images are attached to containers
$ docker rm -f  # Deletes every Docker container,
$ docker ps -q | -a    # Kills all running containers (-a: stoped ones as well)
  
# Build $ Run
$ docker build .            # Builds the docker file and creates an image w/ Repository and Tag as <none>
$ docker build -t tagName . # Builds the docker file and creates an image w/ tag name
  
# 9000: exposed port in the dockerfile (this one will overwrite the "EXPOSE 9000" in the Dockerfile)
# 4000: port on the localhost host machine
# imageName should be the last parameter
# 172.17.0.1 is for the localhost host machine (Docker bridge gets 172.17.0.0)
$ docker run -d --name containerName -p 4000:9000 imageName            # Creates and runs a new container from the image
$ docker run -d -e "PORT=4001" -e "API_URL=172.17.0.1:4000" imageName  # Creates and runs a new container from the image w/ environment variable
$ docker stop containerId
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

```sh
$ docker system prune            # Removes images, containers, volumes, and networks (not associated with a container)
$ docker exec -it containerId sh # interactive terminal
$ docker network ls
$ docker network inspect bridge
  
# Delete every Docker image
$ docker rmi -f
$ docker images -q
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

<details><summary># IDE #</summary>
  
## Extensions ##

### VS Code ###
- Out of box
- Mac: ~/.vscode/extensions
  - Cmd + Shft + P -> Shell: install 'code' in Path
- Ubuntu: Home/.vscode/extensions
- USER SETTINGS: 
```
{
   "typescript.tsdk": "${npm list -g | head -n1}/node_modules/typescript/lib",
   "editor.detectIndentation": false,
   "editor.insertSpaces": true,
   "editor.tabSize": 3,
   "editor.fontFamily": "'Dank Mono', 'Source Code Pro', 'Roboto Mono', 'Andale Mono', 'Lucida Console', Menlo, Consolas, DejaVu Sans Mono, monospace",
   "editor.fontSize": 15,
   "editor.fontLigatures": true,
   "editor.fontWeight": "700",
   "terminal.integrated.fontSize": 12,
   "terminal.integrated.fontFamily": "Monaco",
   "terminal.integrated.shell": "bin/bash",
   "window.zoomLevel": -0.5,
   "workbench.colorTheme": "Cobalt2",
   "workbench.iconTheme": "material-icon-theme",
   "workbench.startupEditor": "newUntitledFile",
   "javascript.validate.enable": false, // if not using TS
   "explorer.confirmDelete": false,
   "explorer.confirmDragAndDrop": false,
   "git.autofetch": true,
   "gitlens.advanced.messages": {
      "suppressShowKeyBindingsNotice": true
   }, // or install npm i flow-bin -g
   "files.watcherExclude": {
      "**/tmp/**": true,
      "**/node_modules/**": true,
      "**/bower_components/**": true
   }
}
```
- Extensions: Activitus Bar, Atom One Dark Theme, Atom One Light Theme, Auto Import, Bracket Pair Colorizer, Cobalt2 Theme Official, Darcula Theme, Docker, Dracula Official, EditorConfig for VS Code, Git History, GitLens - Git supercharged, Material Icon Theme, One Dark (Sublime Babel), One Dark Pro, One Monokai Theme, Prettier - Code formatter, Quokka.js, Rightclick Git, Simple icon theme, Sublime Material Theme, TODO Highlight   

### Sublime ###
- Git  
TypeScript  
Babel ES6/ES7  
JsFormat  
BracketHighlighter  
SideBarEnhancements  
Color Highlighter  
A File Icon  
Seti_UI, Materialize, Tomorrow Color Schemes, Predawn, Monokai - Spacegray  

### Atom ###
- Atom-Typescript: https://github.com/TypeStrong/atom-typescript  
Atom-React: https://github.com/orktes/atom-react (clone into .atom\packages folder)  
Install: file-icons, atom-json-color, atom-bracket-highlight,  
Use: UITheme='One Dark', SyntaxTheme='One Light'  
Stylesheet:
```css
.tree-view {
  font-size: 10px;
}
atom-text-editor {
  background-color: #f7f3ea;
  font-family: Monaco;
  font-size: 13px;
}
.bracket-matcher {
  position: absolute;
  top: -1px;
  border-bottom: 1px solid lime;
  border: 1px solid rgba(0, 255, 0, 0.7);
  /* background-color: rgba(150, 255, 150, 0.3); */
}
```
</details>
  
- - - -
<details><summary># UBUNTU #</summary>

# UBUNTU #

## ~/.bashrc ##
```sh
# alias l='ls -CF'
# alias la='ls -a'
# alias ll='ls -all'
alias ld='ls -l'
alias cls='clear && reset'
PS1='\[\033[01;32m\]${PWD} \[\033[00m\]\$ '
```
## Programs ##
Gnome Tweaks, Gnome Global Application Menu, Docky (No need for Unity or Dash-to-dock),  
GIMP, VLC, K3b,  
Terminator,  
GParted, KDE Partition Manager, UNetbootin,  
https://atom.io, 

## Scripts ##
- sudo apt-get update  
- NodeJs: sudo apt-get install nodejs (may noy install the latest version)  
  curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -  
  sudo apt-get install -y nodejs  
  sudo apt-get install nodejs-legacy  
- NPM: sudo apt-get install npm  
- GIT: sudo apt-get install git  
- Chrome: sudo apt-get install google-chrome-stable
- D (ntfs):  
sudo mkdir -p /media/c  
sudo fdisk -l (ex: sda3 is our D drive)  
sudo mount -t ntfs -o nls=utf8,umask=0222 /dev/sda3 /media/c  
- if there is a problem w/ icons:  
/usr/share/pixmaps/ or /usr/share/applications/ and open related files.  
- Printer: download drivers from http://support.brother.com/g/b/producttop.aspx?c=eu_ot&lang=en&prod=dcp9055cdn_eu_as  
ipp://192.168.1.9/ipp for the URI of the wifi printer (http://localhost:631/printers for administrations)  

## Terminator ##
- Profiles -> default -> Colours -> Built-in Schemes: Gruvbox dark  
- First open terminator and set the window size according to your need and comfort.  
Right click and go to preference and then to layout.  
Click on the terminal name under window and then save the layout.  
Thats it, It will open the terminator in the same size, as you have set up, next time you open it.  
- ~home/.config/terminator/config:  
[global_config]
  suppress_multiple_term_dialog = True
  title_font = Sans 8
[keybindings]
[layouts]
  [[default]]
    [[[child0]]]
      fullscreen = False
      last_active_term = 99a44a5b-9cc5-4c49-bdc8-6cac012dcfb8
      last_active_window = True
      maximised = False
      order = 0
      parent = ""
      position = 0:0
      size = 1912, 425
      title = /bin/bash
      type = Window
    [[[terminal1]]]
      order = 0
      parent = child0
      profile = default
      type = Terminal
      uuid = 99a44a5b-9cc5-4c49-bdc8-6cac012dcfb8
[plugins]
[profiles]
  [[default]]
    background_color = "#282828"
    background_darkness = 0.95
    background_type = transparent
    copy_on_selection = True
    cursor_color = "#aaaaaa"
    cursor_shape = ibeam
    font = Monospace 9
    foreground_color = "#ffffff"
    show_titlebar = False
    use_system_font = False

## Konsole ##
~/.config/konsolerc  
[Desktop Entry]
DefaultProfile=Default.profile
[Favorite Profiles]
Favorites=
[MainWindow]
Height 1080=480
Width 1920=1298
[TabBar]
ShowQuickButtons=true
TabBarVisibility=ShowTabBarWhenNeeded

~/.local/share/konsole/Default.profile  
[Appearance]
ColorScheme=Breeze
[General]
Name=Default
Parent=FALLBACK/


## Sublime Text 3 ##
- sudo add-apt-repository ppa:webupd8team/sublime-text-3
- sudo apt-get update
- sudo apt-get install sublime-text-installer  

## Docky ##
Open gconf-editor. Navigate to */apps/docky-2/Docky/Items/DockyItem/*. Change *Hue* to 1 DockyItemCommand to *gksu nautilus /usr/share/applications*. Click on your Docky Anchor. Type in your password. Navigate to the program icon you would like to change.  


## Plasma ##

edit */usr/share/plasma/layout-templates/org.kde.plasma.desktop.defaultPanel/contents/layout.js*:  
var panel = new Panel
var panelScreen = panel.screen
var freeEdges = {"bottom": true, "top": true, "left": true, "right": true}

for (i = 0; i < panelIds.length; ++i) {
    var tmpPanel = panelById(panelIds[i])
    if (tmpPanel.screen == panelScreen) {
        // Ignore the new panel
        if (tmpPanel.id != panel.id) {
            freeEdges[tmpPanel.location] = false;
        }
    }
}

if (freeEdges["bottom"] == true) {
    panel.location = "bottom";
} else if (freeEdges["top"] == true) {
    panel.location = "top";
} else if (freeEdges["left"] == true) {
    panel.location = "left";
} else if (freeEdges["right"] == true) {
    panel.location = "right";
} else {
    // There is no free edge, so leave the default value
    panel.location = "top";
}

panel.height = gridUnit * 2

var kickoff = panel.addWidget("org.kde.plasma.kickoff")
kickoff.currentConfigGroup = ["Shortcuts"]
kickoff.writeConfig("global", "Alt+F1")

//panel.addWidget("org.kde.plasma.showActivityManager")
panel.addWidget("org.kde.plasma.pager")
panel.addWidget("org.kde.plasma.taskmanager")

/* Next up is determining whether to add the Input Method Panel
 * widget to the panel or not. This is done based on whether
 * the system locale's language id is a member of the following
 * white list of languages which are known to pull in one of
 * our supported IME backends when chosen during installation
 * of common distributions. */

var langIds = ["as",    // Assamese
               "bn",    // Bengali
               "bo",    // Tibetan
               "brx",   // Bodo
               "doi",   // Dogri
               "gu",    // Gujarati
               "hi",    // Hindi
               "ja",    // Japanese
               "kn",    // Kannada
               "ko",    // Korean
               "kok",   // Konkani
               "ks",    // Kashmiri
               "lep",   // Lepcha
               "mai",   // Maithili
               "ml",    // Malayalam
               "mni",   // Manipuri
               "mr",    // Marathi
               "ne",    // Nepali
               "or",    // Odia
               "pa",    // Punjabi
               "sa",    // Sanskrit
               "sat",   // Santali
               "sd",    // Sindhi
               "si",    // Sinhala
               "ta",    // Tamil
               "te",    // Telugu
               "th",    // Thai
               "ur",    // Urdu
               "vi",    // Vietnamese
               "zh_CN", // Simplified Chinese
               "zh_TW"] // Traditional Chinese

if (langIds.indexOf(languageId) != -1) {
    panel.addWidget("org.kde.plasma.kimpanel");
}

panel.addWidget("org.kde.plasma.systemtray")
panel.addWidget("org.kde.plasma.digitalclock")

</details>
  
- - - -
  
youtube-dl  -o '~/Downloads/%(title)s.%(ext)s' --prefer-ffmpeg https://m.twitch.tv/videos/327690336
  
https://help.github.com/articles/basic-writing-and-formatting-syntax  
