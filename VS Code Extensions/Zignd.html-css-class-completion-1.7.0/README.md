# IntelliSense for CSS class names

A Visual Studio Code extension that provides CSS class name completion for the HTML `class` attribute based on the CSS class definitions that can be found in your workspace or in external files referenced through the `link` element.

![](http://i.imgur.com/5crMfTj.gif)

## Features
* Gives you autocompletion for CSS class definitions that can be found in your workspace (defined in CSS files or the in types listed in the Supported Language Modes section)
* Supports external stylesheets referenced through `link` elements in HTML files
* Command to manually re-cache the class definitions used in the autocompletion

## Supported Language Modes
* HTML
* Razor
* PHP
* JavaScript
* JavaScript React (.jsx)
* TypeScript React (.tsx)
* Vue (.vue) [requires [vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)]
* Twig
* Markdown (.md)

## Contributions
You can request new features and/or contribute to the extension development on its [repository on GitHub](https://github.com/Zignd/HTML-CSS-Class-Completion/issues).

## What's new in version 1.7.0 (Jun 9, 2017)
* Added support for Markdown.

Check out the [change log](https://github.com/zignd/HTML-CSS-Class-Completion/blob/1.7.0/CHANGELOG.md) for the current and previous updates.

## Usage
If there are HTML files on your workspace the extension automatically starts and look for CSS class definitions. In case new CSS classes are definined or new CSS files are added to the workspace and you also want auto completion for them simply hit the lightning icon you will find on the status bar and execute the command pressing `Ctrl+Shift+P` and then typing "Cache CSS class definitions".

![](http://i.imgur.com/O7NjEUW.gif)
![](http://i.imgur.com/uyiXqMb.gif)
