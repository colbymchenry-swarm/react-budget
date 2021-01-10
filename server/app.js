var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var session = require('express-session');
var cookieSession = require('cookie-session')
var usersRouter = require('./routes/users')
var budgetsRouter = require('./routes/budgets')
var transactionsRouter = require('./routes/transactions')
var incomesRouter = require('./routes/incomes')
var cors = require('cors')
const util = require( 'util' )
var mysql = require('mysql')
var app = express();

require('dotenv').config()

app.set('trust proxy', 1) // trust first proxy
app.use(cors())
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var database = makeDb({
  host     : process.env.REACT_APP_MYSQL_HOST,
  user     : process.env.REACT_APP_MYSQL_USER,
  password : process.env.REACT_APP_MYSQL_PASS,
  port     : process.env.REACT_APP_MYSQL_PORT,
  database : process.env.REACT_APP_MYSQL_DATABASE
})

createTables()

app.use(function(req, res, next) {
  res.locals.connection = database;
  //res.header("Access-Control-Allow-Origin", "https://react-budget-client.vercel.app");
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/users', usersRouter)
app.use('/budgets', budgetsRouter)
app.use('/transactions', transactionsRouter)
app.use('/incomes', incomesRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var server = http.createServer(app);
server.listen(4000, "0.0.0.0");

function createTables() {
  database.query('CREATE TABLE IF NOT EXISTS users (google_id varchar(25) NOT NULL, monthly_income double, PRIMARY KEY (google_id))')
  database.query('CREATE TABLE IF NOT EXISTS budgets (id int NOT NULL AUTO_INCREMENT, name varchar(255), amount double, fixed bool, google_id varchar(25) NOT NULL, PRIMARY KEY (id))')
  database.query('CREATE TABLE IF NOT EXISTS transactions (id int NOT NULL AUTO_INCREMENT, budget_id int, amount double, timestamp DATE, description TEXT, google_id varchar(25) NOT NULL, PRIMARY KEY (id))')
  database.query('CREATE TABLE IF NOT EXISTS incomes (id int NOT NULL AUTO_INCREMENT, amount double, timestamp DATE, description TEXT, google_id varchar(25) NOT NULL, PRIMARY KEY (id))')
}

function makeDb( config ) {
  const connection = mysql.createConnection( config );
  return {
    query( sql, args ) {
      return util.promisify( connection.query )
        .call( connection, sql, args );
    },
    close() {
      return util.promisify( connection.end ).call( connection );
    }
  };
}
