var gulp = require('gulp'),
sass = require('gulp-sass'),
rename = require('gulp-rename'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
inject = require('gulp-inject'),
util = require('gulp-util'),
minifyCss = require('gulp-minify-css'),
templateCache = require('gulp-angular-templatecache'),
sequence = require('gulp-sequence'),
gulpBowerFiles = require('gulp-bower-files'),
wiredep = require('wiredep').stream,
minifyHTML = require('gulp-minify-html'),
order = require('gulp-order'),
server = require( 'gulp-develop-server' ),
karmaServer = require('karma').Server;


var NwBuilder = require('node-webkit-builder');
var nw = new NwBuilder({
    files: './deskapp/**/**', // use the glob format
    platforms: ['osx32', 'osx64', 'win32', 'win64'],
    version: '0.0.1'
});

//Unit testing
gulp.task('test', function (done) {
    new karmaServer({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});

//Create Executeables
gulp.task('exe',function(){
   // Build returns a promise
    nw.build().then(function () {
       console.log('all done!');
    }).catch(function (error) {
        console.error(error);
    });
});

//Convert SASS to CSS
gulp.task('sass',function(){
	util.log('SASS -> CSS');
	return gulp.src('app/scss/**/*.scss')
		.pipe(order(['global.scss','**/*.scss']))
	   .pipe(sass())
	   .pipe(concat('main.css'))
	   .pipe(minifyCss())
	   .pipe(gulp.dest('dist/css'));
});

//Minify Javascript
gulp.task('javascript',function(){
	util.log('Javascript file...');
	return gulp.src(['app/src/**/*.js'])
	.pipe(order(['src/app.js','**/*.js']))
	.pipe(concat('script.js'))		   
	.pipe(rename('script.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/script'));
});

//Create template cache
gulp.task('template',function(){
	util.log('Template Cache...');
	return gulp.src(['app/src/**/*.html','!app/src/index.html'])
	.pipe(minifyHTML({ empty: true }))
	.pipe(templateCache({standalone:true}))
	.pipe(uglify())
	.pipe(gulp.dest('dist/template'));
});

gulp.task('bower-copy',function(){
	return gulpBowerFiles().pipe(gulp.dest("dist/bower_components"));
});

gulp.task('bower-minify',function(){
	util.log('Minification of  bower components');
	return gulp.src('dist/bower_components/**/*.js')
	.pipe(uglify())
	.pipe(gulp.dest("dist/bower_components"));
});

gulp.task('bower-inject',function () {
  return gulp.src('dist/index.html')
    .pipe(wiredep({
		ignorePath:'../',
		exclude:['bower_components/footable/css/footable.core.css']
	}))
    .pipe(gulp.dest('dist'));
});

//Inject files to index
gulp.task('inject',function(){
	util.log('Inject to index');
	var target = gulp.src('app/src/index.html'),
	jsSources = gulp.src(['dist/template/*.js','dist/script/*.js'],{read:false},{relative: true}),
	cssSource = gulp.src(['dist/css/*.css'],{read:false},{relative: true});
	target.pipe(inject(jsSources,{ignorePath:'dist/', addRootSlash:false}))
	.pipe(inject(cssSource,{ignorePath:'dist', addRootSlash:false}))
	.pipe(gulp.dest('dist/'));
});

//Watch for file changes
gulp.task('watch',function(){
	gulp.watch('app/scss/**/*.scss',['sass']);
	gulp.watch('app/src/**/*.js',['javascript']);	
	gulp.watch('app/src/**/*.html',['template']);
});

gulp.task('bower',sequence('bower-copy','bower-inject','bower-minify'));
gulp.task('build',sequence(['sass','javascript','template'],'inject','bower','watch','server:start'));


// run server 
gulp.task('server:start', function(){
    server.listen({path:'server.js'});
});

// restart server if server.js changed 
gulp.task( 'server:restart', function() {
    gulp.watch( [ 'server.js' ], server.restart );
});

