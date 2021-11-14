# Mac

### Applications

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

## shortcuts

AC2V2zZQ  
F11 => Show desktop  
Cmd + Shift + . => show hidden files  
Cmd + Q => close the application without trace  
Cmd + \` => tab between windows of same application  
cp -a <\_source>/. <\_dest> => copy the content of the <\_source> into <\_dest> recursively(a) including hidden files/folders(.)  
ln -s <\_source> <\_dest> => creates a link of <\_source> in the <\_dest> folder  
chown <\_user> <\_file> => changes the owner of <\_file> to <\_user>  
chmod -R 777 <\_directory>  
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
