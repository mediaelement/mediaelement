import gulp from 'gulp';
import sass from 'gulp-sass';
import babel from 'gulp-babel';
import autoprefixer from 'gulp-autoprefixer';

let output_folder = './build';

let js_files = [
	'src/js/test.es6.js'
];

gulp.task('sass', () => {
  return gulp.src('./src/scss/mediaelement.scss')
    .pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
    .pipe(gulp.dest(output_folder));
});
 
gulp.task('sass:watch', () => {
  gulp.watch('./src/scss/**/*.scss', ['sass']);
});

gulp.task('babel', () => {
	return gulp.src(js_files)
        .pipe(babel())
        .pipe(gulp.dest(output_folder));

});

gulp.task('babel:watch', () => {
	gulp.watch('./src/js/**/*.es6.js', ['babel']);
});

gulp.task('default', ['sass', 'babel', 'babel:watch', 'sass:watch']);