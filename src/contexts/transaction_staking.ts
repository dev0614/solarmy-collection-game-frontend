import * as anchor from '@project-serum/anchor';
import {
    Connection,
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    Transaction,
} from '@solana/web3.js';

import { AMMO_TOKEN_DECIMAL, AMMO_TOKEN_MINT, GLOBAL_AUTHORITY_SEED, STAKING_PROGRAM_ID, USER_POOL_SIZE } from './types';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { filterError, getAssociatedTokenAccount, getATokenAccountsNeedCreate, getMetadata, getNFTTokenAccount, getOwnerOfNFT, isExistAccount, METAPLEX, solConnection } from './utils';
import { IDL } from './staking';
import { successAlert } from '../components/toastGroup';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';


export const initUserPool = async (
    wallet: WalletContextState
) => {
    if (!wallet.publicKey) return;
    let userAddress: PublicKey = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, STAKING_PROGRAM_ID, provider);
    try {
        const tx = await createInitUserPoolTx(userAddress, program);
        const { blockhash } = await solConnection.getRecentBlockhash('finalized');
        tx.feePayer = userAddress;
        tx.recentBlockhash = blockhash;
        const txId = await wallet.sendTransaction(tx, solConnection);
        await solConnection.confirmTransaction(txId, "finalized");
        successAlert("Created User Pool")
        console.log("Your transaction signature", txId);
    } catch (error) {
        console.log(error);
    }
}


export const createInitUserPoolTx = async (
    userAddress: PublicKey,
    program: anchor.Program,
) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        STAKING_PROGRAM_ID,
    );

    let tx = new Transaction();
    tx.add(program.instruction.initialize(
        bump, {
        accounts: {
            admin: userAddress,
            globalAuthority,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
        },
        instructions: [],
        signers: [],
    }));

    return tx;
}


export const stakeNFT = async (
    wallet: WalletContextState,
    mint: PublicKey,
    duration: number,
    startLoading: Function,
    closeLoading: Function,
    updatePage: Function
) => {
    if (!wallet.publicKey) return;
    let userAddress: PublicKey = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, STAKING_PROGRAM_ID, provider);
    try {
        startLoading();
        let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
            userAddress,
            "user-pool",
            STAKING_PROGRAM_ID,
        );

        let poolAccount = await solConnection.getAccountInfo(userPoolKey);
        if (poolAccount === null || poolAccount.data === null) {
            await initUserPool(wallet);
        }

        const tx = await createStakeNftTx(mint, userAddress, program, solConnection, duration);
        const { blockhash } = await solConnection.getRecentBlockhash('confirmed');
        tx.feePayer = userAddress;
        tx.recentBlockhash = blockhash;
        const txId = await wallet.sendTransaction(tx, solConnection);
        await solConnection.confirmTransaction(txId, "finalized");
        successAlert("Transaction is confirmed!");
        closeLoading();
        updatePage();
    } catch (error) {
        console.log(error);
        closeLoading();
        filterError(error);
    }
}

export const createStakeNftTx = async (
    mint: PublicKey,
    userAddress: PublicKey,
    program: anchor.Program,
    connection: Connection,
    duration: number,
) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        STAKING_PROGRAM_ID,
    );

    let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
        userAddress,
        "user-pool",
        STAKING_PROGRAM_ID,
    );

    let userTokenAccount = await getAssociatedTokenAccount(userAddress, mint);
    if (!await isExistAccount(userTokenAccount, connection)) {
        let accountOfNFT = await getNFTTokenAccount(mint, connection);
        if (userTokenAccount.toBase58() != accountOfNFT.toBase58()) {
            let nftOwner = await getOwnerOfNFT(mint, connection);
            if (nftOwner.toBase58() == userAddress.toBase58()) userTokenAccount = accountOfNFT;
            else if (nftOwner.toBase58() !== globalAuthority.toBase58()) {
                throw 'Error: Nft is not owned by user';
            }
        }
    }
    console.log("NFT = ", mint.toBase58(), userTokenAccount.toBase58());

    let { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
        connection,
        userAddress,
        globalAuthority,
        [mint]
    );

    console.log("Dest NFT Account = ", destinationAccounts[0].toBase58())

    const metadata = await getMetadata(mint);

    console.log("Metadata=", metadata.toBase58());

    let tx = new Transaction();

    if (instructions.length > 0) instructions.map((ix) => tx.add(ix));
    console.log('==>Staking ...', mint.toBase58(), duration);

    tx.add(program.instruction.stakeNftToPool(
        bump, new anchor.BN(duration), {
        accounts: {
            owner: userAddress,
            globalAuthority,
            userPool: userPoolKey,
            userNftTokenAccount: userTokenAccount,
            destNftTokenAccount: destinationAccounts[0],
            nftMint: mint,
            mintMetadata: metadata,
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenMetadataProgram: METAPLEX,
        },
        instructions: [],
        signers: [],
    }));

    return tx;
}

export const withdrawNft = async (
    wallet: WalletContextState,
    mint: PublicKey,
    startLoading: Function,
    closeLoading: Function,
    updatePage: Function,
) => {

    if (!wallet.publicKey) return;
    let userAddress: PublicKey = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, STAKING_PROGRAM_ID, provider);
    try {
        startLoading();
        const tx = await createWithdrawNftTx(mint, userAddress, program, solConnection);
        const { blockhash } = await solConnection.getRecentBlockhash('confirmed');
        tx.feePayer = userAddress;
        tx.recentBlockhash = blockhash;
        const txId = await wallet.sendTransaction(tx, solConnection);
        await solConnection.confirmTransaction(txId, "finalized");
        successAlert("Transaction is confirmed!");
        closeLoading();
        updatePage();
    } catch (error) {
        console.log(error);
        closeLoading();
        filterError(error);
    }
}


export const withdrawToken = async (
    wallet: WalletContextState,
    amount: number,
    closeLoading: Function,
    startLoading: Function,
    updatePage: Function
) => {

    if (!wallet.publicKey) return;
    let userAddress: PublicKey = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, STAKING_PROGRAM_ID, provider);
    try {

        startLoading();
        const tx = await createWithdrawTx(userAddress, amount, program, solConnection);
        const { blockhash } = await solConnection.getRecentBlockhash('confirmed');
        tx.feePayer = userAddress;
        tx.recentBlockhash = blockhash;

        const txId = await wallet.sendTransaction(tx, solConnection);
        await solConnection.confirmTransaction(txId, "finalized");
        successAlert("Transaction is confirmed!");
        closeLoading();
        updatePage();
    } catch (error) {
        console.log(error);
        closeLoading();
        filterError(error);
    }
}

export const createWithdrawNftTx = async (
    mint: PublicKey,
    userAddress: PublicKey,
    program: anchor.Program,
    connection: Connection,
) => {
    let ret = await getATokenAccountsNeedCreate(
        connection,
        userAddress,
        userAddress,
        [mint, AMMO_TOKEN_MINT]
    );
    let userTokenAccount = ret.destinationAccounts[0];
    console.log("User NFT = ", mint.toBase58(), userTokenAccount.toBase58());

    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        STAKING_PROGRAM_ID
    );
    let rewardVault = await getAssociatedTokenAccount(globalAuthority, AMMO_TOKEN_MINT);
    let destNftTokenAccount = await getAssociatedTokenAccount(globalAuthority, mint);

    let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
        userAddress,
        "user-pool",
        STAKING_PROGRAM_ID,
    );

    let tx = new Transaction();

    if (ret.instructions.length > 0) ret.instructions.map((ix) => tx.add(ix));
    console.log('==> Withdrawing ... ', mint.toBase58());

    tx.add(program.instruction.withdrawNftFromPool(
        bump, {
        accounts: {
            owner: userAddress,
            globalAuthority,
            userPool: userPoolKey,
            userNftTokenAccount: userTokenAccount,
            destNftTokenAccount,
            rewardVault,
            userRewardAccount: ret.destinationAccounts[1],
            nftMint: mint,
            tokenProgram: TOKEN_PROGRAM_ID,
        },
        instructions: [],
        signers: [],
    }));

    return tx;
}

export const createWithdrawTx = async (
    userAddress: PublicKey,
    amount: number,
    program: anchor.Program,
    connection: Connection,
) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        STAKING_PROGRAM_ID
    );
    let rewardVault = await getAssociatedTokenAccount(globalAuthority, AMMO_TOKEN_MINT);

    let ret = await getATokenAccountsNeedCreate(
        connection,
        userAddress,
        userAddress,
        [AMMO_TOKEN_MINT]
    );

    let tx = new Transaction();
    console.log('==> Withdrawing Token ... ', amount);

    if (ret.instructions.length > 0) ret.instructions.map((ix) => tx.add(ix));
    tx.add(program.instruction.withdrawToken(
        bump, new anchor.BN(amount * AMMO_TOKEN_DECIMAL), {
        accounts: {
            owner: userAddress,
            globalAuthority,
            rewardVault,
            userRewardAccount: ret.destinationAccounts[0],
            tokenProgram: TOKEN_PROGRAM_ID,
        },
        instructions: [],
        signers: [],
    }));

    return tx;
}