export default {
    input: './build/angular/index.js',
    output: {
        name: 'sdcUiAngular',
        file: './lib/angular/index.umd.js',
        format: 'umd',
        exports: 'named',
        globals: {
            '@angular/core': 'ngCore',
            '@angular/common': 'ngCommon',
            '@angular/forms': 'ngForms'
        }
    },
    external: [
        '@angular/core',
        '@angular/common',
        '@angular/common/http',
        '@angular/upgrade/static',
        '@angular/forms',
        '@angular/platform-browser',
        '@angular/http', 
        '@rxjs/add/operator/debounceTime',
        'rxjs/Subject',
        'rxjs/add/operator/debounceTime',
        'rxjs/add/operator/map',
        'rxjs/BehaviorSubject',
        'rxjs/Subject'
    ],
    onwarn: function(warning) {
        // Skip certain warnings
    
        // should intercept ... but doesn't in some rollup versions
        if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }
    
        // console.warn everything else
        console.warn( warning.message );
    }
};
