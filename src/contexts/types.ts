import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

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

export interface AttributeType {
    attribute: "Head" | "Head Accessories" | "L Arm" | "R Arm" | "Torso" | "Legs" | "Background" | "",
    name: string,
    rarityPoints: string
}