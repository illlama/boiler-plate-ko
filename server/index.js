const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const User = require('./models/User')
const config = require('./config/key')
const auth = require('./middleware/auth')
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

app.post('/api/users/register', (req, res) => {
    //회원 가입할때 필요한 정보들을 client에 가져오면 그것들을 DB에 넣어준다
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if (err) return res.json({ sucess: false, err })
        return res.status(200).json({ sucess: true })
    })
})

app.post('/api/users/login', (req, res) => {
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

// role 1은 어드민, 2는 특정 부서 어드민
// role 0은 일반 유저, 0이 아니면 관리자

app.get('/api/users/auth', auth, (req, res) => {
    // 여기까지 auth미들웨어를 통과해서 왔다는 것은, Authentication이 true라는 것.
    res.status(200).json({
        //전달해줄 유저 정보를 적는다
        _id: req.user._id, // => 얘넨 auth에서 token이랑 user를 다시 넣어줬기 때문에 가능한거임
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    // console.log('req.user', req.user)
    User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).send({
            success: true,
        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


///뭔차이냐!!!!
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");

//application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));

//application/json 
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World!~~ '))

app.get('/api/hello', (req, res) => res.send('Hello World!~~ '))

app.post('/api/users/register', (req, res) => {

  //회원 가입 할떄 필요한 정보들을  client에서 가져오면 
  //그것들을  데이터 베이스에 넣어준다. 
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})

app.post('/api/users/login', (req, res) => {

  // console.log('ping')
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {

    // console.log('user', user)
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      // console.log('err',err)

      // console.log('isMatch',isMatch)

      if (!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

      //비밀번호 까지 맞다면 토큰을 생성하기.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다.  어디에 ?  쿠키 , 로컳스토리지 
        res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      })
    })
  })
})


// role 1 어드민    role 2 특정 부서 어드민 
// role 0 -> 일반유저   role 0이 아니면  관리자 
app.get('/api/users/auth', auth, (req, res) => {
  //여기 까지 미들웨어를 통과해 왔다는 얘기는  Authentication 이 True 라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  // console.log('req.user', req.user)
  User.findOneAndUpdate({ _id: req.user._id },
    { token: "" }
    , (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })
    })
})





const port = 5000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))