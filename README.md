# 🥔🥔🥔 Super Potato NFT Raffle | Solan | Next.js + Typescript

<p align="center">
    <img src="./.github/preview.png" alt="Super potato" />
</p>

## 📖 Requirements
### 👶 User side
- Collection register
- Raffle create <br />
  They will have to pay about 0.4 SOL per NFT when creating a raffle.
- Buy tickets
- Withdraw NFT (after end time & and not sold any tickets)
- Reveal winner
- Claim reward
### 👨‍💻 Admin side
- User-registered Accept/Deny of collection
### Like FFF Raffle (famous fox federation)
[rafffle.famousfoxes.com](https://rafffle.famousfoxes.com/)
<br />

## Mindfolk Landing Page
[www.mindfolk.art](https://www.mindfolk.art/)

## 🌐 Deployed
[superpotato-raffle.herokuapp.com/](https://superpotato-raffle.herokuapp.com/)


## 🛠 ※ SET PROJECT ENVIRONMENT
### Firebase set
Replace firebase configuration values <br />
`src/api/firebase.ts` <br/>
```tsx
const firebaseConfig = {
    apiKey: "AIzaSyAI_r1Rs11kIsWJFiCVA4aGt58ffsZrclY",
    authDomain: "mindfolk-raffle-afb92.firebaseapp.com",
    projectId: "mindfolk-raffle-afb92",
    storageBucket: "mindfolk-raffle-afb92.appspot.com",
    messagingSenderId: "106626330620",
    appId: "1:106626330620:web:c3343f7736902e58774c79",
    measurementId: "G-NHD9LYKTVJ"
};
```
### Project config data
`src/config.tsx` <br />
```tsx
export const NETWORK = "mainnet-beta"; //mainnet-beta | devnet
export const ADMINS = [
    "7TBRMXkRbVpRWgLkrrTaqFJvXSMkMwnNKEZ4dbRh8Lnf",
    "FePFmE1CbbTkiKg4K9A41dQcXfhPqLSJrEBcdXwBj3aa",
    "A8rgsJecHutEamvb7e8p1a14LQH3vGRPr796CDaESMeu" // developer wallet address
]

// deployed url
export const LIVE_URL = "https://superpotato-raffle.herokuapp.com/" 
// treasury wallet address
export const TREASURY_WALLET = new PublicKey('BEQZXkjg1BzY5349FXGPgvsbySWw5R7zjEC4xQhzmQR5');
//smart contract program id
export const PROGRAM_ID = "Geb2fkVJMgNbjPwMkcjfR3n4AiN7DKqKwctFwfErkbn7"; 
// solana RPC url
export const RPC_URL = "https://a2-mind-prd-api.azurewebsites.net/rpc";

```

## Install

```bash
npm run install
# or
yarn install
```
## Development

```bash
npm run dev
# or
yarn dev
```

## 🔥 Database
Google **Firebase**
- **collections** <br />
    When users send a request to register a Collection, it is stored in the database Collection calls **collections**.<br />
    Admin can **Accept** or **Deny** those collections. <br />
    All collections are also stored on the blockchain.
- **raffles** <br />
    When user create a raffle, it saved also database `raffles` document. <br />
    Raffle on db is updated, when those actions <br />
    `buy tickets`, `reveal winner`, `withdraw nft`, `claim reward`
  
## Resolved issues

### Transaction confirmation issue
```
Seems to me the transaction is taking more than 60.00 seconds…what is already a big issue…but worse than that someone coded a lock that says if its more than 60 seconds it is a fail.
```
- Use Solscan API<br>
  `https://public-api.solscan.io/transaction/[tx]`
    ```jsx
    await fetch(`https://public-api.solscan.io/transaction/${txId}`)
        .then(resp =>
            resp.json()
        ).then(async (json) => {
            if (json.status === "Success" && json.signer.length !== 0) {
                //update firebase database
                await updateDoc(collectionById, {
                    status: 0,
                    accepted: true,
                    updateTimeStamp: new Date().getTime()
                })
                    .then(() => {
                        //clear timeout & timeinterval 
                        clearTimeout(timeout);
                        clearInterval(timeInterval);
                        successAlert("Transaction is confirmed..");
                    })
            }
        })
        .catch((error) => {
            console.log(error);
        })
  ```
### Page re-render by real-time
`onSnapshort` function of `firebase` with `useEffect`