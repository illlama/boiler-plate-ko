const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose
    .connect('mongodb+srv://illlama:z123123@boilerplate-idd4m.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUserParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
