import { PublicKey } from "@solana/web3.js";

//mainnet-beta | devnet
export let NETWORK = "mainnet";
export const LIVE_URL = "https://game.solarmy.com/";
export const CREATOR_2D_ADDRESS =
  "3ZaVUqfzVvhTpRgMzDD4ovytksUofFBofPxinezjNoRd";
export const CREATOR_3D_ADDRESS =
  "Am9xhPPVCfDZFDabcGgmQ8GTMdsbqEt1qVXbyhTxybAp";

export const MAIN_2D_CEATOR = "BGSpWrrB6FtnSPZ8PhS7dXiUVLeQyCqxRz3t8cGK2NxH";
export const MAIN_3D_CEATOR = "9VYHEsB5k9CA1gbUbxJ7CsnxhV9GgegjqiCCSy1APNF1";

//Howrare API
export const COLLECTION_RARITY_API =
  "https://api.howrare.is/v0.1/collections/solarmy2d";

// export const API_URL = "https://solarmy-api.herokuapp.com/";
export const API_URL = "https://m2nhd3zypg.us-east-1.awsapprunner.com/";
// export const API_URL = "http://13.231.24.204:3002/";
export const VAULT_SEED = "vault-seed";

export const GLOBAL_AUTHORITY_SEED = "global-authority";

export const STAKING_PROGRAM_ID = new PublicKey(
  "2RbwYVj8gmYf8TRNukd34fGJgT7X4X4K3t6gLGwJkNQD"
);
export const AMMO_TOKEN_MINT = new PublicKey(
  "H1X2quMc8ZesCE4afDQhWAmFssENprmmz9a6SXvHWPoN"
);
export const AMMO_TOKEN_DECIMAL = 1_000_000_000;

export const USER_POOL_SIZE = 5648; // 8 + 5640

export const DAY_LENGTH = 86400;
// export const DAY_LENGTH = 60 * 60 * 24 //86400
export const DEPLOY_LEVEL = [
  {
    id: 0,
    value: 1,
    title: "1 DAY",
    option: "90 AMMO",
    showOption: "90",
  },
  {
    id: 1,
    value: 5,
    title: "5 DAYS",
    option: "540 $AMMO (90 per day + 90 bonus)",
    showOption: "540 + 90 Bonus",
  },
  {
    id: 2,
    value: 15,
    title: "15 DAYS",
    option: "1620 $AMMO (90 per day + 270 bonus)",
    showOption: "1350 + 270 Bonus",
  },
  {
    id: 3,
    value: 30,
    title: "30 DAYS",
    option: "3150 $AMMO (90 per day + 450 bonus)",
    showOption: "2700 + 450 Bonus",
  },
];

export const TOPPLAYER2D = [
  {
    rate: 1,
    rateFormat: "1st",
    userName: "QuickTrigger",
    userAddress: "7TSu5dSRbnbxRgYb1bwwAELyP5bWWugRCug8vqg1UL7V",
    points: 10450,
  },
  {
    rate: 2,
    rateFormat: "2nd",
    userName: "You",
    userAddress: "2qT3LnqwJizZ3niuLi6Mhn9KxtCQVeisHQ4DoqYceL6c",
    points: 3290,
  },
  {
    rate: 3,
    rateFormat: "3rd",
    userName: "Primal_Hunber",
    userAddress: "Fe4KejEc1pgo6MxjfRGYL1u5qMpYN7FMxPKYjbrdsFFE",
    points: 3290,
  },
  {
    rate: 4,
    rateFormat: "4th",
    userName: "Tip'n'Run",
    userAddress: "GCJ8aa9RrnCdkhcECYABM1usfzJvqLBuyJHfUz6DW1UE",
    points: 3290,
  },
  {
    rate: 5,
    rateFormat: "5th",
    userName: "Tip'n'Run",
    userAddress: "GCJ8aa9RrnCdkhcECYABM1usfzJvqLBuyJHfUz6DW1UE",
    points: 3290,
  },
  {
    rate: 6,
    rateFormat: "16th",
    userName: "QuickTrigger",
    userAddress: "7TSu5dSRbnbxRgYb1bwwAELyP5bWWugRCug8vqg1UL7V",
    points: 10450,
  },
  {
    rate: 7,
    rateFormat: "7th",
    userName: "QuickTrigger",
    userAddress: "GCJ8aa9RrnCdkhcECYABM1usfzJvqLBuyJHfUz6DW1UE",
    points: 3290,
  },
  {
    rate: 8,
    rateFormat: "8th",
    userName: "Primal_Hunber",
    userAddress: "Fe4KejEc1pgo6MxjfRGYL1u5qMpYN7FMxPKYjbrdsFFE",
    points: 3290,
  },
  {
    rate: 9,
    rateFormat: "9th",
    userName: "Tip'n'Run",
    userAddress: "GCJ8aa9RrnCdkhcECYABM1usfzJvqLBuyJHfUz6DW1UE",
    points: 3290,
  },
  {
    rate: 10,
    rateFormat: "10th",
    userName: "Tip'n'Run",
    userAddress: "GCJ8aa9RrnCdkhcECYABM1usfzJvqLBuyJHfUz6DW1UE",
    points: 3290,
  },
  {
    rate: 11,
    rateFormat: "11th",
    userName: "QuickTrigger",
    userAddress: "7TSu5dSRbnbxRgYb1bwwAELyP5bWWugRCug8vqg1UL7V",
    points: 10450,
  },
  {
    rate: 12,
    rateFormat: "12th",
    userName: "QuickTrigger",
    userAddress: "QuickTrigger",
    points: 3290,
  },
  {
    rate: 13,
    rateFormat: "13th",
    userName: "Primal_Hunber",
    userAddress: "QuickTrigger",
    points: 3290,
  },
];
export const TOPPLAYER3D = [
  {
    rate: 1,
    rateFormat: "1st",
    userName: "QuickTrigger",
    userAddress: "7TSu5dSRbnbxRgYb1bwwAELyP5bWWugRCug8vqg1UL7V",
    points: 10450,
  },
  {
    rate: 2,
    rateFormat: "2nd",
    userName: "You",
    userAddress: "2qT3LnqwJizZ3niuLi6Mhn9KxtCQVeisHQ4DoqYceL6c",
    points: 3290,
  },
  {
    rate: 3,
    rateFormat: "3rd",
    userName: "Primal_Hunber",
    userAddress: "Fe4KejEc1pgo6MxjfRGYL1u5qMpYN7FMxPKYjbrdsFFE",
    points: 3290,
  },
  {
    rate: 4,
    rateFormat: "4th",
    userName: "Tip'n'Run",
    userAddress: "GCJ8aa9RrnCdkhcECYABM1usfzJvqLBuyJHfUz6DW1UE",
    points: 3290,
  },
  {
    rate: 5,
    rateFormat: "5th",
    userName: "Tip'n'Run",
    userAddress: "GCJ8aa9RrnCdkhcECYABM1usfzJvqLBuyJHfUz6DW1UE",
    points: 3290,
  },
  {
    rate: 6,
    rateFormat: "16th",
    userName: "QuickTrigger",
    userAddress: "7TSu5dSRbnbxRgYb1bwwAELyP5bWWugRCug8vqg1UL7V",
    points: 10450,
  },
  {
    rate: 7,
    rateFormat: "7th",
    userName: "QuickTrigger",
    userAddress: "GCJ8aa9RrnCdkhcECYABM1usfzJvqLBuyJHfUz6DW1UE",
    points: 3290,
  },
  {
    rate: 8,
    rateFormat: "8th",
    userName: "Primal_Hunber",
    userAddress: "Fe4KejEc1pgo6MxjfRGYL1u5qMpYN7FMxPKYjbrdsFFE",
    points: 3290,
  },
  {
    rate: 9,
    rateFormat: "9th",
    userName: "Tip'n'Run",
    userAddress: "GCJ8aa9RrnCdkhcECYABM1usfzJvqLBuyJHfUz6DW1UE",
    points: 3290,
  },
  {
    rate: 10,
    rateFormat: "10th",
    userName: "Tip'n'Run",
    userAddress: "GCJ8aa9RrnCdkhcECYABM1usfzJvqLBuyJHfUz6DW1UE",
    points: 3290,
  },
  {
    rate: 11,
    rateFormat: "11st",
    userName: "QuickTrigger",
    userAddress: "7TSu5dSRbnbxRgYb1bwwAELyP5bWWugRCug8vqg1UL7V",
    points: 10450,
  },
  {
    rate: 12,
    rateFormat: "12nd",
    userName: "QuickTrigger",
    userAddress: "QuickTrigger",
    points: 3290,
  },
  {
    rate: 13,
    rateFormat: "13rd",
    userName: "Primal_Hunber",
    userAddress: "QuickTrigger",
    points: 3290,
  },
];

export const WALLET_NFTS = [
  {
    points: 1000,
    image:
      "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://www.arweave.net/vjOPZwRMR-NNavdQFaAHBzsH7fs4nMGi3rAYupugozA?ext=png",
    collection: "3d",
  },
  {
    points: 1001,
    image:
      "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://www.arweave.net/RhlEy5Q0z5OF_7IwIFAykMWfL94uM2ZrqrY6z0Gt4OE?ext=png",
    collection: "3d",
  },
  {
    points: 1002,
    image:
      "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://www.arweave.net/k_sNcVnVUhZOpdLzcwllVKH2uUlz8U90AaiM-86W_Lg?ext=png",
    collection: "2d",
  },
  {
    points: 1001,
    image:
      "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://www.arweave.net/RhlEy5Q0z5OF_7IwIFAykMWfL94uM2ZrqrY6z0Gt4OE?ext=png",
    collection: "3d",
  },
  {
    points: 1002,
    image:
      "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://www.arweave.net/k_sNcVnVUhZOpdLzcwllVKH2uUlz8U90AaiM-86W_Lg?ext=png",
    collection: "2d",
  },
];

export const POSITION_TABLE_DATA = [
  {
    label: "1",
    content: (
      <p>
        3000 AMMO + 2 Loot boxes&nbsp;
        <span>
          {/* eslint-disable-next-line */}
          <img src="/img/badge/general.svg" alt="" />
        </span>
      </p>
    ),
  },
  {
    label: "2-3",
    content: (
      <p>
        1500 AMMO + 1 Loot box&nbsp;
        <span>
          {/* eslint-disable-next-line */}
          <img src="/img/badge/colonel.svg" alt="" />
        </span>
      </p>
    ),
  },
  {
    label: "4-10",
    content: (
      <p>
        1800 AMMO&nbsp;
        <span>
          {/* eslint-disable-next-line */}
          <img src="/img/badge/major.svg" alt="" />
        </span>
      </p>
    ),
  },
  {
    label: "11-50",
    content: (
      <p>
        800 AMMO&nbsp;
        <span>
          {/* eslint-disable-next-line */}
          <img src="/img/badge/captain.svg" alt="" />
        </span>
      </p>
    ),
  },
  {
    label: "51-100",
    content: (
      <p>
        500 AMMO&nbsp;
        <span>
          {/* eslint-disable-next-line */}
          <img src="/img/badge/lieutenant.svg" alt="" />
        </span>
      </p>
    ),
  },
  {
    label: "101-200",
    content: (
      <p>
        300 AMMO&nbsp;
        <span>
          {/* eslint-disable-next-line */}
          <img src="/img/badge/master sergeant.svg" alt="" />
        </span>
      </p>
    ),
  },
  {
    label: "201-400",
    content: (
      <p>
        150 AMMO&nbsp;
        <span>
          {/* eslint-disable-next-line */}
          <img src="/img/badge/sergeant.svg" alt="" />
        </span>
      </p>
    ),
  },
  {
    label: "401-700",
    content: (
      <p>
        <span>
          {/* eslint-disable-next-line */}
          <img src="/img/badge/corporal.svg" alt="" />
        </span>
      </p>
    ),
  },
];

