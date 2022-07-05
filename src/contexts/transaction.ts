import * as anchor from '@project-serum/anchor';
import {
    PublicKey,
    SystemProgram,
    Transaction,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";

import { CollectionPool, GlobalPool, RafflePool } from './types';
import { DECIMALS, GLOBAL_AUTHORITY_SEED, METAPLEX, PROGRAM_ID, RAFFLE_SIZE, SOLSCAN_API, TREASURY_WALLET } from '../config';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { solConnection } from './utils';
import { IDL } from './raffle';
import { errorAlert, errorAlertBottom, infoAlert, infoAlertBottom, successAlert, successAlertBottom, warningAlert, warningAlertBottom } from '../components/toastGroup';
import { addDoc, doc, updateDoc } from 'firebase/firestore';
import { database, rafflesInstance } from '../api/firebase';

export const addCollection = async (
    wallet: WalletContextState,
    collectionId: PublicKey,
    id: string
) => {
    if (!wallet.publicKey) return;
    let userAddress: PublicKey = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
    const collectionById = doc(database, 'collections', id);
    let timeout: any;
    let timeInterval: any;
    try {
        let state: GlobalPool | null = await getGlobalState();
        if (state === null) return;
        let admin = state.superAdmin;
        let collection = await PublicKey.createWithSeed(
            admin,
            "collection-pool",
            program.programId,
        );
        let tx = new Transaction();
        tx.add(program.instruction.addCollection(
            {
                accounts: {
                    admin: userAddress,
                    collection,
                    collectionId
                },
                instructions: [],
                signers: [],
            }
        ));

        await updateDoc(collectionById, {
            status: 1,
            updateTimeStamp: new Date().getTime()
        })
            .then(() => {
                successAlertBottom("Transaction request has been sent.");
            })
            .catch((error) => {
                console.log(error);
            })

        const txId = await wallet.sendTransaction(tx, solConnection);

        await updateDoc(collectionById, {
            tx: txId,
            updateTimeStamp: new Date().getTime()
        })
            .then(() => {
                console.log("database added...")
            })

        timeout = setTimeout(() => {
            // infoAlertBottom("Checking status...");
            timeInterval = setInterval(async () => {
                infoAlertBottom("Checking status...");
                await fetch(`${SOLSCAN_API}${txId}`)
                    .then(resp =>
                        resp.json()
                    ).then(async (json) => {
                        if (json.status === "Success" && json.signer.length !== 0) {
                            await updateDoc(collectionById, {
                                status: 0,
                                accepted: true,
                                updateTimeStamp: new Date().getTime()
                            })
                                .then(() => {
                                    clearTimeout(timeout);
                                    clearInterval(timeInterval);
                                    successAlert("Transaction is confirmed..");
                                })
                        }
                        if (json.status === "Fail") {
                            clearTimeout(timeout);
                            clearInterval(timeInterval);
                            errorAlert("Transaction is failed..");
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }, 8000)
        }, 10000);

    } catch (error: any) {
        clearTimeout(timeout);
        clearInterval(timeInterval);
        await updateDoc(collectionById, {
            status: 0,
            updateTimeStamp: new Date().getTime()
        })
            .then(() => {
                if (error.message) {
                    // Blockhash not found
                    if (error.message.indexOf("Blockhash not found") !== -1) {
                        warningAlertBottom("Blockhash not found. Please try again");
                    } else {
                        errorAlertBottom(error.message);
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
}

export const createRaffle = async (
    wallet: WalletContextState,
    nfts: {
        mint: string,
        collectionName: string,
        collectionId: string
    }[],
    ticketPriceSol: number,
    endTimestamp: number,
    max: number,
    startLoading: Function,
    closeLoading: Function,
    updatePage: Function,
    twitter: string
) => {
    if (!wallet.publicKey) return;
    let userAddress: PublicKey = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
    let timeout: any;
    let timeInterval: any;
    try {
        startLoading();
        infoAlert("A transaction request has been sent.");
        let transactions: Transaction[] = [];
        let raffleKeys: PublicKey[] = [];
        for (let item of nfts) {
            const tx = await createRaffleTx(program, userAddress, item, ticketPriceSol, endTimestamp, max, twitter);
            if (tx !== undefined) {
                transactions.push(tx.tx);
                raffleKeys.push(tx.raffleKey);
            }
        }

        let { blockhash } = await provider.connection.getRecentBlockhash("confirmed");
        transactions.forEach((transaction) => {
            transaction.feePayer = (wallet.publicKey as PublicKey);
            transaction.recentBlockhash = blockhash;
        });

        if (wallet.signAllTransactions !== undefined) {
            const signedTransactions = await wallet.signAllTransactions(transactions);

            let signatures = await Promise.all(
                signedTransactions.map((transaction) =>
                    provider.connection.sendRawTransaction(transaction.serialize(), {
                        skipPreflight: true,
                        maxRetries: 3,
                        preflightCommitment: 'confirmed',
                    })
                )
            );

            timeout = setTimeout(() => {
                // infoAlertBottom("Checking status...");
                timeInterval = setInterval(async () => {
                    infoAlertBottom("Checking status...");
                    for (let i = 0; i < signatures.length; i++) {
                        console.log(`${SOLSCAN_API}${signatures[i]}`);

                        await fetch(`${SOLSCAN_API}${signatures[i]}`)
                            .then(resp =>
                                resp.json()
                            ).then(async (json) => {
                                console.log(json, `===> json ${i}`);
                                if (json.status === "Success" && json.signer.length !== 0) {

                                    await addDoc(rafflesInstance, {
                                        raffleKey: raffleKeys[i].toBase58(),
                                        creator: userAddress.toBase58(),
                                        nftMint: nfts[i].mint,
                                        collectionName: nfts[i].collectionName,
                                        collectionId: nfts[i].collectionId,
                                        count: 0,
                                        noRepeat: 0,
                                        maxEntrants: max,
                                        startTimestamp: new Date().getTime(),
                                        endTimestamp: endTimestamp,
                                        ticketPriceSol: ticketPriceSol,
                                        claimed: false,
                                        winnerIndex: "",
                                        winner: "",
                                        entrants: 0,
                                        twitter: twitter,
                                        createTimeStamp: new Date().getTime(),
                                        updateTimeStamp: new Date().getTime(),
                                        status: 0
                                    })
                                        .then(() => {
                                            console.log("added to firestore");
                                            if (i === signatures.length - 1) {
                                                clearTimeout(timeout);
                                                clearInterval(timeInterval);
                                                closeLoading();
                                                successAlert("Transaction is confirmed.");
                                                updatePage();
                                            }
                                        })
                                        .catch((error: any) => {
                                            console.log(error)
                                        })
                                }

                                if (json.status === "Fail") {
                                    clearTimeout(timeout);
                                    clearInterval(timeInterval);
                                    closeLoading();
                                    errorAlert("Transaction is failed..");
                                }

                            })
                            .catch((error) => {
                                console.log(error);
                            })
                    }

                }, 7000)
            }, 15000);

        }

    } catch (error: any) {
        clearTimeout(timeout);
        clearInterval(timeInterval);
        if (error.message) {
            // Blockhash not found
            if (error.message.indexOf("Blockhash not found") !== -1) {
                warningAlertBottom("Blockhash not found. Please try again");
            } else {
                errorAlertBottom(error.message);
            }
        }
        closeLoading();
    }
}

export const buyTicket = async (
    wallet: WalletContextState,
    raffleKey: PublicKey,
    amount: number,
    raffleId: string,
    startLoading: Function,
    closeLoading: Function,
    updatePage: Function
) => {
    if (!wallet.publicKey) return;
    let userAddress: PublicKey = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );
    const collectionById = doc(database, 'raffles', raffleId);
    let timeout: any;
    let timeInterval: any;
    try {
        startLoading();
        infoAlert("A transaction request has been sent.");
        let raffleState = await getStateByKey(raffleKey);
        if (!raffleState) return;

        const creator = raffleState.creator;
        let tx = new Transaction();
        tx.add(program.instruction.buyTickets(
            bump,
            new anchor.BN(amount),
            {
                accounts: {
                    buyer: userAddress,
                    raffle: raffleKey,
                    globalAuthority,
                    creator,
                    treasuryWallet: TREASURY_WALLET,
                    systemProgram: SystemProgram.programId,
                },
                instructions: [],
                signers: [],
            }
        ))
        const txId = await wallet.sendTransaction(tx, solConnection);
        console.log(`${SOLSCAN_API}${txId}`);

        timeout = setTimeout(() => {
            // infoAlertBottom("Checking status...");
            timeInterval = setInterval(async () => {
                infoAlertBottom("Checking status...");
                await fetch(`${SOLSCAN_API}${txId}`)
                    .then(resp =>
                        resp.json()
                    ).then(async (json) => {
                        if (json.status === "Success" && json.signer.length !== 0) {
                            await updateDoc(collectionById, {
                                tx: txId,
                                updateTimeStamp: new Date().getTime()
                            })
                                .then(() => {
                                    successAlert("Transaction is confirmed.");
                                    closeLoading();
                                    updatePage();
                                    clearTimeout(timeout);
                                    clearInterval(timeInterval);
                                })
                        }

                        if (json.status === "Fail") {
                            clearTimeout(timeout);
                            clearInterval(timeInterval);
                            closeLoading();
                            errorAlert("Transaction is failed..");
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }, 7000)
        }, 10000);
    } catch (error: any) {
        clearTimeout(timeout);
        clearInterval(timeInterval);
        if (error.message) {
            // Blockhash not found
            if (error.message.indexOf("Blockhash not found") !== -1) {
                warningAlertBottom("Blockhash not found. Please try again");
            } else {
                errorAlertBottom(error.message);
            }
        }
        closeLoading();
    }

}

export const revealWinner = async (
    wallet: WalletContextState,
    raffleKey: PublicKey,
    startLoading: Function,
    closeLoading: Function,
    updatePage: Function,
    raffleId: string,
) => {
    if (!wallet.publicKey) return;
    let userAddress: PublicKey = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
    const collectionById = doc(database, 'raffles', raffleId);
    let timeout: any;
    let timeInterval: any;
    try {
        startLoading();
        infoAlert("A transaction request has been sent.");
        let tx = new Transaction();
        tx.add(program.instruction.revealWinner(
            {
                accounts: {
                    buyer: userAddress,
                    raffle: raffleKey,
                },
                instructions: [],
                signers: [],
            }
        ))
        const txId = await wallet.sendTransaction(tx, solConnection);
        console.log(`${SOLSCAN_API}${txId}`);

        timeout = setTimeout(() => {
            // infoAlertBottom("Checking status...");
            timeInterval = setInterval(async () => {
                infoAlertBottom("Checking status...");
                await fetch(`${SOLSCAN_API}${txId}`)
                    .then(resp =>
                        resp.json()
                    ).then(async (json) => {
                        if (json.status === "Success" && json.signer.length !== 0) {
                            await updateDoc(collectionById, {
                                tx: txId,
                                updateTimeStamp: new Date().getTime()
                            })
                                .then(() => {
                                    clearTimeout(timeout);
                                    clearInterval(timeInterval);
                                    closeLoading();
                                    successAlert("Transaction is confirmed.");
                                    updatePage();
                                })
                        }

                        if (json.status === "Fail") {
                            clearTimeout(timeout);
                            clearInterval(timeInterval);
                            closeLoading();
                            errorAlert("Transaction is failed..");
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }, 7000)
        }, 10000);

    } catch (error: any) {
        clearTimeout(timeout);
        clearInterval(timeInterval);
        if (error.message) {
            // Blockhash not found
            if (error.message.indexOf("Blockhash not found") !== -1) {
                warningAlertBottom("Blockhash not found. Please try again");
            } else {
                errorAlertBottom(error.message);
            }
        }
        closeLoading();
    }
}

export const claimReward = async (
    wallet: WalletContextState,
    nft_mint: PublicKey,
    raffleKey: PublicKey,
    startLoading: Function,
    closeLoading: Function,
    updatePage: Function,
    raffleId: string
) => {
    if (!wallet.publicKey) return;
    let userAddress: PublicKey = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );
    const collectionById = doc(database, 'raffles', raffleId);
    let timeout: any;
    let timeInterval: any;
    try {
        startLoading();
        infoAlert("A transaction request has been sent.");
        const srcNftTokenAccount = await getAssociatedTokenAccount(globalAuthority, nft_mint);

        let ix0 = await getATokenAccountsNeedCreate(
            solConnection,
            userAddress,
            userAddress,
            [nft_mint]
        );
        let tx = new Transaction();
        if (ix0.instructions.length !== 0) tx.add(...ix0.instructions);
        tx.add(program.instruction.claimReward(
            bump,
            {
                accounts: {
                    claimer: userAddress,
                    globalAuthority,
                    raffle: raffleKey,
                    claimerNftTokenAccount: ix0.destinationAccounts[0],
                    srcNftTokenAccount,
                    nftMintAddress: nft_mint,
                    tokenProgram: TOKEN_PROGRAM_ID,
                },
                instructions: [],
                signers: [],
            }
        ))
        const txId = await wallet.sendTransaction(tx, solConnection);

        console.log(`${SOLSCAN_API}${txId}`);

        timeout = setTimeout(() => {
            // infoAlertBottom("Checking status...");
            timeInterval = setInterval(async () => {
                infoAlertBottom("Checking status...");
                await fetch(`${SOLSCAN_API}${txId}`)
                    .then(resp =>
                        resp.json()
                    ).then(async (json) => {
                        console.log(json, "===> json");
                        if (json.status === "Success" && json.signer.length !== 0) {
                            await updateDoc(collectionById, {
                                tx: txId,
                                updateTimeStamp: new Date().getTime()
                            })
                                .then(() => {
                                    successAlert("Transaction is confirmed.");
                                    closeLoading();
                                    updatePage();
                                    clearTimeout(timeout);
                                    clearInterval(timeInterval);
                                })
                        }

                        if (json.status === "Fail") {
                            clearTimeout(timeout);
                            clearInterval(timeInterval);
                            closeLoading();
                            errorAlert("Transaction is failed..");
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }, 7000)
        }, 10000);

    } catch (error: any) {
        clearTimeout(timeout);
        clearInterval(timeInterval);
        if (error.message) {
            // Blockhash not found
            if (error.message.indexOf("Blockhash not found") !== -1) {
                warningAlertBottom("Blockhash not found. Please try again");
            } else {
                errorAlertBottom(error.message);
            }
        }
        closeLoading();
    }

}

export const withdrawNft = async (
    wallet: WalletContextState,
    nft_mint: PublicKey,
    raffleKey: PublicKey,
    raffleId: string,
    startLoading: Function,
    closeLoading: Function,
    updatePage: Function
) => {
    if (!wallet.publicKey) return;
    let userAddress: PublicKey = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );
    const collectionById = doc(database, 'raffles', raffleId);
    let timeout: any;
    let timeInterval: any;
    try {
        startLoading();
        infoAlert("A transaction request has been sent.");
        const srcNftTokenAccount = await getAssociatedTokenAccount(globalAuthority, nft_mint);

        let ix0 = await getATokenAccountsNeedCreate(
            solConnection,
            userAddress,
            userAddress,
            [nft_mint]
        );
        let tx = new Transaction();
        if (ix0.instructions.length !== 0) tx.add(...ix0.instructions);
        tx.add(program.instruction.withdrawNft(
            bump, {
            accounts: {
                claimer: userAddress,
                globalAuthority,
                raffle: raffleKey,
                claimerNftTokenAccount: ix0.destinationAccounts[0],
                srcNftTokenAccount,
                nftMintAddress: nft_mint,
                tokenProgram: TOKEN_PROGRAM_ID,
            },
            instructions: [],
            signers: [],
        }
        ))
        const txId = await wallet.sendTransaction(tx, solConnection);

        console.log(`${SOLSCAN_API}${txId}`);

        timeout = setTimeout(() => {
            // infoAlertBottom("Checking status...");
            timeInterval = setInterval(async () => {
                infoAlertBottom("Checking status...");
                await fetch(`${SOLSCAN_API}${txId}`)
                    .then(resp =>
                        resp.json()
                    ).then(async (json) => {
                        if (json.status === "Success" && json.signer.length !== 0) {
                            await updateDoc(collectionById, {
                                tx: txId,
                                updateTimeStamp: new Date().getTime()
                            })
                                .then(() => {
                                    successAlert("Transaction is confirmed.");
                                    closeLoading();
                                    updatePage();
                                    clearTimeout(timeout);
                                    clearInterval(timeInterval);
                                })
                        }

                        if (json.status === "Fail") {
                            clearTimeout(timeout);
                            clearInterval(timeInterval);
                            closeLoading();
                            errorAlert("Transaction is failed..");
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }, 7000)
        }, 10000);

    } catch (error: any) {
        clearTimeout(timeout);
        clearInterval(timeInterval);
        if (error.message) {
            // Blockhash not found
            if (error.message.indexOf("Blockhash not found") !== -1) {
                warningAlertBottom("Blockhash not found. Please try again");
            } else {
                errorAlertBottom(error.message);
            }
        }
        closeLoading();
    }
}

export const getRaffleKey = async (
    nft_mint: PublicKey
): Promise<PublicKey | null> => {
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
    let poolAccounts = await solConnection.getParsedProgramAccounts(
        program.programId,
        {
            filters: [
                {
                    dataSize: RAFFLE_SIZE
                },
                {
                    memcmp: {
                        "offset": 40,
                        "bytes": nft_mint.toBase58()
                    }
                }
            ]
        }
    );

    if (poolAccounts.length !== 0) {
        let len = poolAccounts.length;
        let max = 0;
        let maxId = 0;
        for (let i = 0; i < len; i++) {
            let state = await getStateByKey(poolAccounts[i].pubkey);
            if (state)
                if (state.endTimestamp.toNumber() > max) {
                    max = state.endTimestamp.toNumber();
                    maxId = i;
                }
        }
        let raffleKey = poolAccounts[maxId].pubkey;
        return raffleKey;
    } else {
        return null;
    }
}

export const getGlobalAllData = async () => {

    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
    let poolAccounts = await solConnection.getParsedProgramAccounts(
        program.programId,
        {
            filters: [
                {
                    dataSize: RAFFLE_SIZE
                },
            ]
        }
    );
    if (poolAccounts.length !== 0) {
        let len = poolAccounts.length;
        let list = [];
        for (let i = 0; i < len; i++) {
            let state = await getStateByKey(poolAccounts[i].pubkey);
            if (state)
                state.raffleKey = poolAccounts[i].pubkey.toBase58();
            list.push(state);
        }
        return list;
    } else {
        return null;
    }
}

export const getRaffleState = async (
    nft_mint: PublicKey
): Promise<RafflePool | null> => {

    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
    let poolAccounts = await solConnection.getParsedProgramAccounts(
        program.programId,
        {
            filters: [
                {
                    dataSize: RAFFLE_SIZE
                },
                {
                    memcmp: {
                        "offset": 40,
                        "bytes": nft_mint.toBase58()
                    }
                }
            ]
        }
    );
    if (poolAccounts.length !== 0) {
        let rentalKey = poolAccounts[0].pubkey;

        try {
            let rentalState = await program.account.rafflePool.fetch(rentalKey);
            return rentalState as unknown as RafflePool;
        } catch {
            return null;
        }
    } else {
        return null;
    }
}

export const getStateByKey = async (
    raffleKey: PublicKey
): Promise<RafflePool | null> => {
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
    try {
        let rentalState = await program.account.rafflePool.fetch(raffleKey);
        return rentalState as unknown as RafflePool;
    } catch {
        return null;
    }
}

export const getGlobalState = async (): Promise<GlobalPool | null> => {
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
    const [globalAuthority, _] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );
    try {
        let state = await program.account.globalPool.fetch(globalAuthority);
        return state as unknown as GlobalPool;
    } catch {
        return null;
    }
}

export const getCollectionState = async (): Promise<CollectionPool | null> => {
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    let state: GlobalPool | null = await getGlobalState();
    if (!state) return null;
    let admin = state.superAdmin;

    try {
        let collection = await PublicKey.createWithSeed(
            admin,
            "collection-pool",
            program.programId,
        );
        let state = await program.account.collectionPool.fetch(collection);
        return state as unknown as CollectionPool;
    } catch {
        return null;
    }
}

const getAssociatedTokenAccount = async (ownerPubkey: PublicKey, mintPk: PublicKey): Promise<PublicKey> => {
    let associatedTokenAccountPubkey = (await PublicKey.findProgramAddress(
        [
            ownerPubkey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mintPk.toBuffer(), // mint address
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    ))[0];
    return associatedTokenAccountPubkey;
}

export const getATokenAccountsNeedCreate = async (
    connection: anchor.web3.Connection,
    walletAddress: anchor.web3.PublicKey,
    owner: anchor.web3.PublicKey,
    nfts: anchor.web3.PublicKey[],
) => {
    let instructions = [], destinationAccounts = [];
    for (const mint of nfts) {
        const destinationPubkey = await getAssociatedTokenAccount(owner, mint);
        let response = await connection.getAccountInfo(destinationPubkey);
        if (!response) {
            const createATAIx = createAssociatedTokenAccountInstruction(
                destinationPubkey,
                walletAddress,
                owner,
                mint,
            );
            instructions.push(createATAIx);
        }
        destinationAccounts.push(destinationPubkey);
        if (walletAddress != owner) {
            const userAccount = await getAssociatedTokenAccount(walletAddress, mint);
            response = await connection.getAccountInfo(userAccount);
            if (!response) {
                const createATAIx = createAssociatedTokenAccountInstruction(
                    userAccount,
                    walletAddress,
                    walletAddress,
                    mint,
                );
                instructions.push(createATAIx);
            }
        }
    }
    return {
        instructions,
        destinationAccounts,
    };
}

export const createAssociatedTokenAccountInstruction = (
    associatedTokenAddress: anchor.web3.PublicKey,
    payer: anchor.web3.PublicKey,
    walletAddress: anchor.web3.PublicKey,
    splTokenMintAddress: anchor.web3.PublicKey
) => {
    const keys = [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
        { pubkey: walletAddress, isSigner: false, isWritable: false },
        { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
        {
            pubkey: anchor.web3.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        {
            pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    return new anchor.web3.TransactionInstruction({
        keys,
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([]),
    });
}

export const getMetadataAddr = async (mint: PublicKey): Promise<PublicKey> => {
    return (
        await PublicKey.findProgramAddress([Buffer.from('metadata'), METAPLEX.toBuffer(), mint.toBuffer()], METAPLEX)
    )[0];
};

const createRaffleTx = async (
    program: anchor.Program,
    userAddress: PublicKey,
    nft: {
        mint: string,
        collectionName: string,
        collectionId: string
    },
    ticketPriceSol: number,
    endTimestamp: number,
    max: number,
    twitter: string
) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );
    let state: GlobalPool | null = await getGlobalState();
    if (!state) return;
    let admin = state.superAdmin;
    let collection = await PublicKey.createWithSeed(
        admin,
        "collection-pool",
        program.programId,
    );

    let ownerNftAccount = await getAssociatedTokenAccount(userAddress, new PublicKey(nft.mint));

    let ix0 = await getATokenAccountsNeedCreate(
        solConnection,
        userAddress,
        globalAuthority,
        [new PublicKey(nft.mint)]
    );

    let raffle;
    let i;

    for (i = 10; i > 0; i--) {
        raffle = await PublicKey.createWithSeed(
            userAddress,
            new PublicKey(nft.mint).toBase58().slice(0, i),
            program.programId,
        );
        let state = await getStateByKey(raffle);
        if (state === null) {
            break;
        }
    }
    if (!raffle) return;

    let ix = SystemProgram.createAccountWithSeed({
        fromPubkey: userAddress,
        basePubkey: userAddress,
        seed: new PublicKey(nft.mint).toBase58().slice(0, i),
        newAccountPubkey: raffle,
        lamports: await solConnection.getMinimumBalanceForRentExemption(RAFFLE_SIZE),
        space: RAFFLE_SIZE,
        programId: program.programId,
    });

    const metadataAddr = await getMetadataAddr(new PublicKey(nft.mint));
    let tx = new Transaction();
    tx.add(ix);
    if (ix0.instructions.length !== 0) tx.add(...ix0.instructions);
    tx.add(program.instruction.createRaffle(
        bump,
        new anchor.BN(ticketPriceSol * DECIMALS),
        new anchor.BN(endTimestamp),
        new anchor.BN(max),
        {
            accounts: {
                admin: userAddress,
                globalAuthority,
                raffle,
                collection,
                ownerTempNftAccount: ownerNftAccount,
                destNftTokenAccount: ix0.destinationAccounts[0],
                nftMintAddress: new PublicKey(nft.mint),
                mintMetadata: metadataAddr,
                tokenProgram: TOKEN_PROGRAM_ID,
                tokenMetadataProgram: METAPLEX
            },
            instructions: [],
            signers: [],
        }
    ))
    return { tx: tx, raffleKey: raffle };
}