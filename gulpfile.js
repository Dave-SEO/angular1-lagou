/**
 * Created by zn on 2017/3/4.
 */
// 定义模块
 var gulp = require('gulp'); // 引入gulp
 var $ = require('gulp-load-plugins')(); // 不是必须的，有了他可以通过$符号引用gulp-less等，不需要声明//*必须加括号实例化
 var pump = require('pump');
 var open = require('open');

 var app = { //定义目录路径
     srcPath: 'src/', // 源码放置的位置
     devPath: 'build/', // 整合后放置的文件，开发放置的文件
     prdPath: 'dist/' // 生产部署的文件
 };
// 引入安装的第三方依赖
 gulp.task('lib', function() {
     gulp.src('bower_components/**/*') // 读取所有文件并且深度遍历
         //操作文件
         .pipe(gulp.dest(app.devPath + 'vendor')) // 拷贝到build目录下并改名为vendor
         .pipe(gulp.dest(app.prdPath + 'vendor'))
         .pipe($.connect.reload()); // 刷新浏览器
 })
 gulp.task('html', function () {
     gulp.src(app.srcPath + '**/*.html') // 读取所有的html文件
         .pipe(gulp.dest(app.devPath))
         .pipe(gulp.dest(app.prdPath))
         .pipe($.connect.reload());
 })
gulp.task('json', function () {
    gulp.src(app.srcPath + 'data/**/*.json')
        .pipe(gulp.dest(app.devPath))
        .pipe(gulp.dest(app.prdPath))
        .pipe($.connect.reload());
})
gulp.task('less', function () {
    gulp.src(app.srcPath + 'style/css/index.less')
        .pipe($.less())
        .pipe(gulp.dest(app.devPath + 'style/css'))
        .pipe($.cssmin())
        .pipe(gulp.dest(app.prdPath + 'style/css'))
        .pipe($.connect.reload());
})
gulp.task('js', function() {
    gulp.src(app.srcPath + 'script/**/*.js')
        .pipe($.concat('index.js'))
        .pipe(gulp.dest(app.devPath + 'js'))
        .pipe($.uglify())
        .pipe(gulp.dest(app.prdPath + 'js'))
        .pipe($.connect.reload());
});
gulp.task('images', function () {
    gulp.src(app.srcPath + 'images/**/*')
        .pipe($.imagemin())
        .pipe(gulp.dest(app.devPath + 'images'))
        .pipe(gulp.dest(app.prdPath + 'images'))
        .pipe($.connect.reload());
})
// 清除 dev  prd
gulp.task('clean', function() {
    gulp.src([app.devPath, app.prdPath])
        .pipe($.clean())
        .pipe($.connect.reload());
});
// 总的构建
gulp.task('build', ['images', 'js', 'less', 'lib', 'html', 'json']);
gulp.task('serve', ['build'], function () {
    $.connect.server({
        root: [app.prdPath], // 读取的文件
        livereload: true, // 热加载
        port: 3000
    })
    open('http://localhost:3000'); // 打开浏览器
    gulp.watch('bower_components/**/*', ['lib']);
    gulp.watch(app.srcPath + '**/*.html', ['html']);
    gulp.watch(app.srcPath + 'data/**/*.json', ['json']);
    gulp.watch(app.srcPath + 'style/**/*.less', ['less']);
    gulp.watch(app.srcPath + 'script/**/*.js', ['js']);
    gulp.watch(app.srcPath + 'images/**/*', ['images']);
})
gulp.task('default', ['serve']);
// gulp-plumber 编译css js时发生错误不会终止线程，提示错误