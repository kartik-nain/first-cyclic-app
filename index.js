const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const UsernameModel = require('./models/username')
const port = process.env.port
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')

// registering the bodyparser
app.use(bodyParser.urlencoded({extended: false}))


const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MongoDbUrl);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

//Connect to the database before listening
connectDB().then(() => {
    app.listen(port, () => {
        console.log("listening for requests");
    })
})

//To display css file
app.use(express.static(__dirname + '/public'));

//Implementing the template engine
app.engine(
    '.hbs',
    exphbs.engine(
        {
             extname: '.hbs'
        }
    )
)

//Setting the engine
app.set(
    'view engine',
    '.hbs'
)

//Handling routes
app.get('/', (req,res) => {
    res.render('manage-usernames', {errorMessage: req.query.errorMessage})
})

app.post('/add-username', (req,res) => {
    UsernameModel
        .findOne({username: req.body.username})
        .then((usernam) => {
            if(usernam){
                res.status(409).send('Username already exist')
            }else{
                const usernameModel = UsernameModel({
                    username: req.body.username
                })

                usernameModel.save().then(() => res.send('Success')).catch(err => res.send(err.message))
            }
        })
})

app.get('/get-usernames', (req,res) => {
    UsernameModel
        .find()
        .then((users) => {
            if(users){
                res.status(200).json(users)
            }else{
                res.status(400).send('Error')
            }
        })
})