# ZLibrary CLI
![screenshot](screenshots/startmenu.png)
- [ZLibrary CLI](#zlibrary-cli)
- [Installation](#installation)
- [Features](#features)
  * [Search](#search)
  * [ZLibrary account systems](#zlibrary-account-systems)
  * [Downloading](#downloading)
- [How does this work?](#how-does-this-work)

**Note: If you've installed a version before 1.0.5, update the domain from https://1lib.ch to https://singlelogin.me in the settings**
# Installation

Installation can be done using `sudo npm install -g zlibrary-cli`

Run the CLI with: `zlib-cli`

supported systems: GNU/Linux with nodeJS 12+ installed

# Features
## Search
- Filtering by book name
- Filtering by release years of books
- Filtering by file extensions
- Filtering by language of book
## ZLibrary account systems
- Login
    - Login via email & password
    - Login via remix user tokens
- Signing up
- Logging out
- Personal domains
    - Update personal domain via settings
## Downloading
- Modify download directory via settings

# How does this work?
This CLI uses a reverse engineered version of the android api for ZLibrary. An unofficial documentation of the API can be seen here: https://github.com/baroxyton/zlibrary-eapi-documentation
