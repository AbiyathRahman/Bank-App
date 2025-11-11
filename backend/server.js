const express = require('express');
const MongoStore = require('connect-mongo');
require('dotenv').config({ path: './.env'});
const session = require('express-session');
const app = express();

const port = process.env.PORT || 4000; 
const cors = require('cors');
const db = require('./db/conn');

// routes
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const logoutRoutes = require('./routes/logout');
const homeRoutes = require('./routes/home');
const accountsRoutes = require('./routes/accounts');
const transactionsRoutes = require('./routes/transaction');
const summaryRoutes = require('./routes/summary');
app.use(cors(
    {
        origin: "http://localhost:3000",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials:true,
        optionsSuccessStatus: 204,
        allowedHeaders: ["Content-Type", "Authorization"],
    }
));
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
        mongoUrl: process.env.ATLAS_URI
    })
}));

app.use(express.json());
app.use('/', registerRoutes);
app.use('/', loginRoutes);
app.use('/', logoutRoutes);
app.use('/', homeRoutes);
app.use('/', accountsRoutes);
app.use('/', transactionsRoutes);
app.use('/', summaryRoutes);
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    db.connectToServer(function (err) {
        if (err) console.log(err);
    });
    console.log(`Bank app listening on port ${port}`);
});
