import gulp from 'gulp';
import webdriver from 'gulp-webdriver';
import { join } from 'path';
import { env } from 'process';
import { argv } from 'yargs';
const ROOT = join(__dirname, '../wdio/');

gulp.task('wdio', function() {
    // set target config
    let config = 'a15.conf.js';

    // set target spec
    if (argv.f) {
        env.specs = argv.f;
    }

    return gulp.src(join(ROOT, config))
        .pipe(webdriver());
});
