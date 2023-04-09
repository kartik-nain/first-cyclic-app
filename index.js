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

mongoose.connect(process.env.MongoDbUrl).then(() => console.log("Connected to MongoDb")).catch((err) => console.log(err))

app.use(express.static(__dirname + '/public'));

app.engine(
    '.hbs',
    exphbs.engine(
        {
             extname: '.hbs'
        }
    )
)

app.set(
    'view engine',
    '.hbs'
)

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

app.listen(port, () => console.log(`App running at port : ${port}`))