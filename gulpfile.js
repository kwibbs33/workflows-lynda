var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee');

// coffeescript files set as an array - is easier to add multiples here than in the task
var coffeeSources = ['components/coffee/tagline.coffee'];	// individual files or
//var coffeeSources = ['components/coffee/*.coffee'];		// all files

// compile coffeescript
gulp.task('coffee', function() {
	gulp.src(coffeeSources)	// get source files with gulp.src
		.pipe(coffee({bare: true})					// options: bare - compile to js without safety wrapper
			.on('error', gutil.log))				// log error so gulp doesn't crash on coffescript error
		.pipe(gulp.dest('components/scripts'))		// output in new destination folder
});