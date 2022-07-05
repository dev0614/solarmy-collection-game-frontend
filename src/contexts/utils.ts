import { web3 } from '@project-serum/anchor';
import { programs } from "@metaplex/js";
import { NETWORK, RPC_URL } from "../config";
import { PublicKey } from '@solana/web3.js';

export const solConnection = new web3.Connection(RPC_URL,
    { confirmTransactionInitialTimeout: 60000 });

export const getNftMetaData = async (nftMintPk: PublicKey) => {
    let { metadata: { Metadata } } = programs;
    let metadataAccount = await Metadata.getPDA(nftMintPk);
    const metadata = await Metadata.load(solConnection, metadataAccount);
    return metadata.data.data.uri;
}
