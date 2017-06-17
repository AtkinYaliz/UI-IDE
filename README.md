

## Extensions ##

### VS Code ###
- Out of box
- Mac: ~/.vscode/extensions
- Ubuntu: Home/.vscode/extensions
- "editor.fontSize": 13,
  "window.zoomLevel": -0.5

### Sublime ###
- TypeScript
- Babel ES6/ES7
- JsFormat

### Atom ###
- Atom-Typescript: https://github.com/TypeStrong/atom-typescript
- Atom-React: https://github.com/orktes/atom-react
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
- alias ls='ls -GFh'
- alias la='ls -a'
- alias ll='ls -all'
- alias cls='clear && printf "\e[3J"'
- export PS1='\W \$ '


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
