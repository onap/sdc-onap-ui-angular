# ONAP-UI-ANGULAR Style-Guide and Components

This project aims to create a unified UI styled components for multiple development teams who work on the same web-based applications. 
This repository contains the definition of all the basic widgets and reusable controllers. 

Note: the project is build of 3 different projects:
1. [onap-ui-common](https://github.com/onap-sdc/onap-ui-common) - contains HTML and SCSS files for all components
2. [onap-ui-angular](https://github.com/onap-sdc/onap-ui-angular) - contains Angular components according to the HTML defined in onap-ui-common
3. [onap-ui-react](https://github.com/onap-sdc/onap-ui-react) - contains React components according to the HTML defined in onap-ui-common


### Usage

To start using this library you need to install 2 libraris:
1. onap-ui-angular or onap-ui-react.
2. onap-ui-common

```js
npm install --save-dev onap-ui-angular
npm install --save-dev onap-ui-common
```

#### Link the library's CSS file
The main CSS file is defined in onap-ui-common library.
There are several options to link it to your project:

###### Angular CLI projects
You can add this line to src/style.css file:
```js
@import "node_modules/onap-ui-common/lib/style.css";
```

Angular CLI project has angular.json file, that defines location of styles files.
By default angular.json contains the following definition:
```js
	"styles": [
	  "src/styles.css"
	],
```
So you can add to src/styles.css import of onap-ui-common styles.

###### HTML
```html
<link rel="stylesheet" href="node_modules/onap-ui-common/lib/style.css">
```

###### As Module (Using loading tool, i.e. [Webpack](https://webpack.github.io/))
```js
import 'onap-ui-common/lib/style.css';
```

###### Importing SCSS typography files
onap-ui-common also contains to SCSS files:
variables.scss
mixins.scss

You can import these files to your project and get the same color scheme and variables line onap-ui-common.


#### Using the library in Angular 8
###### Add the library to your module
```js
  import { SdcUiComponentsModule, SdcUiComponents } from 'onap-ui-angular';

  @NgModule({
	declarations: [
	  AppComponent
	],
	imports: [
	  BrowserModule,
	  FormsModule,
	  HttpClientModule,
	  SdcUiComponentsModule
	],
	providers: [
		SdcUiComponents.ModalService
	],
	bootstrap: [AppComponent]
  })
  export class AppModule { }
```	


### Running storybook
The components in this library are displayed via [storybook](https://github.com/storybooks/storybook). Head to [http://onap-sdc.github.io/onap-ui-angular](http://onap-sdc.github.io/onap-ui-angular) to see the components that are in `master`.

While developing, just run `npm run storybook` in your terminal to launch a local storybook server where you can see your changes.

### Compatibility and build

The local 6.0.0 candidate targets Angular 8.2.14, RxJS 6.5.5 and Zone.js 0.9.1.
It no longer declares Angular 6 or 7 compatibility. It uses the unchanged
onap-ui-common 1.4.0 styling contract; consumers must provide that stylesheet.
The library version is independent of the Angular framework version. This
candidate is not a published or reserved release.

The compiler is TypeScript 3.5.3. View Engine metadata emission is retained with
`enableIvy: false`, `skipTemplateCodegen: true` and `skipMetadataEmit: false`, so
consumer AOT builds compile the library templates. Existing public exports and
flat `dist/<feature>/...` deep imports are retained, alongside `dist/index.js`,
`dist/index.d.ts`, `dist/index.metadata.json` and the UMD entry points. Angular
and RxJS remain external to the UMD bundles.

Use Node 10.24.1 / npm 6.14.12 for installation, ngc, UMD, static Storybook and
packaging, matching Maven and the build/publisher workflows. Use Node 18.20.8
for Jest. The static gallery uses Storybook 5.3.21; tests use Jest 24.9.0 and
jest-preset-angular 7.1.1. Sass styles are compiled with Dart Sass, not node-sass.
The test-only installation can use `npm install --ignore-scripts --no-package-lock`
to avoid the legacy Angular devkit's optional native Sass dependency.

```sh
npm install
npm run build
npm run storybook:build
npm pack --dry-run
npm pack
```

On the Jest runtime, run `npm test -- --ci --coverage --runInBand`. Storyshots
continues to render the gallery through TestBed, and coverage thresholds remain
unchanged. Static Storybook builds fail on unhandled promise rejections.

Angular 8 and these Node runtimes are end-of-life. This is a migration checkpoint,
not a supported or security-compliant platform. Consumer AOT/runtime integration
and release-version availability must be checked before any publication.


### Useful guides
[Adding a new component](https://github.com/onap-sdc/onap-ui-angular/wiki/Adding-a-new-component)

[Understanding project build](https://github.com/onap-sdc/onap-ui-angular/wiki/Understanding-project-build)

### Having some trouble? Have an issue?
For bugs and issues, please use the [issues](https://github.com/onap-sdc/onap-ui-angular/issues) page

### How to Contribute
**Contribution can be made only by following these guide lines**
* This project combines both `React` & `Angular` framework libraries. Hence, every change in the basic HTML files structure, must be followed by changes on react and angular projects ([onap-ui-angular](https://github.com/onap-sdc/onap-ui-angular), [onap-ui-react](https://github.com/onap-sdc/onap-ui-react)).
* There will be no any 3rd party UI framework imported (i.e. `Bootstrap`, `Material`, `Foundation`... etc.).
* Contribution are done only by the [contribution guide](https://github.com/onap-sdc/onap-ui-angular/wiki/Contribution-guide). Contributions submitted not in this format and guidelines will not be considered.
