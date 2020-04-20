# Base Static Website Template (Use pug.js, ES6, SASS/SCSS)

A lightweight foundation for your next webpack based frontend project.


### Installation

```
npm install
```
or
```
yarn
```

### Start Dev Server

```
npm start
```
or
```
yarn start
```

### Build Prod Version

```
npm run build
```
or
```
yarn build
```

### Features:

* ES6 Support via [babel](https://babeljs.io/) (v7)
* SASS Support via [sass-loader](https://github.com/jtangelder/sass-loader)
* Linting via [eslint-loader](https://github.com/MoOx/eslint-loader)

When you run `npm run build` we use the [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) to move the css to a separate file. The css file gets included in the head of the `index.html`.
