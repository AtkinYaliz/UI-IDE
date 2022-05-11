# Mac

### Applications

- Chrome, FireFox
- HomeBrew (https://brew.sh)  
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"  
  May require xCode to be installed: xcode-select --install
- Development
  - Git
  - Node (https://tecadmin.net/install-nvm-macos-with-homebrew/, nvm install 14, nvm use 11, nvm alias default 6)
  - Sublime, Postman, Robo 3T, DBeaver, TextWrangler(BBEdit)
  - VS Code
    ```
    Editor.Bracket-Pair-Colorization:true
    Default formatter: Prettier
    Format on Paste,
    Format on Save
    ```
  - IntelliJ
    ```
    - Open IntelliJ IDEA, go to Tools -> Create Command-Line Launcher (idea .)
      # if no admin rights are present:
      create /usr/local/bin/idea file and put the following two lines
      #!/bin/sh
      open -na "IntelliJ IDEA CE.app" --args "$@"

    - Preferences -> Editor -> Code Style > Java > Code Generation > Comment Code
                  -> Editor -> Color Scheme -> Console Font: 11
    - Extensions: Mario Progress Bar, Rainbow Brackets, SonarLint
    ```
    
- XCode Theme: https://plugins.jetbrains.com/plugin/15727-xcode-theme
- Atom Material Icons: https://plugins.jetbrains.com/plugin/10044-atom-material-icons
- Mario Progress Bar: https://plugins.jetbrains.com/plugin/14708-mario-progress-bar
- Rainbow Brackets: https://plugins.jetbrains.com/plugin/10080-rainbow-brackets
- Pieces: https://plugins.jetbrains.com/plugin/17328-pieces
- Key Promoter X: https://plugins.jetbrains.com/plugin/17328-pieces
- Fonts: Monaco with Ligatures Enabled
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
  - Flowchart Designer 3

### shortcuts

F11 => Show desktop  
Cmd + Shift + . => show hidden files  
Cmd + Option + Shift + V => paste without formatting  
Cmd + Q => close the application without trace  
Cmd + \` => tab between windows of same application  
TextEdit default blank: System Preferences -> iCloud -> iCloud Drive (Options): uncheck textEdit

```
> cp -a source dest => copy the content of the source into dest recursively(a) including hidden files/folders(.)
> ln -s source dest => creates a link of source in the dest folder
> chown user file => changes the owner of file to user
> chmod -R 777 folder
> lsof -ti:7071 | xargs kill -9
> ps aux | grep /usr/local/dgagent/dgdaemon | awk '{print $2}'
```

### ~/.zshrc

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

export M2_HOME="/Users/aytyaliz/Library/apache-maven-3.8.1"
export JAVA_HOME="/Library/Java/JavaVirtualMachines/jdk-11.0.12.jdk/Contents/Home"
export JAVA_PATH=${JAVA_HOME}/bin

export PATH=${M2_HOME}/bin:${JAVA_PATH}:$PATH
```

# Windows

- Development
  - Git for Windows, Git Extensions
  - Node (https://tecadmin.net/install-nvm-macos-with-homebrew/, nvm install 14, nvm use 11, nvm alias default 6)
  - Sublime, Postman, Robo 3T, DBeaver, TextWrangler(BBEdit)
  - Microsoft Store -> Microsoft PowerToys (FancyZones)
                    -> Windows Terminal (Add Git-Bash profile)
                    -> Tureng
  - VS Code
    ```
    Editor.Bracket-Pair-Colorization:true
    Default formatter: Prettier
    Format on Paste,
    Format on Save
    ```
  - IntelliJ
    ```
    - Environment Variables: C:\Program Files\aytekin\JetBrains\IntelliJ IDEA Community Edition 2021.2.1\bin (idea64 .)

    - Settings -> Editor -> Code Style > Java > Code Generation > Comment Code
               -> Editor -> Color Scheme -> Console Font: 11
               -> Extensions -> Mario Progress Bar, Rainbow Brackets, SonarLint
    ```
