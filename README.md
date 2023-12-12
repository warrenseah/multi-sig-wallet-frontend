# Frontend Multi Sig Wallet Project

This is the frontend files ReactJS for the Multi Sig Wallet Smart Contracts developed under the Hardhat Framework. You can find the [hardhat github project here](https://github.com/warrenseah/multi-sig-wallet).It is required prior to running this ReactJS app that you spin a local hardhat blockchain network. The RainbowKit Wallet is set to detect for the hardhat local blockchain network in order for this codebase to work.

## Install All Dependencies

`npm install`

## Specify the .env Global Variables

```shell
REACT_APP_ALCHEMY_KEY=""
REACT_APP_FACTORY_ADDRESS=""
REACT_APP_INFURAID=""
REACT_APP_PROJECTID=""
GENERATE_SOURCEMAP=false
```

Copy the contents of .env-example into the newly create .env file. Start specifying the fields required for the dApp.

The alchemy key is required to get data from the blockchain network. REACT_APP_SC_ADDRESS is the deployed factory smart contract. By default, it will be 0x5FbDB2315678afecb367f032d93F642f64180aa3

Specifed an address into REACT_APP_FACTORY_ADDRESS to start experiencing this dApp.

### Addresses

| Networks                   |                                                            Address                                                            |
| -------------------------- | :---------------------------------------------------------------------------------------------------------------------------: |
| Sepolia (Ethereum Testnet) | [0x8dd226171765924dDb195Bd1d5b675D577105D99](https://sepolia.etherscan.io/address/0x8dd226171765924dDb195Bd1d5b675D577105D99) |
| Hardhat Local Blockchain   |                                          0x5FbDB2315678afecb367f032d93F642f64180aa3                                           |

Infura id is required for allowing Ledger wallet to connect to this dApp. The projectId can be generated from creatubg an account with [walletConnect here](https://cloud.walletconnect.com/sign-in)

These environment variables should be good for you to proceed with running the ReactJs app.

# Getting Started with dApp

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Instructions

Load main wallet address into Metamask under Sepolia Ethereum testnet and click connect button. Make sure you have sepolia Eth in your wallet addresses.

Under 'Create New Wallet', specify 3 wallet addresses and specify 2 for quorem. Click Create button. Wait for transaction receipt before proceeding to the next step.

Under 'Select Contract Address', choose the walletId that was created by you a moment ago from the dropdown list. Next, click Display button.

Under 'Smart Contract Stats', you will find the deployed Multi Sig Wallet which you have just created from the Factory smart contract. You will also find 3 wallet addresses that are the owners of this MultiSigWallet and the quorem. and the balance residing in this wallet address.

## dApp Interactions

### Deposit

Anyone can deposit Eth into the wallet.

**Only Owner's Action**
The functions are restricted only to owners and as a result, the owners will only be able to perform these actions such as 'Create Withdrawal' and 'Approve Withdrawal'.

### Create Withdrawal

Specify a recipient wallet address and the amount in Eth to be withdrawn if this transaction are approved by at least 2 of the owners. Once a Create button is clicked and the transaction is finished, a list item under 'Transaction Approval List' will be inserted.

### Approve Withdrawal

Specify the withdrawal ID and click Approve button. Once transaction is finished, you will find the approval under the respective transaction item to be incremented by 1.

The moment when approval for any item is increment to be equal to the quorem of the wallet contract, the amount of Eth specified in the withdrawal transaction will be sent to the recipient address. And the item in the transaction approval list will be removed from display.

This concludes all the functions you can intereact with the Multi Sig Wallet smart contract via this dApp. I hope that you have a wonderful journey into web3. All the best and take care!

## Available Scripts

In the project directory, you can run:

### `npm start`

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
