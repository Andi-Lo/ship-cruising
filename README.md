# Ship Cruising Project ![travis-ci]

[travis-ci]: https://travis-ci.com/Andi-Lo/ship-cruising.svg?token=hejt5J6fVuz1qkWoWxT7&branch=master

## Project Structure

* `data/` Some project related stuff like documents and excel sheets
* `src/harbours/` The currently existing routes that got provided. Used for the select dropdown on the frontend to pick one
* `src/images/` Needed images for the frontend. E.g. the marker styling
* `src/js/` The javascript codebase. Gets bundled by browserify into bundle.js
  * `src/js/libs/` Libraries we either needed to include or wrote ourself
  * `src/js/modules/` Modules that are divided into their specific purpose. Could be seen as classes
  * `src/js/observers/` Observers are responsible for the input handling coming from the tools frontend
* `src/map/` The map in different formats. Currently we use a the 2025_tiles.geojson map which has a 10m resolution
* `src/tool/` Code that is needed for the tool UI in index.html
* `src/index.html` Markup for the tool
* `tests/` Setting up the test suite. We are using Mocha & Chai
* `tests/libs/` Unit-Tests for the libs folder. Currently the code base is not test covered because we ran out of time. Feel free to add more Unit Tests
* `.babelrc` The settings for babel. We currently use the plugin "transform-async-to-generator" which enables us to use [iterator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators).
* `.eslintignore` Files we want to ignore from linting. E.g. libs that we did not wrote ourself
* `.eslintrc` Our eslint configuration, extended from google
* `.gitignore` Trivial
* `.travis.yml` Configuration for the [travis continuous integration service](https://travis-ci.com/Andi-Lo/ship-cruising)
* `gulpfile.js` Basic task running via gulp. However you should use the available tasks that are defined in the `package.json`. Otherwise you would need gulp globaly installed on your machine.
* `package.json` Listing the dependencies. Provides you the following commands:
  * `$npm start` Starts the server on localhost port 3000
  * `$npm run build` Builds the bundle.js file via browserify
  * `$npm run build-dev` Builds the project. Minifies the bundle.js. Results will be in a dist/ folder
  * `$npm run quicktest` Runs the Unit Tests. If you don't want to know the percentage of test coverage this will be way quicker executed
  * `$npm run test` The standard test task which we use on travis-ci. Includes test coverage output

## License

<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>. <br />
Please Provide proper Attribution to Kevin Klugmann and Andreas Lorer
