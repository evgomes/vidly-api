# Vidly API

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Movie rental API built as the final project for [Node.js: The Complete Guide to Build RESTful APIs](https://www.udemy.com/nodejs-master-class/).

## Online Demo

Access the following link to check the API running on the cloud, hosted on [Heroku](https://www.heroku.com/):

[https://arcane-tor-20765.herokuapp.com/api/genres](https://arcane-tor-20765.herokuapp.com/api/genres)

## How to Run

You will have to follow some steps to test the API.

### 1 - Install MongoDB

To run this project, you need to install the latest version of MongoDB Community Edition first.

[https://docs.mongodb.com/manual/installation/](https://docs.mongodb.com/manual/installation/)

### 2 - Install Node.js

Download and install Node.js. Make sure to download and install the latest stable version (LTS).

[https://nodejs.org/en/download/](https://nodejs.org/en/download/)

To check if Node.js was installed succesfully, run the following command in terminal or command prompt:

```node --version```

You should see an output like this:

```v10.13.0```

It indicates that Node.js is running.

### 2 - Install the API Dependencies

Open the project folder using the terminal or command prompt, then type the following:

```npm i```

The command above will install all node modules needed for the API to run. If you are using Linux or MacOS and receive a permission denied message, use ```sudo```.

### 3 - Run the Tests

After installing all dependencies, run the following command to execute all unit and integration tests, to assert that the app is ready to be executed:

```npm test```

All tests should pass. It may take a while to execute.

### 4 - Set the Environment Variables

You will have to set an environment variable to use as the secure key for JSON web tokens of the app. If you are using Linux or MacOS, run the following command:

```export vidly_jwtPrivateKey=SomeSecureKeyHere```

If you are using Windows, use the following command:

```set vidly_jwtPrivateKey=SomeSecureKeyHere```

### 5 - Running the Server

After following all steps above, you are ready to start the server. Type the following in the terminal or command prompt:

```node index.js```

This is going to run the application on port 3000. If this port is busy, the API will run in a different port. You can check the output to see in which port the API is running.

Navigate to [http://localhost:3000/api/genres](http://localhost:3000/api/genres). If everything is ok, you should receive a response like this:

```
{
  "success": true,
  "data": []
}
```

The API exposes the following REST routes:

```
/api/genres
/api/customers
/api/movies
/api/rentals
/api/returns
/api/users
/api/auth
```

Go ahead and play around with the API to check the available operations.