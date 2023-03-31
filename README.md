# 🛡️ Web3 antivirus browser extension
## How it works?

 We inject a script into the user's page, which wraps the user's wallet calls in our proxy wrapper.

Then, we pass the information to another script of ours, which makes a request to our backend service, analyzes the invoked transaction, and returns data about it, including possible detections. We display the analysis results on the user's page.

Additionally, in the background, we check the websites visited by the user for phishing using our backend service, and if there is a danger, we display a warning message.

## Available Scripts

Install dependencies:

```bash
yarn install
```


In the project directory, you can run:

```bash
yarn dev
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

```bash
yarn build
```

In order to get the extension, you need to run the command `yarn build`
and after the `build` folder you need to add it to chrome://extensions/

```bash
yarn watch` or `yarn watch-win`
```

The command allows you to make changes and see the changes immediately in the browser panel. This command only works for popup. This command does not work for inject.js. Before the very first launch, you need to run the `yarn build` command and add the extension to google chrome.
This functionality works thanks to the code located in scripts.watch.js