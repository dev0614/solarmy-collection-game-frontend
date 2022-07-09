import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

export const GLOBAL_AUTHORITY_SEED = "global-authority";

export const STAKING_PROGRAM_ID = new PublicKey("6xPmEQRrwmZC1GxL8J5ZE6CEFZdgoMj7fGrDPXxAJpEs");
export const AMMO_TOKEN_MINT = new PublicKey("H3rmqbVz8NTCkGABeue3yc9PgioL2i1RPrQM45itdKMu");
export const AMMO_TOKEN_DECIMAL = 1_000_000_000;

export const USER_POOL_SIZE = 5648;     // 8 + 5640

export interface GlobalPool {
    // 8 + 40
    superAdmin: PublicKey,          // 32
    totalStakedCount: anchor.BN,    // 8
}

export interface StakedData {
    mint: PublicKey,            // 32
    stakedTime: anchor.BN,      // 8
    lockTime: anchor.BN,        // 8
    duration: anchor.BN,    // 8
}

export interface UserPool {
    // 8 + 5640
    owner: PublicKey,               // 32
    stakedCount: anchor.BN,         // 8
    staking: StakedData[],          // 56 * 100
}

export interface DeployItemType {
    nftMint: string,
    id?: number,
    uri: string,
    status: "reverse" | "complete" | "active",
    stakedTime?: number,
    lockTime?: number,
    duration?: number
}