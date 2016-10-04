# Web Speech API Test
## History:
**20160913**: 
* Created *.html, *.css, and *.js files.

**20160914**:
* Added mic icon
* Added onerror properties

**20160915**:
* Added more error events
* Updated the icon
* Integrated into a chrome app

**20160917**:
* Implemented local storage

**20160918**:
* Implemented nativeMessaging API

**20160919**:
* Improved nativeMessaging API
* Added more built-in commands
* Improved user interface

**20160922**:
* Added more operations (opening music, office, etc)
* Move repo to public
* Added installation instruction (temporary)
* Added list of available commands

**20160928**:
* Revamped the UI
* Added a function
* Added some animations
* Added a preference menu (UI only)
* Added an about menu

**20160930**:
* Slight UI changes
* Change a few app behaviours
* Redefined some element ids
* Fixed some links

**20161003**:
* Implemented a simple parser, allowing a more fluid commands
* Cleaned/optimized some js codes

**20161004**:
* Slightly modified the parser function
* Fixed some links

## Installation Instruction (temporary):
* Clone the source from github:
    git clone https://github.com/ma-santoso/Web-Speech-API/
* Copy *.json files to NativeMessagingHosts directory
    cp /Web-Speech-API/app/*.json ~/.config/chromium/NativeMessagingHosts/
* Add permission to allow execution of the *.sh files
    chmod +x /Web-Speech-API/app/*.sh
* Edit the *.sh and *json file if necessary, to suit your needs
* Load the /Web-Speech-API/app folder in chromium extension via 'Load unpacked extension..."
* Copy the extension id
* Edit /app/terminal.json and paste the "chrome-extension" property with the id you just copied then save
* Launch the app via 

## Current available commands:
* open terminal
* open libre office
* open file explorer
* open image editor
* open text editor
* what time is it

## To-do List:
* ~~Making a barebones~~
* ~~Finishing the UI~~
* ~~Adding a parser~~
* Creating a native host
* Linking app with the native host
* Adding a preferences option
