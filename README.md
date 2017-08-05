

## Extensions ##

### VS Code ###
- Out of box
- Mac: ~/.vscode/extensions
- Ubuntu: Home/.vscode/extensions
- "editor.fontSize": 13,  
  "window.zoomLevel": -0.5,  
  "terminal.integrated.fontSize": 12

### Sublime ###
- TypeScript
- Babel ES6/ES7
- JsFormat

### Atom ###
- Atom-Typescript: https://github.com/TypeStrong/atom-typescript
- Atom-React: https://github.com/orktes/atom-react (clone into .atom\packages folder)
- Stylesheet: 
.tree-view {
  // background-color: whitesmoke;
  font-size: 10px;
}

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
alias la='ls -a'  
alias ld='ls -all'  
alias ll='ls -list'  
alias cls='clear && printf "\e[3J"'  
export PS1="\W \$ "  
eval $(/usr/libexec/path_helper -s)  

## shortcuts ##
AC2V2zZQ
F11 		=> Show desktop
Cmd + Shift + . => show hidden files
Cmd + Q 	=> close the application without trace
Cmd + `		=> tab between windows of same application
ln -s <path>	=> creates a link of <path> in the current folder

// MongoDB
$ mongod —-dbpath ../data/db
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
- alias cls='clear && reset'
- export PS1='\W \$ '

## Sublime Text 3 ##
- sudo add-apt-repository ppa:webupd8team/sublime-text-3
- sudo apt-get update
- sudo apt-get install sublime-text-installer

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
