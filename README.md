# Installation

You'll need several things to run this project:

You'll need yarn for the package managment: <https://yarnpkg.com/lang/en/docs/install/#mac-stable>

You'll need Node.js 10.12.0 installed and running.

You'll need MongoDB of at *least* 3.3.2 installed and the main mongodb daemon process running (a.k.a mondgod).

Once you have all of that you'll need to run a `yarn install`. That should give you all of the packages for this project.

## Creating the MongoDB database

You'll need to create a local database named `rhinoexpress` on port 27017. It should only need one collection called `people`.

## Running locally

After you've got all of the dependencies installed and all of the required DB processes running. You can run the app using: `yarn dev`. That should start the server listening for api requests at: <http://localhost:3000/api>

It's helpful to run these requests using an API development tool like: <https://www.getpostman.com/.>

## Making calls

All requests return JSON as the document format.

All requests requiring data expect raw JSON as the passed values.

## Structure

All of the api routes are in the `server.js` file along with their DB operations. Validation and models are in separate files.
