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
* Modified json files
* Reorganized project files

**20161008**:
* Added a working native host (written in c++)
* Changed behavior of how apps are launched
* Removed all the old temporary hosts (*sh files)
* Replaced the preference UI
* Added a functional preference menu to register, change, or remove apps
* Associating a *.json files for storing preference data
* Replaced some html ids and classes
* Added an error message
* Added a lot of comments in the *.js and *.cpp files

## Installation Instruction (temporary):
* Clone the source from github:
    git clone https://github.com/ma-santoso/Web-Speech-API/
* Copy message.json to NativeMessagingHosts directory
    cp /Web-Speech-API/app/json/message.json ~/.config/chromium/NativeMessagingHosts/
* Add permission to allow execution of the message file
    chmod +x /Web-Speech-API/app/message
* Load the /Web-Speech-API/app folder in chromium extension via 'Load unpacked extension..."
* Copy the extension id
* Edit message.json and paste the "chrome-extension" property with the id you just copied then save
* Launch the app by mentioning the trigger word (open,launch, run, execute), followed by one of the available apps in a sentence

## Default available apps:
* file manager = nemo
* image editor = gimp
* music player = spotify
* office software = libreoffice
* terminal emulator = termite
* text editor = nano

## To-do List:
* ~~Making a barebone~~
* ~~Implementing the API~~
* ~~Finishing the UI~~
* ~~Adding a parser~~
* ~~Creating a native host~~
* ~~Linking app with the native host~~
* ~~Adding a preferences option~~
* Adding a support Bahasa Indonesia
* Adding more capabilities (such as to retrieve search results etc)
