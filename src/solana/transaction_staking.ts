import * as anchor from "@project-serum/anchor";
import { programs } from "@metaplex/js";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from "@solana/web3.js";

import { DeployItemType, UserPool } from "./types";
import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  filterError,
  getAssociatedTokenAccount,
  getATokenAccountsNeedCreate,
  getMetadata,
  getNFTTokenAccount,
  getOwnerOfNFT,
  isExistAccount,
  METAPLEX,
  solConnection,
} from "./utils";
import { IDL } from "./staking";
import { errorAlert, successAlert } from "../components/toastGroup";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  AMMO_TOKEN_DECIMAL,
  AMMO_TOKEN_MINT,
  GLOBAL_AUTHORITY_SEED,
  STAKING_PROGRAM_ID,
  USER_POOL_SIZE,
  VAULT_SEED,
} from "../config";
import { accessUserVault, getPlanBuyResult } from "./server";
import { fakeWallet } from "./fakeWallet";

export const initUserPool = async (wallet: WalletContextState) => {
  if (!wallet.publicKey) return;
  let userAddress: PublicKey = wallet.publicKey;
  let cloneWindow: any = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    IDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  try {
    const tx = await createInitUserPoolTx(userAddress, program);
    const { blockhash } = await solConnection.getLatestBlockhash("finalized");
    tx.feePayer = userAddress;
    tx.recentBlockhash = blockhash;
    const txId = await wallet.sendTransaction(tx, solConnection);
    await solConnection.confirmTransaction(txId, "finalized");
    successAlert("Created User Pool");
    console.log("Your transaction signature", txId);
  } catch (error) {
    console.log(error);
  }
};

export const depositToAccount = async (
  wallet: WalletContextState,
  amount: number,
  startLoading: Function,
  closeLoading: Function,
  updatePage: Function
) => {
  if (!wallet.publicKey) return;
  let userAddress: PublicKey = wallet.publicKey;
  let cloneWindow: any = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    IDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  try {
    startLoading();
    let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
      userAddress,
      "user-pool",
      STAKING_PROGRAM_ID
    );

    let poolAccount = await solConnection.getAccountInfo(userPoolKey);
    if (poolAccount === null || poolAccount.data === null) {
      await initUserPool(wallet);
    }

    const tx = await createDepositToAccountTx(
      userAddress,
      amount,
      program,
      solConnection
    );

    const { blockhash } = await solConnection.getLatestBlockhash("confirmed");
    tx.feePayer = userAddress;
    tx.recentBlockhash = blockhash;

    const txId = await wallet.sendTransaction(tx, solConnection);

    //add to database
    await accessUserVault(txId);

    await solConnection.confirmTransaction(txId, "finalized");
    successAlert("Transaction is confirmed!");
    closeLoading();
    updatePage();
  } catch (error) {
    console.log(error);
    closeLoading();
    filterError(error);
  }
};

export const withdrawFromAccount = async (
  wallet: WalletContextState,
  amount: number,
  startLoading: Function,
  closeLoading: Function,
  updatePage: Function
) => {
  if (!wallet.publicKey) return;
  let userAddress: PublicKey = wallet.publicKey;
  let cloneWindow: any = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    IDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  try {
    startLoading();
    let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
      userAddress,
      "user-pool",
      STAKING_PROGRAM_ID
    );

    let poolAccount = await solConnection.getAccountInfo(userPoolKey);
    if (poolAccount === null || poolAccount.data === null) {
      await initUserPool(wallet);
    }

    const tx = await createWithdrawFromAccountTx(
      userAddress,
      amount,
      program,
      solConnection
    );
    const { blockhash } = await solConnection.getLatestBlockhash("confirmed");
    tx.feePayer = userAddress;
    tx.recentBlockhash = blockhash;
    const txId = await wallet.sendTransaction(tx, solConnection);

    //add to database
    await accessUserVault(txId);

    await solConnection.confirmTransaction(txId, "finalized");
    successAlert("Transaction is confirmed!");
    closeLoading();
    updatePage();
  } catch (error) {
    console.log(error);
    closeLoading();
    filterError(error);
  }
};

export const depositToVault = async (
  wallet: WalletContextState,
  planId: number,
  startLoading: Function,
  closeLoading: Function,
  updatePage: Function
) => {
  if (!wallet.publicKey) return;
  let userAddress: PublicKey = wallet.publicKey;
  let cloneWindow: any = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    IDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  try {
    startLoading();
    let amount = 0;
    switch (planId) {
      case 1:
        amount = 500;
        break;
      case 2:
        amount = 1500;
        break;
      case 3:
        amount = 3000;
        break;
    }
    const tx = await createDepositToVaultTx(userAddress, amount, program);
    const { blockhash } = await solConnection.getLatestBlockhash("confirmed");
    tx.feePayer = userAddress;
    tx.recentBlockhash = blockhash;
    const txId = await wallet.sendTransaction(tx, solConnection);

    await solConnection.confirmTransaction(txId, "finalized");
    successAlert("Transaction is confirmed!");
    const data = await getPlanBuyResult(txId, planId.toString());
    closeLoading();
    updatePage();
    return data;
  } catch (error) {
    console.log(error);
    closeLoading();
    filterError(error);
    return false;
  }
};

export const fusion = async (
  wallet: any,
  nftMint: PublicKey,
  amount: number,
  newUri: string,
  startLoading: Function,
  closeLoading: Function,
  updatePage: Function
) => {
  if (!wallet.publicKey) return;
  let userAddress: PublicKey = wallet.publicKey;
  let cloneWindow: any = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    IDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  let txId = "";
  try {
    startLoading();
    const [userVault, bump] = await PublicKey.findProgramAddress(
      [Buffer.from(VAULT_SEED), userAddress.toBuffer()],
      STAKING_PROGRAM_ID
    );
    console.log(userVault.toBase58());
    let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
      userAddress,
      "user-pool",
      STAKING_PROGRAM_ID
    );
    let poolAccount = await solConnection.getAccountInfo(userPoolKey);
    if (poolAccount === null || poolAccount.data === null) {
      await initUserPool(wallet);
    }
    const { tx, updateKeypair } = await createFusionTx(
      userAddress,
      nftMint,
      amount,
      newUri,
      program
    );
    // const txId = await wallet.sendTransaction(tx, solConnection);
    const transaction = await wallet.signTransaction(tx);
    const rawTransaction = transaction.serialize();
    let options = {
      skipPreflight: true,
      commitment: "Finalized",
    };
    txId = await solConnection.sendRawTransaction(rawTransaction, options);
    console.log("fusion tx => ", txId);
    await solConnection.confirmTransaction(txId, "finalized");
    successAlert("Transaction is confirmed!");
    closeLoading();
    updatePage();
    return txId;
  } catch (error) {
    console.log(error);
    closeLoading();
    filterError(error);
    return null;
  }
};

export const getAmmo = async (userAddress: PublicKey) => {
  const [userVault, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(VAULT_SEED), userAddress.toBuffer()],
    STAKING_PROGRAM_ID
  );
  let userTokenAccount = await getAssociatedTokenAccount(
    userVault,
    AMMO_TOKEN_MINT
  );
  try {
    let amount = await solConnection.getTokenAccountBalance(userTokenAccount);
    if (amount.value.uiAmount) {
      return amount.value.uiAmount;
    } else {
      return 0;
    }
  } catch (error) {
    // console.log(error);
    return 0;
  }
};

export const createWithdrawFromAccountTx = async (
  userAddress: PublicKey,
  amount: number,
  program: anchor.Program,
  connection: Connection
) => {
  const [userVault, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(VAULT_SEED), userAddress.toBuffer()],
    STAKING_PROGRAM_ID
  );
  let userTokenAccount = await getAssociatedTokenAccount(
    userVault,
    AMMO_TOKEN_MINT
  );
  let { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
    connection,
    userAddress,
    userAddress,
    [AMMO_TOKEN_MINT]
  );

  let tx = new Transaction();
  console.log("==>Withdrawing from Account", destinationAccounts[0].toBase58());
  if (instructions.length > 0) instructions.map((ix) => tx.add(ix));
  tx.add(
    program.instruction.withdrawFromAccount(
      bump,
      new anchor.BN(amount * AMMO_TOKEN_DECIMAL),
      {
        accounts: {
          owner: userAddress,
          userVault,
          userTokenAccount,
          destTokenAccount: destinationAccounts[0],
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        instructions: [],
        signers: [],
      }
    )
  );

  return tx;
};

export const createDepositToAccountTx = async (
  userAddress: PublicKey,
  amount: number,
  program: anchor.Program,
  connection: Connection
) => {
  const [userVault, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(VAULT_SEED), userAddress.toBuffer()],
    STAKING_PROGRAM_ID
  );
  let userTokenAccount = await getAssociatedTokenAccount(
    userAddress,
    AMMO_TOKEN_MINT
  );
  let { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
    connection,
    userAddress,
    userVault,
    [AMMO_TOKEN_MINT]
  );

  let tx = new Transaction();
  console.log("==>Depositing to Account", destinationAccounts[0].toBase58());
  if (instructions.length > 0) instructions.map((ix) => tx.add(ix));
  tx.add(
    program.instruction.depositToAccount(
      new anchor.BN(amount * AMMO_TOKEN_DECIMAL),
      {
        accounts: {
          owner: userAddress,
          userVault,
          userTokenAccount,
          destTokenAccount: destinationAccounts[0],
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        instructions: [],
        signers: [],
      }
    )
  );

  return tx;
};

export const createInitUserPoolTx = async (
  userAddress: PublicKey,
  program: anchor.Program
) => {
  let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
    userAddress,
    "user-pool",
    STAKING_PROGRAM_ID
  );

  const [userVault, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(VAULT_SEED), userAddress.toBuffer()],
    STAKING_PROGRAM_ID
  );
  console.log(USER_POOL_SIZE);
  let ix = SystemProgram.createAccountWithSeed({
    fromPubkey: userAddress,
    basePubkey: userAddress,
    seed: "user-pool",
    newAccountPubkey: userPoolKey,
    lamports: await solConnection.getMinimumBalanceForRentExemption(
      USER_POOL_SIZE
    ),
    space: USER_POOL_SIZE,
    programId: STAKING_PROGRAM_ID,
  });

  let tx = new Transaction();
  console.log("==>initializing user PDA", userPoolKey.toBase58());
  tx.add(ix);
  tx.add(
    program.instruction.initializeUserPool({
      accounts: {
        userPool: userPoolKey,
        userVault,
        owner: userAddress,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      },
      instructions: [],
      signers: [],
    })
  );

  return tx;
};

export const stakeAllNFT = async (
  wallet: WalletContextState,
  nfts: DeployItemType[],
  duration: number,
  startLoading: Function,
  closeLoading: Function,
  updatePage: Function
) => {
  if (!wallet.publicKey) return;
  let userAddress: PublicKey = wallet.publicKey;
  let cloneWindow: any = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    IDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  try {
    startLoading();
    let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
      userAddress,
      "user-pool",
      STAKING_PROGRAM_ID
    );

    let poolAccount = await solConnection.getAccountInfo(userPoolKey);
    if (poolAccount === null || poolAccount.data === null) {
      await initUserPool(wallet);
    }
    let transactions: Transaction[] = [];
    for (let i = 0; i < nfts.length; i++) {
      const tx = await createStakeNftTx(
        new PublicKey(nfts[i].nftMint),
        userAddress,
        program,
        solConnection,
        duration
      );
      console.log(tx);
      if (tx) transactions.push(tx);
    }
    if (transactions.length !== 0) {
      let { blockhash } = await provider.connection.getLatestBlockhash(
        "confirmed"
      );
      transactions.forEach((transaction) => {
        transaction.feePayer = wallet.publicKey as PublicKey;
        transaction.recentBlockhash = blockhash;
      });
      if (wallet.signAllTransactions !== undefined) {
        const signedTransactions = await wallet.signAllTransactions(
          transactions
        );

        let signatures = await Promise.all(
          signedTransactions.map((transaction) =>
            provider.connection.sendRawTransaction(transaction.serialize(), {
              skipPreflight: true,
              maxRetries: 3,
              preflightCommitment: "confirmed",
            })
          )
        );
        await Promise.all(
          signatures.map((signature) =>
            provider.connection.confirmTransaction(signature, "finalized")
          )
        );
        closeLoading();
        successAlert("Transaction is confirmed!");
        updatePage();
      }
    } else {
      closeLoading();
    }
  } catch (error) {
    closeLoading();
    filterError(error);
    console.log(error);
  }
};

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
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    IDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  try {
    startLoading();
    let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
      userAddress,
      "user-pool",
      STAKING_PROGRAM_ID
    );

    let poolAccount = await solConnection.getAccountInfo(userPoolKey);
    if (poolAccount === null || poolAccount.data === null) {
      await initUserPool(wallet);
    }

    const tx = await createStakeNftTx(
      mint,
      userAddress,
      program,
      solConnection,
      duration
    );
    const { blockhash } = await solConnection.getLatestBlockhash("confirmed");
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
};

export const withdrawNft = async (
  wallet: WalletContextState,
  mint: PublicKey,
  startLoading: Function,
  closeLoading: Function,
  updatePage: Function
) => {
  if (!wallet.publicKey) return;
  let userAddress: PublicKey = wallet.publicKey;
  let cloneWindow: any = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    IDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  try {
    startLoading();
    const tx = await createWithdrawNftTx(
      mint,
      userAddress,
      program,
      solConnection
    );
    const { blockhash } = await solConnection.getLatestBlockhash("confirmed");
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
};

export const claimAllNFT = async (
  wallet: WalletContextState,
  nfts: PublicKey[],
  startLoading: Function,
  closeLoading: Function,
  updatePage: Function
) => {
  if (!wallet.publicKey) return;
  let userAddress: PublicKey = wallet.publicKey;
  let cloneWindow: any = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    IDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  try {
    startLoading();
    let transactions: Transaction[] = [];
    for (let i = 0; i < nfts.length; i++) {
      const tx = await createWithdrawNftTx(
        nfts[i],
        userAddress,
        program,
        solConnection
      );
      if (tx) transactions.push(tx);
    }
    if (transactions.length !== 0) {
      let { blockhash } = await provider.connection.getLatestBlockhash(
        "confirmed"
      );
      transactions.forEach((transaction) => {
        transaction.feePayer = wallet.publicKey as PublicKey;
        transaction.recentBlockhash = blockhash;
      });
      if (wallet.signAllTransactions !== undefined) {
        const signedTransactions = await wallet.signAllTransactions(
          transactions
        );

        let signatures = await Promise.all(
          signedTransactions.map((transaction) =>
            provider.connection.sendRawTransaction(transaction.serialize(), {
              skipPreflight: true,
              maxRetries: 3,
              preflightCommitment: "confirmed",
            })
          )
        );
        await Promise.all(
          signatures.map((signature) =>
            provider.connection.confirmTransaction(signature, "finalized")
          )
        );
        closeLoading();
        successAlert("Transaction is confirmed!");
        updatePage();
      }
    } else {
      closeLoading();
    }
  } catch (error) {
    closeLoading();
    filterError(error);
    console.log(error);
  }
};

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
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    IDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  try {
    startLoading();
    const tx = await createWithdrawTx(
      userAddress,
      amount,
      program,
      solConnection
    );
    const { blockhash } = await solConnection.getLatestBlockhash("confirmed");
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
};
export const createWithdrawNftTx = async (
  mint: PublicKey,
  userAddress: PublicKey,
  program: anchor.Program,
  connection: Connection
) => {
  const [userVault, userBump] = await PublicKey.findProgramAddress(
    [Buffer.from(VAULT_SEED), userAddress.toBuffer()],
    STAKING_PROGRAM_ID
  );
  let ret = await getATokenAccountsNeedCreate(
    connection,
    userAddress,
    userAddress,
    [mint]
  );
  let ret1 = await getATokenAccountsNeedCreate(
    connection,
    userAddress,
    userVault,
    [AMMO_TOKEN_MINT]
  );
  let userTokenAccount = ret.destinationAccounts[0];
  console.log("User NFT = ", mint.toBase58(), userTokenAccount.toBase58());

  const [globalAuthority, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    STAKING_PROGRAM_ID
  );
  let rewardVault = await getAssociatedTokenAccount(
    globalAuthority,
    AMMO_TOKEN_MINT
  );
  let destNftTokenAccount = await getAssociatedTokenAccount(
    globalAuthority,
    mint
  );

  let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
    userAddress,
    "user-pool",
    STAKING_PROGRAM_ID
  );

  let tx = new Transaction();

  if (ret.instructions.length > 0) ret.instructions.map((ix) => tx.add(ix));
  if (ret1.instructions.length > 0) ret1.instructions.map((ix) => tx.add(ix));
  console.log("==> Withdrawing ... ", mint.toBase58());
  console.log(globalAuthority.toBase58());
  console.log(userTokenAccount.toBase58());
  console.log(destNftTokenAccount.toBase58());
  console.log(rewardVault.toBase58());
  console.log(userVault.toBase58());
  console.log(ret1.destinationAccounts[0].toBase58());
  

  tx.add(
    program.instruction.withdrawNftFromPool(bump, {
      accounts: {
        owner: userAddress,
        globalAuthority,
        userPool: userPoolKey,
        userNftTokenAccount: userTokenAccount,
        destNftTokenAccount,
        rewardVault,
        userVault,
        userRewardAccount: ret1.destinationAccounts[0],
        nftMint: mint,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      instructions: [],
      signers: [],
    })
  );

  return tx;
};
export const createWithdrawTx = async (
  userAddress: PublicKey,
  amount: number,
  program: anchor.Program,
  connection: Connection
) => {
  const [globalAuthority, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    STAKING_PROGRAM_ID
  );
  let rewardVault = await getAssociatedTokenAccount(
    globalAuthority,
    AMMO_TOKEN_MINT
  );

  let ret = await getATokenAccountsNeedCreate(
    connection,
    userAddress,
    userAddress,
    [AMMO_TOKEN_MINT]
  );

  let tx = new Transaction();
  console.log("==> Withdrawing Token ... ", amount);

  if (ret.instructions.length > 0) ret.instructions.map((ix) => tx.add(ix));
  tx.add(
    program.instruction.withdrawToken(
      bump,
      new anchor.BN(amount * AMMO_TOKEN_DECIMAL),
      {
        accounts: {
          owner: userAddress,
          globalAuthority,
          rewardVault,
          userRewardAccount: ret.destinationAccounts[0],
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        instructions: [],
        signers: [],
      }
    )
  );

  return tx;
};

export const getUserPoolInfo = async (wallet: WalletContextState) => {
  if (!wallet.publicKey) return;
  const userInfo: UserPool | null = await getUserPoolState(wallet);
  if (userInfo)
    return {
      owner: userInfo.owner.toBase58(),
      stakedCount: userInfo.stakedCount.toNumber(),
      staking: userInfo.staking.map((info) => {
        return {
          mint: info.mint.toBase58(),
          stakedTime: info.stakedTime.toNumber(),
          lockTime: info.lockTime.toNumber(),
          duration: info.duration.toNumber(),
        };
      }),
    };
};

export const getUserPoolState = async (
  wallet: WalletContextState
): Promise<UserPool | null> => {
  if (!wallet.publicKey) return null;
  let userAddress: PublicKey = wallet.publicKey;
  let cloneWindow: any = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    IDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
    userAddress,
    "user-pool",
    STAKING_PROGRAM_ID
  );
  try {
    let userPoolState = await program.account.userPool.fetch(userPoolKey);
    return userPoolState as unknown as UserPool;
  } catch {
    return null;
  }
};
export const getUserVaultState = async (
  userAddress: PublicKey,
  program: anchor.Program
): Promise<UserPool | null> => {
  const [userVaultKey, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(VAULT_SEED), userAddress.toBuffer()],
    STAKING_PROGRAM_ID
  );

  try {
    let userVState = await program.account.userVault.fetch(userVaultKey);
    return (userVState as any).amount.toNumber();
  } catch {
    return null;
  }
};
export const createStakeNftTx = async (
  mint: PublicKey,
  userAddress: PublicKey,
  program: anchor.Program,
  connection: Connection,
  duration: number
) => {
  const [globalAuthority, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    STAKING_PROGRAM_ID
  );

  let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
    userAddress,
    "user-pool",
    STAKING_PROGRAM_ID
  );

  let userTokenAccount = await getAssociatedTokenAccount(userAddress, mint);
  if (!(await isExistAccount(userTokenAccount, connection))) {
    let accountOfNFT = await getNFTTokenAccount(mint, connection);
    if (userTokenAccount.toBase58() != accountOfNFT.toBase58()) {
      let nftOwner = await getOwnerOfNFT(mint, connection);
      if (nftOwner.toBase58() == userAddress.toBase58())
        userTokenAccount = accountOfNFT;
      else if (nftOwner.toBase58() !== globalAuthority.toBase58()) {
        throw "Error: Nft is not owned by user";
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

  console.log("Dest NFT Account = ", destinationAccounts[0].toBase58());

  const metadata = await getMetadata(mint);

  console.log("Metadata=", metadata.toBase58());

  let tx = new Transaction();

  if (instructions.length > 0) instructions.map((ix) => tx.add(ix));
  console.log("==>Staking ...", mint.toBase58(), duration);

  tx.add(
    program.instruction.stakeNftToPool(bump, new anchor.BN(duration), {
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
    })
  );

  return tx;
};

export const getNftMetaData = async (nftMintPk: PublicKey) => {
  let {
    metadata: { Metadata },
  } = programs;
  let metadataAccount = await Metadata.getPDA(nftMintPk);
  const metadata = await Metadata.load(solConnection, metadataAccount);
  return metadata.data.data.uri;
};

export const createDepositToVaultTx = async (
  userAddress: PublicKey,
  amount: number,
  program: anchor.Program
) => {
  console.log(amount, "===> amount");
  const [globalAuthority, globalBump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    STAKING_PROGRAM_ID
  );

  const [userVault, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(VAULT_SEED), userAddress.toBuffer()],
    STAKING_PROGRAM_ID
  );
  console.log(userVault.toBase58());
  console.log(await getUserVaultState(userAddress, program));
  let rewardVault = await getAssociatedTokenAccount(
    globalAuthority,
    AMMO_TOKEN_MINT
  );
  let userTokenAccount = await getAssociatedTokenAccount(
    userVault,
    AMMO_TOKEN_MINT
  );

  let tx = new Transaction();
  console.log("==>Depositing to Vault...", rewardVault.toBase58());
  tx.add(
    program.instruction.depositToVault(
      bump,
      new anchor.BN(amount * AMMO_TOKEN_DECIMAL),
      {
        accounts: {
          owner: userAddress,
          globalAuthority,
          userVault,
          rewardVault,
          userTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        instructions: [],
        signers: [],
      }
    )
  );

  return tx;
};

export const createFusionTx = async (
  userAddress: PublicKey,
  nftMint: PublicKey,
  amount: number,
  newUri: string,
  program: anchor.Program
) => {
  const [globalAuthority, globalBump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    STAKING_PROGRAM_ID
  );

  const updateKeypair = Keypair.fromSecretKey(Uint8Array.from(fakeWallet), {
    skipValidation: true,
  });

  const [userVault, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(VAULT_SEED), userAddress.toBuffer()],
    STAKING_PROGRAM_ID
  );
  let rewardVault = await getAssociatedTokenAccount(
    globalAuthority,
    AMMO_TOKEN_MINT
  );
  let userTokenAccount = await getAssociatedTokenAccount(
    userVault,
    AMMO_TOKEN_MINT
  );

  const metadata = await getMetadata(nftMint);

  let tx = new Transaction();
  console.log("==>Fusioning...", nftMint.toBase58());
  tx.add(
    program.instruction.fusion(
      bump,
      new anchor.BN(amount * AMMO_TOKEN_DECIMAL),
      newUri,
      {
        accounts: {
          owner: userAddress,
          globalAuthority,
          updateAuthority: updateKeypair.publicKey,
          userVault,
          rewardVault,
          userTokenAccount,
          nftMint,
          mintMetadata: metadata,
          tokenMetadataProgram: METAPLEX,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        signers: [updateKeypair],
      }
    )
  );

  const { blockhash } = await solConnection.getLatestBlockhash("finalized");
  tx.feePayer = userAddress;
  tx.recentBlockhash = blockhash;

  tx.setSigners(
    // fee payed by the wallet owner
    userAddress,
    updateKeypair.publicKey
  );

  tx.partialSign(updateKeypair);

  console.log(updateKeypair.publicKey.toBase58());

  return { tx, updateKeypair };
};
