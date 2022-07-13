import { PublicKey } from "@solana/web3.js";

export const NETWORK = "devnet"; //mainnet-beta | devnet
export const LIVE_URL = "https://solarmy.herokuapp.com/";
export const CREATOR_2D_ADDRESS = "C3t2xtqA2NFTDqs1SJgcHxyaNqCE4JYnT9EqRySVXYfK";

export const GLOBAL_AUTHORITY_SEED = "global-authority";

export const STAKING_PROGRAM_ID = new PublicKey("ERhUcUHS64zRDzuY3Wj18KGxqp7TzwY2eDoXGMRfJKth");
export const AMMO_TOKEN_MINT = new PublicKey("H3rmqbVz8NTCkGABeue3yc9PgioL2i1RPrQM45itdKMu");
export const AMMO_TOKEN_DECIMAL = 1_000_000_000;

export const USER_POOL_SIZE = 5648;     // 8 + 5640

export const DAY_LENGTH = 100 //86400
// export const DAY_LENGTH = 60 * 60 * 24 //86400
export const DEPLOY_LEVEL = [
    {
        id: 0,
        value: 1,
        title: "1 DAY",
        option: "90 AMMO",
        showOption: "90"

    },
    {
        id: 1,
        value: 5,
        title: "5 DAYS",
        option: "540 $AMMO (90 per day + 90 bonus)",
        showOption: "540 + 90 Bonus"
    },
    {
        id: 2,
        value: 15,
        title: "15 DAYS",
        option: "1620 $AMMO (90 per day + 270 bonus)",
        showOption: "1350 + 270 Bonus"
    },
    {
        id: 3,
        value: 30,
        title: "30 DAYS",
        option: "3150 $AMMO (90 per day + 450 bonus)",
        showOption: "2700 + 450 Bonus"
    },
];

export const TOPPLAYER2D = [
    {
        rank: 1,
        rankFormat: "1st",
        userName: "QuickTrigger",
        userAddress: "7TSu5dSRbnbxRgYb1bwwAELyP5bWWugRCug8vqg1UL7V",
        points: 10450
    },
    {
        rank: 2,
        rankFormat: "2nd",
        userName: "Primal_Hunber",
        userAddress: "Fe4KejEc1pgo6MxjfRGYL1u5qMpYN7FMxPKYjbrdsFFE",
        points: 3290
    },
    {
        rank: 3,
        rankFormat: "3rd",
        userName: "You",
        userAddress: "2qT3LnqwJizZ3niuLi6Mhn9KxtCQVeisHQ4DoqYceL6c",
        points: 3290
    },
    {
        rank: 4,
        rankFormat: "4th",
        userName: "Tip'n'Run",
        userAddress: "GCJ8aa9RrnCdkhcECYABM1usfzJvqLBuyJHfUz6DW1UE",
        points: 3290
    }
];
export const TOPPLAYER3D = [
    {
        rank: 1,
        rankFormat: "1st",
        userName: "QuickTrigger",
        userAddress: "7TSu5dSRbnbxRgYb1bwwAELyP5bWWugRCug8vqg1UL7V",
        points: 10450
    },
    {
        rank: 2,
        rankFormat: "2nd",
        userName: "You",
        userAddress: "2qT3LnqwJizZ3niuLi6Mhn9KxtCQVeisHQ4DoqYceL6c",
        points: 3290
    },
    {
        rank: 3,
        rankFormat: "3rd",
        userName: "Primal_Hunber",
        userAddress: "Fe4KejEc1pgo6MxjfRGYL1u5qMpYN7FMxPKYjbrdsFFE",
        points: 3290
    },
    {
        rank: 4,
        rankFormat: "4th",
        userName: "Tip'n'Run",
        userAddress: "GCJ8aa9RrnCdkhcECYABM1usfzJvqLBuyJHfUz6DW1UE",
        points: 3290
    }
];