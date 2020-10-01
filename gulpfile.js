const { src, dest, watch, series, parallel } = require('gulp');
const server = require('browser-sync').create();
const sass = require('gulp-sass');

const files = { 
    scssPath: 'src/scss/*.scss',
    btScss: 'node_modules/bootstrap/scss/bootstrap.scss',
    jsPath: 'node_modules/bootstrap/dist/js/bootstrap.min.js',
    jqPath: 'node_modules/jquery/dist/jquery.min.js',
    poPath: 'node_modules/popper.js/dist/umd/popper.min.js'
};

// Compile sass into CSS & auto-inject into browsers
function scssTask() {
    return src([files.btScss, files.scssPath])
        .pipe(sass())
        .pipe(dest('src/css'))
};

// Move the javascript files into our /src/js folder
function jsTask() {
    return src([files.jsPath, files.jqPath, files.poPath])
        .pipe(dest('src/js'))
};

// Static Server + watching scss/html files
function reload(done) {
    server.reload();
    done();
}

function watchTask(){
    watch([files.btScss, files.scssPath],
        {interval: 1000, usePolling: true}, 
        series(
            parallel(scssTask, jsTask),
            reload
        )
    );    
}

function serve(done){
    server.init({
        server: {
            baseDir:'./src'
        }
    });
    done();
}


exports.default = series(parallel(scssTask, jsTask), serve, watchTask);