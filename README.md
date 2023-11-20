# Frontend Multi Sig Wallet Project

This is the frontend files ReactJS for the Multi Sig Wallet Smart Contracts developed under the Hardhat Framework. You can find the [hardhat github project here](https://github.com/warrenseah/multi-sig-wallet).It is required prior to running this ReactJS app that you spin a local hardhat blockchain network. The RainbowKit Wallet is set to detect for the hardhat local blockchain network in order for this codebase to work.

## Install All Dependencies

`npm install`

## Specify the .env Global Variables

```shell
REACT_APP_ALCHEMY_KEY=""
REACT_APP_SC_ADDRESS=""
REACT_APP_INFURAID=""
REACT_APP_PROJECTID=""
GENERATE_SOURCEMAP=false
```

The alchemy key is required to get data from the blockchain network. REACT_APP_SC_ADDRESS is the deployed factory smart contract. By default, it will be 0x5FbDB2315678afecb367f032d93F642f64180aa3

Infura id is required for allowing Ledger wallet to connect to this dApp. The projectId can be generated from creatubg an account with [walletConnect here](https://cloud.walletconnect.com/sign-in)

These environment variables should be good for you to proceed with running the ReactJs app.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)
