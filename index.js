const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const User = require('./models/user')
const config = require('./config/key')

//application/x-www-form-urlencoded 를 해석
app.use(bodyParser.urlencoded({ extend: true }))
//applicaion/json
app.use(bodyParser.json())
app.use(cookieParser())

const mongoose = require('mongoose')
mongoose
    .connect(config.mongoURI, {
        useNewUrlParser: true,
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

app.post('/login', (req, res) => {
    // 요청한 이메일이 DB에 있는지 확인
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: '해당 유저가 존재하지 않습니다.',
            })
        }
        // 요청된 이메일이랑 PW가 일지한지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({ loginSuccess: false, message: '비밀번호가 틀렸습니다' })

            // 확인이 되면 토큰을 생성하기
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err)
                ///토큰을 어디에 저장할까? 쿠키? 로컬스토리지? 여기선 쿠키. => cookieparser가 필요함
                res.cookie('x_auth', user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
