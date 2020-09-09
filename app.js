// Requiring nodeJS path lib
const path = require('path');

// Requiring external Libs
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session)
const methodOverride = require('method-override');
const flash = require('connect-flash');

const app = express();

// Setting up EJS as views engine
app.set('view engine', 'ejs');
app.set('views', 'views')

app.use(bodyParser.urlencoded({extended: true})); // Setting body parser to parse incoming request
app.use(express.static(path.join(__dirname, 'public'))); // Setting public folder for static content

app.use(session({
    
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: 'my secret for RT tool, that is regression testing tool',
    resave: false,
    saveUninitialized: false
}))

app.use(flash());

app.use(methodOverride('_method')); // Used to override POST to DELETE/PUT


const testCaseRoutes = require('./routes/testCase');
const authRoutes = require('./routes/auth');


app.use('/integration/testcases',testCaseRoutes);
app.use('/integration', authRoutes);

//Catch ALL - default landing page
app.use('*', authRoutes);

app.listen(3000);