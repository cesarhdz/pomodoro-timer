var
gulp = require('gulp'),
mocha = require('gulp-mocha')


gulp.task('test', function(){

	var test = mocha({
		reporter: 'spec',
		ui: 'bdd'
	});

	return gulp.src('specs/**/*.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(test);

});


gulp.task('test:watch', function(){

	var pattern = ['specs/**/*.js', 'src/**/*'];

	// Start test 
	gulp.start('test');

	// and watch files changes
	gulp.watch(pattern, ['test']);
	
});