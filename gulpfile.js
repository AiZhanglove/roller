/**
 * Created by sunxh on 2017/6/28.
 */
var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var htmlminify = require("gulp-html-minify");
var proxy = require('http-proxy-middleware');
gulp.task('sass', function() {
    return gulp.src('./styles/**/*.scss').pipe(sass({ outputStyle: 'compressed' })).pipe(gulp.dest('./styles'));
});

gulp.task('html', function() {
    gulp.src('./*.html').pipe(connect.reload());
});

gulp.task('js', function() {
    gulp.src('./*.js').pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(['./styles/**/*.scss', './*.html', './js/*.js'], ['sass', 'html', 'js']);
});

gulp.task('server', function() {
    connect.server({
        port: '8008',
        livereload: true,
        middleware: function(connect, opt) {
            return [
                proxy('/v1', {
                    target: 'https://api.jr.mi.com/',
                    changeOrigin: true,
                    onProxyReq: function(proxyReq, req, res) {
                        //此处设置cookie
                        proxyReq.setHeader(
                            'Cookie',
                            'xmuuid=XMGUEST-7DF94DF0-4C29-11E7-8910-9743660886A8; Hm_lvt_4982d57ea12df95a2b24715fb6440726=1496912677; mstuid=1496912675153_4606; serviceToken=Um/8bxgf1QW3gaI+q7QDGIQNqOVQ44kLpwoK3gIstiE5cLBI8HZoSgh/n5gNlz8lcGqfIiarLM43NkbNnNxzJY3HQUFp9YSbUuS/ONkftcHr7z2LqK+y7O0+85oykXKXVjqFz2X08CrT7AVTYsynyQ7exI4Yy8zSnYKaSbBVAF+5LJ2LmtNbBlsNGoTlilcfX5iqaeFp32UDPUpCRzE3OBMv07M5bd5MyzCJxkiPZwU=; userId=9417460; mifiapi_slh=q0YnOpX520XYVLQEVAivnvbv144=; mifiapi_ph=mEsY7psVK2nwGcyNzgHiFg=='
                        );
                    }
                })
            ];
        }
    });
});

gulp.task('pubhtml', function() {
    gulp.src(['./*.html'])
        .pipe(htmlminify())
        .pipe(gulp.dest('./dist'));
});
gulp.task('pubjs', function() {
    gulp.src(['./js/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('pubcss', function() {
    gulp.src(['./styles/*.css']).pipe(gulp.dest('./dist/styles'));
});

gulp.task('build', ['pubhtml', 'pubjs', 'pubcss']);

gulp.task('dev', ['server', 'sass', 'watch']);
