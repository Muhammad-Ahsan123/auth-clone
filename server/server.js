const express = require('express')
const cors = require('cors')
const connection = require('./database/mongo-connection')
const router = require('./router/routes')
// const bodyParser = require('body-parser');

const app = express()

// Enable CORS for all routes and all origins
app.use(cors());

require('dotenv').config();

// middleware
// app.use(bodyParser.json());
app.use(express.json())
app.use(cors())
app.disable('x-powered-by')


const port = 8080
connection()


app.use(cors({
    origin: 'http://localhost:5173',  // Allow your frontend to access the backend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true  // Allow credentials like cookies or authorization headers
}));


app.get('/', (req, res) => {
    res.status(200).send('HI Everyone')
})


app.use('/api', router)


app.listen(port, () => {
    console.log(`Your server is running on this port localhost:${port}`);
})

