/** gulp tasks **/

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    gzip = require('gulp-gzip');

gulp.task('default', function() {
    return gulp.src('src/*.js')
        .pipe(uglify())
        .pipe(gzip({
            preExtension: 'dist'
        }))
        .pipe(gulp.dest('dist'));
});
