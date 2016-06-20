/*
for all dependencies in "node_modules" folder:
$ npm install --save-dev gulp
$ npm install --save-dev gulp-util
etc.

for browserify javascript dependencies (then require the libraries in tagline.coffee and template.js):
$ npm install --save-dev jquery
$ npm install --save-dev mustache
*/
var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	browserify = require('gulp-browserify'),
	concat = require('gulp-concat');


// files set as an array - is easier to add multiples here than in the task
var coffeeSources = ['components/coffee/tagline.coffee'];	// individual files or
//var coffeeSources = ['components/coffee/*.coffee'];		// all files

var jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js',
];


// compile coffeescript
gulp.task('coffee', function() {
	gulp.src(coffeeSources)							// get source files with gulp.src
		.pipe(coffee({bare: true})					// options: bare - compile to js without safety wrapper
			.on('error', gutil.log))				// log error so gulp doesn't crash on coffescript error
		.pipe(gulp.dest('components/scripts'))		// output in new destination folder
});


// combine all js files into 1 file named 'script.js'
gulp.task('js', function () {
	gulp.src(jsSources)
		.pipe(concat('script.js'))
		.pipe(browserify())							// browserify adds libraries (jquery, mustache) as dependencies rather than through CDN
		.pipe(gulp.dest('builds/development/js'))
});