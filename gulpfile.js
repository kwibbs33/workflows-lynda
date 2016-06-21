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
	compass = require('gulp-compass'),
	cleanDest = require('gulp-clean-dest'),
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
var sassSources = [
	'components/sass/style.scss'
]


/* run in terminal:
$ gulp coffee
$ gulp js
*/

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


// process sass and compass
gulp.task('compass', function () {
	gulp.src(sassSources)
		.pipe(compass({								// https://www.npmjs.com/package/gulp-compass
			sass: 'components/sass',
			image: 'builds/development/images',
			style: 'expanded',
			comments: true
		}).on('error', gutil.log))					// log error so gulp doesn't crash on sass error
		.pipe(gulp.dest('builds/development/css'))
		.pipe(cleanDest('css'))						// include original line numbers from scss files in css file
});


/* tip: you can make a dependent task run before this task by naming it second:
gulp.task('js', ['coffee'], function () {
 */


// monitor files for changes and automatically execute task on change ($ gulp watch) (then CTRL-c to stop watching)
gulp.task('watch', function () {
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);	// * any .scss files in folder
});


// one task that runs all functions
gulp.task('all', ['coffee', 'js', 'compass']);		// $ gulp all
gulp.task('default', ['coffee', 'js', 'compass']);	// or use 'default' to be run when just calling 'gulp' in terminal

