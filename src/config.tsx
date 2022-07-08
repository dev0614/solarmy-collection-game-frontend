import { PublicKey, SystemProgram } from "@solana/web3.js";
export const NETWORK = "mainnet-beta"; //mainnet-beta | devnet
export const ADMINS = [
    "7TBRMXkRbVpRWgLkrrTaqFJvXSMkMwnNKEZ4dbRh8Lnf",
    "FePFmE1CbbTkiKg4K9A41dQcXfhPqLSJrEBcdXwBj3aa",
    "A8rgsJecHutEamvb7e8p1a14LQH3vGRPr796CDaESMeu"
]
export const LIVE_URL = "https://solarmy.herokuapp.com/"

export const GLOBAL_AUTHORITY_SEED = "global-authority";
export const TREASURY_WALLET = new PublicKey('BEQZXkjg1BzY5349FXGPgvsbySWw5R7zjEC4xQhzmQR5');
export const PROGRAM_ID = "Geb2fkVJMgNbjPwMkcjfR3n4AiN7DKqKwctFwfErkbn7";

export const METAPLEX = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
export const SOLSCAN_API = "https://public-api.solscan.io/transaction/";
export const RPC_URL = "https://a2-mind-prd-api.azurewebsites.net/rpc";

export const RAFFLE_SIZE = 64168;
export const COLLECTION_SIZE = 12816;
export const DECIMALS = 1000000000;
export const EMPTY_ADDRESS = SystemProgram.programId.toBase58();

export const DEPLOY_LEVEL = [
    {
        id: 0,
        value: 1,
        title: "1 DAY",
        option: "90 AMMO"
    },
    {
        id: 1,
        value: 5,
        title: "5 DAYS",
        option: "540 $AMMO (90 per day + 90 bonus)"
    },
    {
        id: 2,
        value: 15,
        title: "15 DAYS",
        option: "1620 $AMMO (90 per day + 270 bonus)"
    },
    {
        id: 3,
        value: 30,
        title: "30 DAYS",
        option: "3150 $AMMO (90 per day + 450 bonus)"
    },
]