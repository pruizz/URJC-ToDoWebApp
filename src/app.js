import express from 'express';

// Template engine
import mustacheExpress from 'mustache-express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from 'cookie-parser';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Routers
import { baseRouter } from './routes/base.route.js';
import { tasksRouter } from './routes/tasks.route.js';
import { usersRouter } from './routes/users.route.js';

// Setup Express App
const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', mustacheExpress(), "html");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../public'));
app.use(express.json());
app.use(cookieParser());


// Use Routers
app.use('/', baseRouter);
app.use('/', tasksRouter);
app.use('/', usersRouter);

// Start the server
app.listen(3000, () => console.log('Listening on port 3000!'));
