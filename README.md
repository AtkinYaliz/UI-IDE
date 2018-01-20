

## Extensions ##

### VS Code ###
- Out of box
- Mac: ~/.vscode/extensions
- Ubuntu: Home/.vscode/extensions
- "typescript.tsdk": "${npm list -g | head -n1}/node_modules/typescript/lib",  
  "editor.detectIndentation": false,  
  "editor.insertSpaces": true,  
  "editor.tabSize": 3,  
  "editor.fontSize": 13,  
  "editor.fontLigatures": true,  
  "window.zoomLevel": -0.5,  
  "terminal.integrated.fontSize": 12,  

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
Stylesheet: .tree-view { /* background-color: whitesmoke; */ font-size: 10px; }  

### Alm-tools ###
- https://github.com/alm-tools/alm

- - - -

## Boilerplates ##

### Client ###
- https://github.com/facebookincubator/create-react-app
- https://github.com/Microsoft/TypeScript-React-Starter

### Node ###
- https://github.com/Microsoft/TypeScript-Node-Starter
- https://github.com/developit/express-es6-rest-api


- - - -

# MAC #

## ~/.bash_profile ##
export PS1="\[\033[36m\]\u\[\033[m\]@\[\033[32m\]\h:\[\033[33;1m\]\w\[\033[m\]\$ "  
export CLICOLOR=1  
export LSCOLORS=ExFxBxDxCxegedabagacad  
export PATH=~/Downloads/mongodb/bin:$PATH  
alias ll='ls -alF'  
alias la='ls -A'  
alias l='ls -CF'  
alias ld='ls -l'  
alias cls='clear && printf "\e[3J"'  
export PS1='\[\033[01;32m\]${PWD} \[\033[00m\]\$ '  
eval $(/usr/libexec/path_helper -s)  

## shortcuts ##
AC2V2zZQ  
F11 		=> Show desktop  
Cmd + Shift + . => show hidden files  
Cmd + Q 	=> close the application without trace  
Cmd + `		=> tab between windows of same application  
cp -a /source/. /dest/ => copy the content of the <_source> into <_dest> recursively(a) including hidden files/folders(.)  
ln -s <_path>	=> creates a link of <_path> in the current folder  
chown <_user> <_file> => changes the owner of <_file> to <_user>  

// MongoDB  
$ ./mongod --dbpath ../data/db  
$ mongo (another cmd)  
$ show dbs  
$ use <db>  
$ db  
$ show collections  
$ db.<collaction>.drop()  
$ db.<collaction>.insert({…})  
$ db.<collection>.find()  

// NPM  
$ sudo chown -R $(whoami) <path> | $(npm config get prefix)  


# UBUNTU #

## ~/.bashrc ##
'# alias l='ls -CF'  
'# alias la='ls -a'  
'# alias ll='ls -all'  
alias ld='ls -l'  
alias cls='clear && reset'  
PS1='\[\033[01;32m\]${PWD} \[\033[00m\]\$ '

## Programs ##
Gnome Tweaks, Gnome Global Application Menu, Unity or Docky or Latte or Dash-to-dock (oob),  
GIMP, VLC, K3b,  
Terminator,  
GParted, KDE Partition Manager, UNetbootin,  
https://atom.io, 

## Scripts ##
- NodeJs: sudo apt install nodejs  
- NPM: sudo apt install npm  
- GIT: sudo apt install git  
- Chrome: sudo apt install google-chrome-stable
- D (ntfs):  
sudo mkdir -p /media/c  
sudo fdisk -l (ex: sda3 is our D drive)  
sudo mount -t ntfs -o nls=utf8,umask=0222 /dev/sda3 /media/c  

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

## Sublime Text 3 ##
- sudo add-apt-repository ppa:webupd8team/sublime-text-3
- sudo apt-get update
- sudo apt-get install sublime-text-installer  

## Docky ##
Open gconf-editor. Navigate to */apps/docky-2/Docky/Items/DockyItem/*. Change *Hue* to 1 DockyItemCommand to *gksu nautilus /usr/share/applications*. Click on your Docky Anchor. Type in your password. Navigate to the program icon you would like to change.  

- - - -

$ git config credential.helper store  
$ git push http://example.com/repo.git  
Username: <type your username>  
Password: <type your password>


- - - -

# COMMON #

## Terminal ##
- RGB(0, 43, 54): Turkuaz
- RGB(0, 43, 0): Green
- RGB(26, 26, 26): Grey
