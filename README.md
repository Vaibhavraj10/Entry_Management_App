
# Entry Management Web App

> An entry management app built using Node.js that can manage the records of visitors and perform functions accordingly.


- This web app can take the input from the visitor's as well as Host's details like Name, Email, Phone number, Checkin time and Checkout time.
- At the same time can perform the management options like:
   - sending email and sms to the host regarding visitor's stay, after checking in by visitor.
   - After checking out, email would be sent to the visitor regarding their stay.


## Table of Contents


- [Installation](#installation)
- [Features](#features)



---

## Installation

> Requirements 
- Node Js, Mongo db, NPM
- Mailjet username (API KEY) and Password (API KEY) for sending emails. Account can be created <a href="https://app.mailjet.com/signup" target="_blank">here!</a>
- Datagen authorisation key and verified sender ID for sending sms. Account can be created <a href="https://global.datagenit.com/register.html" target="_blank">here!</a>


### Clone

- Clone this repo to your local machine using `https://github.com/Vaibhavraj10/Entry_Management_App.git`

### Setup
> Enter your Mailjet and Datagen credentials in config/mailer.js and save it.

> Install required npm packages

```shell
$ npm install
```
> Run the mongoDb sever
```shell
$ mongod
```
> Run app.js

```shell
$ node app.js
```
> Open the browser and enter the URL
```
http://localhost:3000/
```
---

## Features
- Login, Signup and Logout feature 
- Visitor's Checkin in functionality and sending the details of the visitor to the host by sms and email.
- Visitor's Checking out and sending of email to visitor regarding the details of his stay by email.


## Code and technologies used
- I used `Node.Js` and `Express.js` for designing the backend, along with `EJS` as templating engine. For database, I used `MongoDB` with `Mongoose` as its object modeling tool.
- Further, I also used Nodemailer and Mailjet SMTP for sending emails and Datagen API for sending sms.

---



