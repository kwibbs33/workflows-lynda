/*
for all dependencies in "node_modules" folder:
<$ npm install --save-dev gulp>
<$ npm install --save-dev gulp-util>
etc.

for browserify javascript dependencies (then require the libraries in tagline.coffee and template.js):
<$ npm install --save-dev jquery>
<$ npm install --save-dev mustache>
*/
var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	cleanDest = require('gulp-clean-dest'),
	connect = require('gulp-connect'),
	concat = require('gulp-concat');


/* declare then set variables */
var env,
	coffeeSources,
	jsSources,
	sassSources,
	htmlSources,
	jsonSources,
	outputDir

// set the environment to 'development'. can change here to 'production' then run <$ gulp>. or <$ NODE_ENV=production gulp>
env = process.env.NODE_ENV || 'development';
if (env === 'development') {
	outputDir = 'builds/development';
	sassStyle = 'expanded';
} else {
	outputDir = 'builds/production';
	sassStyle = 'compressed';
}

// files set as an array - is easier to add multiples here than in the task
coffeeSources = ['components/coffee/tagline.coffee'];	// individual files or "*.coffee" all files

jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js',
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '/*.html'];
jsonSources = [outputDir + '/js/*.json'];


/* run task in terminal:
<$ gulp coffee>
<$ gulp js>
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
		.pipe(gulp.dest(outputDir + '/js'))
		.pipe(connect.reload())						// live reload html file on change
});


// process sass and compass
gulp.task('compass', function () {
	gulp.src(sassSources)
		.pipe(compass({								// https://www.npmjs.com/package/gulp-compass
			sass: 'components/sass',
			image: outputDir + '/images',
			style: sassStyle,
			comments: true
		}).on('error', gutil.log))					// log error so gulp doesn't crash on sass error
		.pipe(gulp.dest(outputDir + '/css'))
		.pipe(cleanDest('css'))						// include original line numbers from scss files in css file
		.pipe(connect.reload())						// live reload html file on change
});


/* tip: you can make a dependent task run before this task by naming it second:
gulp.task('js', ['coffee'], function () {
 */


// monitor files for changes and automatically execute task on change <$ gulp watch> (then CTRL-c to stop watching)
gulp.task('watch', function () {
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);	// * any .scss files in folder
	gulp.watch(htmlSources, ['html']);
	gulp.watch(jsonSources, ['json']);
});



// gulp-connect creates a server like mamp (https://www.npmjs.com/package/gulp-connect)
gulp.task('connect', function () {
	connect.server({
		root: outputDir,
		livereload: true				// automatically reloads page - on initial task run below (must also add pipe to above tasks on change)
	});
});


// live reload any changes to the html and json files
gulp.task('html', function () {
	gulp.src(htmlSources)
		.pipe(connect.reload())						// live reload html file on change
});
gulp.task('json', function () {
	gulp.src(jsonSources)
		.pipe(connect.reload())						// live reload html file on change
});


/* one task that runs all functions */
//gulp.task('all', ['coffee', 'js', 'compass']);		// <$ gulp all>
//gulp.task('default', ['coffee', 'js', 'compass']);	// or use 'default' to be run when just calling 'gulp' in terminal
gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);
