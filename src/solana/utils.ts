import {
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
  Transaction,
  Keypair,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  MintLayout,
} from "@solana/spl-token";
import { web3 } from "@project-serum/anchor";
import { errorAlert } from "../components/toastGroup";
import { programs } from "@metaplex/js";

export const METAPLEX = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const solConnection = new web3.Connection(
  'https://delicate-attentive-silence.solana-mainnet.quiknode.pro/95b6a731ab28cf055accc29fdd2a78abe8dd1e6b/'
);

export const getOwnerOfNFT = async (
  nftMintPk: PublicKey,
  connection: Connection
): Promise<PublicKey> => {
  let tokenAccountPK = await getNFTTokenAccount(nftMintPk, connection);
  let tokenAccountInfo = await connection.getAccountInfo(tokenAccountPK);

  console.log("nftMintPk=", nftMintPk.toBase58());
  console.log("tokenAccountInfo =", tokenAccountInfo);

  if (tokenAccountInfo && tokenAccountInfo.data) {
    let ownerPubkey = new PublicKey(tokenAccountInfo.data.slice(32, 64));
    console.log("ownerPubkey=", ownerPubkey.toBase58());
    return ownerPubkey;
  }
  return new PublicKey("");
};

// get sum value from Object array
export const getSum = (items: any, prop: any) => {
  return items.reduce(function (a: any, b: any) {
    return parseFloat(a) + parseFloat(b[prop]);
  }, 0);
};

export const getTokenAccount = async (
  mintPk: PublicKey,
  userPk: PublicKey,
  connection: Connection
): Promise<PublicKey> => {
  let tokenAccount = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
    filters: [
      {
        dataSize: 165,
      },
      {
        memcmp: {
          offset: 0,
          bytes: mintPk.toBase58(),
        },
      },
      {
        memcmp: {
          offset: 32,
          bytes: userPk.toBase58(),
        },
      },
    ],
  });
  return tokenAccount[0].pubkey;
};

export const getNFTTokenAccount = async (
  nftMintPk: PublicKey,
  connection: Connection
): Promise<PublicKey> => {
  console.log("getNFTTokenAccount nftMintPk=", nftMintPk.toBase58());
  let tokenAccount = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
    filters: [
      {
        dataSize: 165,
      },
      {
        memcmp: {
          offset: 64,
          bytes: "2",
        },
      },
      {
        memcmp: {
          offset: 0,
          bytes: nftMintPk.toBase58(),
        },
      },
    ],
  });
  return tokenAccount[0].pubkey;
};

export const getAssociatedTokenAccount = async (
  ownerPubkey: PublicKey,
  mintPk: PublicKey
): Promise<PublicKey> => {
  let associatedTokenAccountPubkey = (
    await PublicKey.findProgramAddress(
      [
        ownerPubkey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mintPk.toBuffer(), // mint address
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0];
  return associatedTokenAccountPubkey;
};

export const getATokenAccountsNeedCreate = async (
  connection: Connection,
  walletAddress: PublicKey,
  owner: PublicKey,
  nfts: PublicKey[]
) => {
  let instructions = [],
    destinationAccounts = [];
  for (const mint of nfts) {
    const destinationPubkey = await getAssociatedTokenAccount(owner, mint);
    const response = await connection.getAccountInfo(destinationPubkey);
    if (!response) {
      const createATAIx = createAssociatedTokenAccountInstruction(
        destinationPubkey,
        walletAddress,
        owner,
        mint
      );
      instructions.push(createATAIx);
    }
    destinationAccounts.push(destinationPubkey);
  }
  return {
    instructions,
    destinationAccounts,
  };
};

export const createAssociatedTokenAccountInstruction = (
  associatedTokenAddress: PublicKey,
  payer: PublicKey,
  walletAddress: PublicKey,
  splTokenMintAddress: PublicKey
) => {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
    { pubkey: walletAddress, isSigner: false, isWritable: false },
    { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  return new TransactionInstruction({
    keys,
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    data: Buffer.from([]),
  });
};

/** Get metaplex mint metadata account address */
export const getMetadata = async (mint: PublicKey): Promise<PublicKey> => {
  return (
    await PublicKey.findProgramAddress(
      [Buffer.from("metadata"), METAPLEX.toBuffer(), mint.toBuffer()],
      METAPLEX
    )
  )[0];
};

export const airdropSOL = async (
  address: PublicKey,
  amount: number,
  connection: Connection
) => {
  try {
    const txId = await connection.requestAirdrop(address, amount);
    await connection.confirmTransaction(txId);
  } catch (e) {
    console.log("Aridrop Failure", address.toBase58(), amount);
  }
};

export const createTokenMint = async (
  connection: Connection,
  payer: Keypair,
  mint: Keypair
) => {
  const ret = await connection.getAccountInfo(mint.publicKey);
  if (ret && ret.data) {
    console.log("Token already in use", mint.publicKey.toBase58());
    return;
  }
  // Allocate memory for the account
  const balanceNeeded = await Token.getMinBalanceRentForExemptMint(connection);
  const transaction = new Transaction();
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mint.publicKey,
      lamports: balanceNeeded,
      space: MintLayout.span,
      programId: TOKEN_PROGRAM_ID,
    })
  );
  transaction.add(
    Token.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      9,
      payer.publicKey,
      payer.publicKey
    )
  );
  const txId = await connection.sendTransaction(transaction, [payer, mint]);
  await connection.confirmTransaction(txId);

  console.log("Tx Hash=", txId);
};

export const isExistAccount = async (
  address: PublicKey,
  connection: Connection
) => {
  try {
    const res = await connection.getAccountInfo(address);
    if (res && res.data) return true;
  } catch (e) {
    return false;
  }
};

export const getTokenAccountBalance = async (
  account: PublicKey,
  connection: Connection
) => {
  try {
    const res = await connection.getTokenAccountBalance(account);
    if (res && res.value) return res.value.uiAmount;
    return 0;
  } catch (e) {
    console.log(e);
    return 0;
  }
};

export const getNftMetaData = async (nftMintPk: PublicKey) => {
  let {
    metadata: { Metadata },
  } = programs;
  let metadataAccount = await Metadata.getPDA(nftMintPk);
  const metadata = await Metadata.load(solConnection, metadataAccount);
  return metadata.data.data.uri;
};

export const filterError = (error: any) => {
  if (error.message) {
    const errorCode = parseInt(
      error.message.split("custom program error: ")[1]
    );
    // "custom program error: "
    switch (errorCode) {
      case 6000:
        errorAlert("Invalid Super Owner");
        break;
      case 6001:
        errorAlert("Invalid Global Pool Address.");
        break;
      case 6002:
        errorAlert("Invalid User Pool Owner Address");
        break;
      case 6003:
        errorAlert("Invalid Withdraw Time");
        break;
      case 6004:
        errorAlert("Not Found Staked Mint");
        break;
      case 6005:
        errorAlert("Insufficient Reward Token Balance");
        break;
      case 6006:
        errorAlert("Insufficient Account Token Balance");
        break;
      case 6007:
        errorAlert("Invalid Metadata Address");
        break;
      case 6008:
        errorAlert("Can't Parse The NFT's Creators");
        break;
      case 6009:
        errorAlert("Unknown Collection Or The Collection Is Not Allowed");
        break;
      case 4001:
        errorAlert("User Reject the Request");
        break;
      case 3007:
        errorAlert(
          "The given account is owned by a different program than expected"
        );
        break;
      default:
        break;
    }
  }
  if (error?.code === 4001) {
    errorAlert("User rejected the request.");
  }
  if (error?.code === -32603) {
    errorAlert("Something went wrong.");
  }
  if (error?.code === -32003) {
    errorAlert("Signature verification failed");
  }
};

export const pad = (d: number) => {
  return d < 10 ? "0" + d.toString() : d.toString();
};

export function titleCase(str: string) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toLowerCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
}

export function titleLowerCase(str: string) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toLowerCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
}

export function titleCamel(str: string) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toLowerCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join("_");
}

export function removeItemFromArray(
  array: any,
  attr: string,
  attr_type: string
) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].attribute === attr && array[i].attribute_type === attr_type) {
      return array.splice(i, 1);
    }
  }
}

export const getBadgeInfo = (number: number) => {
  let image = "",
    name = "";
  switch (number) {
    case 8:
      image = "/img/badge/general.svg";
      name = "General";
    case 7:
      image = "/img/badge/colonel.svg";
      name = "Colonel";
    case 6:
      image = "/img/badge/major.svg";
      name = "Major";
    case 5:
      image = "/img/badge/captain.svg";
      name = "Captain";
    case 4:
      image = "/img/badge/lieutenant.svg";
      name = "Lieutenant";
    case 3:
      image = "/img/badge/master sergeant.svg";
      name = "Master Sergeant";
    case 2:
      image = "/img/badge/sergeant.svg";
      name = "Sergeant";
    case 1:
      image = "/img/badge/corporal.svg";
      name = "Corporal";
  }
  return { image, name };
};
