import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

export interface GlobalPool {
    superAdmin: PublicKey,
}

export interface CollectionPool {
    count: anchor.BN,
    collections: PublicKey[],
}

export interface RafflePool {
    raffleKey: string;
    creator: PublicKey,
    nftMint: PublicKey,
    count: anchor.BN,
    noRepeat: anchor.BN,
    maxEntrants: anchor.BN,
    startTimestamp: anchor.BN,
    endTimestamp: anchor.BN,
    ticketPriceSol: anchor.BN,
    claimed: anchor.BN,
    winnerIndex: anchor.BN,
    winner: PublicKey,
    entrants: PublicKey[],
}

export interface RaffleDetailType {
    nftMint: string,
    raffleKey: string,
    image: string,
    name: string,
    collectionName: string,
    collectionId: string,
    maxEntrants: number,
    endTimestamp: number,
    ticketPriceSol: number,
    winner: string,
    count: number,
    creator: string,
    twitter: string,
    raffleId: string,
    raffleStatus: number
}