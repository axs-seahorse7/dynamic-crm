import createError from 'http-errors';
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser';
import logger from 'morgan'
import { fileURLToPath } from "url";
import corse from 'cors'
import conectDb from './db/config/db.configure.js'
import notificationsRoutes from "./routes/notification.js";


conectDb()

import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'

var app = express();

app.use(corse())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads",express.static(path.join(process.cwd(), "uploads")));

app.use('/', indexRouter);
app.use('/api', usersRouter);
app.use("/api/notifications", notificationsRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
