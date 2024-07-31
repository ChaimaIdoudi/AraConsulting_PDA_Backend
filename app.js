const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('./root/auth')
const OfRoot = require('./root/ofRoot')
const StockRoot = require('./root/StockRoot')

// require database connection
const dbConnect = require('./db/dbConnect')
// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  next()
})
// execute database connection
dbConnect()
const User = require('./models/userModel')

// body parser configuration
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (request, response, next) => {
  response.json({ message: 'Hey! This is your server response!' })
  next()
})
//------------------------------------------------------///
app.use('/ofs', OfRoot.router)
app.use('/stocks', StockRoot.router)

// register endpoint
app.post('/register', (request, response) => {
  // hash the password
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new User({
        matricule: request.body.matricule,
        password: hashedPassword,
      })

      // save the new user
      user
        .save()
        // return success if the new user is added to the database successfully
        .then((result) => {
          response.status(201).send({
            message: 'User Created Successfully',
            result,
          })
        })
        // catch error if the new user wasn't added successfully to the database
        .catch((error) => {
          response.status(500).send({
            message: 'Error creating user',
            error,
          })
        })
    })
    // catch error if the password hash isn't successful
    .catch((e) => {
      response.status(500).send({
        message: 'Password was not hashed successfully',
        e,
      })
    })
})
// login endpoint
app.post('/login', (request, response) => {
  // check if email exists
  User.findOne({ matricule: request.body.matricule })

    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {
          // check if password matches
          if (!passwordCheck) {
            return response.status(400).send({
              message: 'Passwords does not match',
              error,
            })
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userMatricule: user.matricule,
            },
            'RANDOM-TOKEN',
            { expiresIn: '24h' }
          )

          //   return success response
          response.status(200).send({
            message: 'Login Successful',
            matricule: user.matricule,
            token,
          })
        })
        // catch error if password does not match
        .catch((error) => {
          response.status(400).send({
            message: 'Passwords does not match',
            error,
          })
        })
    })
    // catch error if matricule does not exist
    .catch((e) => {
      response.status(404).send({
        message: 'Matricule not found',
        e,
      })
    })
})
// free endpoint
app.get('/free-endpoint', (request, response) => {
  response.json({ message: 'You are free to access me anytime' })
})

// authentication endpoint
app.get('/auth-endpoint', auth, (request, response) => {
  response.json({ message: 'You are authorized to access me' })
})

module.exports = app
