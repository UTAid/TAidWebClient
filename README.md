# TAid Web Front-end
A web client built using Angular2 for [TAid](https://github.com/UTAid/TAidBackend)

## What's being used?

Angular2, NPM, gulp, and SystemJS. TypeScript is used instead of vanilla JS.

## How to run it?

#### Set up the Django backend

Set up the [TAid Django backend](https://github.com/UTAid/TAidBackend/tree/cors)
in a seperate directory (**use the `cors` branch**! See below). Run migrations if
needed, and create a superuser `python manage.py createsuperuser`. We will be
using this user to login. Finally, run the server `python manage.py runserver 8000`.

**cors:** Since the client is being served on a different port, your browser
will reject Django's response (unless it's IE, of course). A CORS (Cross-Origin
Resource Sharing) middleware is needed. Make sure you are using the code from
the `cors` branch.

#### Set up the client

1. Install NPM (Node package manager) v5.x
  * For linux instructions, see here: https://github.com/nodesource/distributions/blob/master/README.md

2. `cd` to root directory, run `npm install`
  * Errors and warnings may appear. Warnings can be safely ignored. Errors can
  be ignored unless they appear at the end of `npm install`

3. Run `npm start`. It starts the client server, and a browser window will open.
  * This also syncs the browser with the typescript compiler. Whenever there is
  a change in the client files, the browser will automatically refresh.

## Notes

If there is something before the experimental stage, this repo would be it.
'Smashing keys untill it works' stage would be fitting...
