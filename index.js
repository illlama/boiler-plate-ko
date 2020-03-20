const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const User = require('./models/user')
const config = require('./config/key')

//application/x-www-form-urlencoded 를 해석
app.use(bodyParser.urlencoded({ extend: true }))
//applicaion/json
app.use(bodyParser.json())

const mongoose = require('mongoose')
mongoose
    .connect(config.mongoURI, {
        useNewUserParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', (req, res) => {
    //회원 가입할때 필요한 정보들을 client에 가져오면 그것들을 DB에 넣어준다
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if (err) return res.json({ sucess: false, err })
        return res.status(200).json({ sucess: true })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
