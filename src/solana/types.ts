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

export interface UserTxType {
    amount: number,
    createdAt: number,
    label: string,
    name: string,
    wallet: string,
    type: string
}

export interface PlanFetched {
    Atribute: string,
    Atribute_Type: string,
    Points: string,
    Rarity: string,
    URL: string,
    _id: string
}

export interface FusionNft {
    nftMint: string,
    uri: string
}

export interface FusionNftDetail {
    nftMint: string,
    image: string,
    name: string
}

export interface SelectedItemType {
    attribute: string,
    attribute_type: string,
    points: string,
    rarity: string,
    url: string,
}

export interface AttributeItem {
    trait_type: string,
    value: string,
}

export interface AttributeTypes {
    head: AttributeItem,
    head_accessories: AttributeItem,
    torso: AttributeItem,
    l_arm: AttributeItem,
    r_arm: AttributeItem,
    legs: AttributeItem,
    background: AttributeItem,
}

export interface AttributeFilterTypes {
    common: boolean,
    universal: boolean,
    rare: boolean,
    first_class: boolean,
    transendental: boolean
}

export interface AttributeFetched {
    _id: string,
    attribute_type: string,
    attribute: string,
    points: string,
    rarity: string,
    url: string,
    selected: boolean
}

export interface NftAttrsTypes {
    head: AttributeFetched,
    head_accessories: AttributeFetched,
    right_arm: AttributeFetched,
    left_arm: AttributeFetched,
    torso: AttributeFetched,
    legs: AttributeFetched,
    background: AttributeFetched,
}

export interface AbleFetchedItem {
    attribute: string,
    attribute_type: string,
    created_at: string,
    points: string,
    rarity: string,
    updated_at: string,
    url: string,
    wallet: string,
    __v: number
    _id: string,
}

export const TableFirstData2D = {
    hat: {
        name: "",
        rarity: ""
    },
    head: {
        name: "",
        rarity: ""
    },
    torso_accessories: {
        name: "",
        rarity: ""
    },
    l_arm: {
        name: "",
        rarity: ""
    },
    r_arm: {
        name: "",
        rarity: ""
    },
    legs: {
        name: "",
        rarity: ""
    },
    torso: {
        name: "",
        rarity: ""
    },
    background: {
        name: "",
        rarity: ""
    },
    companion: {
        name: "",
        rarity: ""
    },
    shoes: {
        name: "",
        rarity: ""
    },
}

export let Default3dData = {
    head: {
        type: "Head",
        value: "",
        rarity: "",
        points: ""
    },
    head_accessories: {
        type: "Head Accessories",
        value: "",
        rarity: "",
        points: ""
    },
    torso: {
        type: "Torso",
        value: "",
        rarity: "",
        points: ""
    },
    l_arm: {
        type: "Left Arm",
        value: "",
        rarity: "",
        points: ""
    },
    r_arm: {
        type: "Right Arm",
        value: "",
        rarity: "",
        points: ""
    },
    legs: {
        type: "Legs",
        value: "",
        rarity: "",
        points: ""
    },
    background: {
        type: "Background",
        value: "",
        rarity: "",
        points: ""
    },
}

export interface SoldierItem {
    collection: string,
    mint: string,
    image: string,
    uri: string,
    name: string,
    id: string,
    selected: boolean
}