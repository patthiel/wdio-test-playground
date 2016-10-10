import {readdirSync} from 'fs';

const tasks = readdirSync('./gulp/tasks/');

// use commonjs require here for dynamic loading
tasks.forEach(task => require('./tasks/' + task));
