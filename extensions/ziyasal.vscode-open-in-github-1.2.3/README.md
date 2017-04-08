![vscode-open-in-github](https://github.com/ziyasal/vscode-open-in-github/raw/master/images/icon_200.png?raw=true "Open in GitHub / Bitbucket / visualstudio.com")  
**Supports :** GitHub, Bitbucket, Visualstudio.com

> Extension for Visual Studio Code which can be used to jump to a source code line in Github / Bitbucket

[![Build Status](https://travis-ci.org/ziyasal/vscode-open-in-github.svg?branch=master)](https://travis-ci.org/ziyasal/vscode-open-in-github)

## Install

**Tested with VsCode 0.10.1**  

Press <kbd>F1</kbd> and narrow down the list commands by typing `extension`. Pick `Extensions: Install Extension`.

![installation](https://github.com/ziyasal/vscode-open-in-github/raw/master/screenshots/install.png?raw=true "installation")

Simply pick the `Open in GitHub / Bitbucket` extension from the list

##Install Manual

**Mac & Linux**
```sh
cd $HOME/.vscode/extensions
git clone https://github.com/ziyasal/vscode-open-in-github.git
cd vscode-open-in-github
npm install
```

**Windows**
```
cd %USERPROFILE%\.vscode\extensions
git clone https://github.com/ziyasal/vscode-open-in-github.git
cd vscode-open-in-github
npm install
```

## Usage

**Command**  

Press <kbd>F1</kbd> and type `Open in GitHub`.

![open](https://github.com/ziyasal/vscode-open-in-github/raw/master/screenshots/open-in-github.png?raw=true "Open function")

Press <kbd>F1</kbd> and type `Copy GitHub link to clipboard`.

![copy](https://github.com/ziyasal/vscode-open-in-github/raw/master/screenshots/copy.png?raw=true "Copy function")

**Keybord Shortcut**  

 Press <kbd>Ctrl+L G</kbd> to activate.
 Press <kbd>Ctrl+L C</kbd> to copy active line link to clipboard.
 
**Context menu**  

Right click on explorer item and choose `Open in GitHub` or `Copy GitHub link to clipboard`.

![context](https://github.com/ziyasal/vscode-open-in-github/raw/master/screenshots/context-menu.png?raw=true "Context menu options")

**Configure custom github domain**  
 
 Add following line into workspace settings; 
 ```json
{
	"openInGitHub.gitHubDomain":"your custom github domain here"
}
```  
Have fun..

## License

MIT © [Ziya SARIKAYA @ziyasal](https://github.com/ziyasal)
