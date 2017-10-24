[![BuildStatus](https://travis-ci.org/UTAid/TAidWebClient.svg?branch=migration-d94)](https://travis-ci.org/UTAid/TAidWebClient)

# TAidWebClient

**TAid** is an application for managing grades and courses.
Developed for Anya Tafliovich at UTSC.


## Requirements

Please see [package.json](package.json) for updated requirements.

## Installation

It is recommended to have Node v6.11.4 installed. This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.2.

### Set-up Frontend
Follow the instructions to setup a local version in your machine:
* `sudo npm install` - This will install all the dependencies
* `ng serve` - This will set up dev server at `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


### Set-up Backend
Follow the set up instructions for the backend available [here](https://github.com/UTAid/TAidBackend)
When creating superuser for backend `set username and password as admin`. This is so
the frontend can connect with the backend.

`WARNING: change username and password before deploying. The credentials for the frontend
can be changed at the file src/app/app.module.ts in the function authCred`

Once all the instructions are followed our backend wil be set up and the
frontend and backend would be connected


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
