# Breath of the Wild Cookbook

This is a work-in-progress web application and cooking companion to _The Legend of Zelda: Breath of the Wild (2017)_.

Predict the full data, effects, and selling price of any dish or elixir recipe! Just pick one to five ingredients and click "Cook!"

## Getting Started

You'll need Node.js v8+ and Yarn.

Clone the repo and navigate to the repo's root directory. Then, enter the following commands:

```
yarn install
```

That's it! You're ready to build and run.

## Available Scripts

First, you should build the main data file in the `src/data/` directory. To do this, while in the repo's root directory, enter

```
node src/data/exporter.js
```

This runs a script that parses and exports the data needed by the application into one big JSON file, `src/data/all.json`.

Now, in the project directory, you can run one or more of the following:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
The app is ready to be deployed!

## Contributing

This is intended to be a solo project to develop and show off my skills in ES6, React, and web development. For this reason, I'm currently not accepting contributions.

## Other Notes

This project was developed using VSCode. I highly recommend using the VSCode software when browsing and navigating this code.