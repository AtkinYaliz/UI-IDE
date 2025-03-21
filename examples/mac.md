# Mac

### Applications

- Chrome, FireFox
- HomeBrew (https://brew.sh)  
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"  
  May require xCode to be installed: xcode-select --install
- Development
  - Git
  - Node (https://tecadmin.net/install-nvm-macos-with-homebrew/, nvm install 14, nvm use 11, nvm alias default 6)
  - Sublime, Postman, Robo 3T, DBeaver, TextWrangler(BBEdit), Draw.io
  - iTerm2 (export into ~/Library/ApplicationSupport/iTerm2/DynamicProfiles/aytekin.plist)
  - Docker, Kubernetes, minikube
  - Java: https://www.oracle.com/java/technologies/javase-downloads.html  
    if no admin rights are present: copy the new version into /Library/Java/JavaVirtualMachine folder.
  - Font: [Monaco with Ligatures Enabled](../files/Ligamonacop.ttf), [DankMono](../files/DankMono.zip), [SF-Mono-Font](../files/SF-Mono-Font.zip)
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

    - Preferences -> Editor -> Code Style > Java > Code Generation > Comment Code -> Line comment at first column: false
                            -> Color Scheme -> Console Font: 11
                            -> Font -> Size: 12
                  -> Extensions: Rainbow Brackets, SonarLint, XCode Theme, Atom Material Icons, Mario Progress Bar, Diagrams.net
    ```

- Productivity
  - Spectacle, [Rectangle](https://github.com/rxhanson/Rectangle)
  - Tureng, Quick View Calendar (AppStore)
  - Pinta
  - Android File Transfer
  - Google Drive Back up
  - VLC
  - TeamViewer
  - Flowchart Designer 3, Draw.io, Miro

### shortcuts

F11 => Show desktop  
Cmd + Shift + . => show hidden files  
Cmd + Shift + 3/4 => take screenshot  
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
>
> defaults read -g com.apple.mouse.scaling
> defaults write -g com.apple.mouse.scaling  3.0
> sysctl hw.physicalcpu hw.logicalcpu  # To check your CPU core information in the macOS terminal
> top
> brew install htop (then run htop)
> yes > /dev/null &   (repeat for the number of cores)
> killall yes
```

### Oh My Zsh (touch ~/.zshrc)

https://ohmyz.sh/#install

```sh
ZSH_THEME="af-magic"	# robbyrussell, agnoster, af-magic

# ALIAS'S
alias ..='cd ../'
alias ...='cd ../../'
alias cd..='cd ../'
alias cls='clear && printf "\e[3J"'
alias cll='clear; ls -lah'
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

### Applications

- Chrome, FireFox
- Development
  - Git for Windows, Git Extensions
    - To add an alias permanently, you'd need to edit the file /C/Program Files/Git/etc/profile.d/aliases.sh .
    - Run your text editor as an administrator and open that file.
    - Add your alias and save the file.
    - Open the Git Bash. Execute 'alias', and you're done. Have fun.
  - Node (nvm install 14, nvm use 11, nvm alias default 6)
  - Sublime, Postman, Robo 3T, DBeaver, Draw.io
  - Font: [Monaco with Ligatures Enabled](../files/Ligamonacop.ttf), [DankMono](../files/DankMono.zip), [SF-Mono-Font](../files/SF-Mono-Font.zip)
  - VS Code
    ```
    Editor.Bracket-Pair-Colorization:true
    Default formatter: Prettier
    Format on Paste,
    Format on Save
    ```
  - IntelliJ
    ```
    - Create Command-Line Launcher: $ START idea64 .
    - Environment Variables -> JAVA_HOME: C:\Program Files\Java\jdk-11.0.12
                            -> JAVA_PATH: C:\Program Files\Java\jdk-11.0.12\bin
                            -> IntelliJ_Com_Edition: C:\Program Files\aytekin\JetBrains\IntelliJ IDEA Community Edition 2021.2.1\bin
                            -> Path: %IntelliJ_Com_Edition%

    - Settings -> Editor -> Code Style > Java > Code Generation > Comment Code -> Line comment at first column: false
                         -> Color Scheme -> Console Font: 11
                         -> Font -> Size: 12
               -> Plugins -> Rainbow Brackets, SonarLint, XCode Theme, Atom Material Icons, Mario Progress Bar, Diagrams.net
    ```
  - Usability
    ```
    # Save this file as "use_thumbnails_on_Alt+Tab.bat" and run it.
    @echo off
    REG ADD "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer" /V AltTabSettings /T REG_DWORD /D 1 /F
    taskkill /f /im explorer.exe
    start explorer.exe
    ```
    ```
    1. CMD -> Regedit -> HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced
    2. Create a new DWORD (32-bit) Value by right clicking in the right window pane and selecting New->DWORD (32-bit) Value.
    3. Name the value TaskbarSi
    4. Set the value to one of the following to 0, 1 or 2 which give you small, medium or large
    5. Close Regedit and reboot.
    ```
    
- Productivity
  - Microsoft Store -> Windows Terminal (Add Git-Bash profile), Tureng, Draw.io, Miro
  - Android File Transfer
  - Google Drive Back up
  - VLC
  - TeamViewer
