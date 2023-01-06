# Web3 antivirus browser extension
## General information
There are three entry points into the application:

    index.tsx - this code will be inserted into popUp
    inject.tsx - this code will be inserted into external pages
    background.js - https://developer.chrome.com/docs/extensions/mv3/service_workers/

Work of three different entry points configured through craco.config.js


After adding a library to the project, or changing `craco.config.js`, new files can be added in the `build` folder.
In this case, you will need to update the `manifest.json` which is in the `public` folder.


## Available Scripts

Install dependencies:

```bash
CXXFLAGS="--std=c++14" yarn
```


In the project directory, you can run:

### `yarn dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.



### `yarn build`
In order to get the extension, you need to run the command `yarn build`
and after the `build` folder you need to add it to chrome://extensions/


### `yarn watch` or `yarn watch-win`
The command allows you to make changes and see the changes immediately in the browser panel. This command only works for popup. This command does not work for inject.js. Before the very first launch, you need to run the `yarn build` command and add the extension to google chrome.
This functionality works thanks to the code located in scripts.watch.js
