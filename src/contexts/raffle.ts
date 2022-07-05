export type Raffle = {
    "version": "0.1.0",
    "name": "raffle",
    "instructions": [
        {
            "name": "initialize",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "collection",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "bump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "addCollection",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "collection",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "collectionId",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "createRaffle",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "raffle",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "collection",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "ownerTempNftAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "destNftTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "nftMintAddress",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "mintMetadata",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenMetadataProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                },
                {
                    "name": "ticketPriceSol",
                    "type": "u64"
                },
                {
                    "name": "endTimestamp",
                    "type": "i64"
                },
                {
                    "name": "maxEntrants",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "buyTickets",
            "accounts": [
                {
                    "name": "buyer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "raffle",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "creator",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "treasuryWallet",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                },
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "revealWinner",
            "accounts": [
                {
                    "name": "buyer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "raffle",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "claimReward",
            "accounts": [
                {
                    "name": "claimer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "raffle",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "claimerNftTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "srcNftTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "nftMintAddress",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "withdrawNft",
            "accounts": [
                {
                    "name": "claimer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "raffle",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "claimerNftTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "srcNftTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "nftMintAddress",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "GlobalPool",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "superAdmin",
                        "type": "publicKey"
                    }
                ]
            }
        },
        {
            "name": "CollectionPool",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "count",
                        "type": "u64"
                    },
                    {
                        "name": "collections",
                        "type": {
                            "array": [
                                "publicKey",
                                400
                            ]
                        }
                    }
                ]
            }
        },
        {
            "name": "RafflePool",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "creator",
                        "type": "publicKey"
                    },
                    {
                        "name": "nftMint",
                        "type": "publicKey"
                    },
                    {
                        "name": "count",
                        "type": "u64"
                    },
                    {
                        "name": "noRepeat",
                        "type": "u64"
                    },
                    {
                        "name": "maxEntrants",
                        "type": "u64"
                    },
                    {
                        "name": "startTimestamp",
                        "type": "i64"
                    },
                    {
                        "name": "endTimestamp",
                        "type": "i64"
                    },
                    {
                        "name": "ticketPriceSol",
                        "type": "u64"
                    },
                    {
                        "name": "claimed",
                        "type": "u64"
                    },
                    {
                        "name": "winnerIndex",
                        "type": "u64"
                    },
                    {
                        "name": "winner",
                        "type": "publicKey"
                    },
                    {
                        "name": "entrants",
                        "type": {
                            "array": [
                                "publicKey",
                                2000
                            ]
                        }
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "MaxEntrantsTooLarge",
            "msg": "Max entrants is too large"
        },
        {
            "code": 6001,
            "name": "RaffleEnded",
            "msg": "Raffle has ended"
        },
        {
            "code": 6002,
            "name": "NotREAPToken",
            "msg": "Your Token is not REAP Token"
        },
        {
            "code": 6003,
            "name": "RaffleNotEnded",
            "msg": "Raffle has not ended"
        },
        {
            "code": 6004,
            "name": "InvalidPrizeIndex",
            "msg": "Invalid prize index"
        },
        {
            "code": 6005,
            "name": "EndTimeError",
            "msg": "Invalid new End time"
        },
        {
            "code": 6006,
            "name": "NoPrize",
            "msg": "No prize"
        },
        {
            "code": 6007,
            "name": "NotCreator",
            "msg": "You are not the Creator"
        },
        {
            "code": 6008,
            "name": "NotWinner",
            "msg": "You are not the Winnner"
        },
        {
            "code": 6009,
            "name": "OtherEntrants",
            "msg": "There are other Entrants"
        },
        {
            "code": 6010,
            "name": "InvalidCalculation",
            "msg": "Invalid calculation"
        },
        {
            "code": 6011,
            "name": "NotEnoughSOL",
            "msg": "You don't have enough SOL"
        },
        {
            "code": 6012,
            "name": "NotEnoughTicketsLeft",
            "msg": "Not enough tickets left"
        },
        {
            "code": 6013,
            "name": "RaffleStillRunning",
            "msg": "Raffle is still running"
        },
        {
            "code": 6014,
            "name": "WinnersAlreadyDrawn",
            "msg": "Winner already drawn"
        },
        {
            "code": 6015,
            "name": "WinnerNotDrawn",
            "msg": "Winner not drawn"
        },
        {
            "code": 6016,
            "name": "InvalidRevealedData",
            "msg": "Invalid revealed data"
        },
        {
            "code": 6017,
            "name": "TokenAccountNotOwnedByWinner",
            "msg": "Ticket account not owned by winner"
        },
        {
            "code": 6018,
            "name": "TicketHasNotWon",
            "msg": "Ticket has not won"
        },
        {
            "code": 6019,
            "name": "UnclaimedPrizes",
            "msg": "Unclaimed prizes"
        },
        {
            "code": 6020,
            "name": "InvalidRecentBlockhashes",
            "msg": "Invalid recent blockhashes"
        },
        {
            "code": 6021,
            "name": "InvalidCollection",
            "msg": "Invalid Collections"
        },
        {
            "code": 6022,
            "name": "InvaliedMetadata",
            "msg": "Invalid Metadata Address"
        },
        {
            "code": 6023,
            "name": "MetadataCreatorParseError",
            "msg": "Can't Parse The NFT's Creators"
        },
        {
            "code": 6024,
            "name": "UnkownOrNotAllowedNFTCollection",
            "msg": "Unknown Collection Or The Collection Is Not Allowed"
        }
    ]
};

export const IDL: Raffle = {
    "version": "0.1.0",
    "name": "raffle",
    "instructions": [
        {
            "name": "initialize",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "collection",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "bump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "addCollection",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "collection",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "collectionId",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "createRaffle",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "raffle",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "collection",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "ownerTempNftAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "destNftTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "nftMintAddress",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "mintMetadata",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenMetadataProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                },
                {
                    "name": "ticketPriceSol",
                    "type": "u64"
                },
                {
                    "name": "endTimestamp",
                    "type": "i64"
                },
                {
                    "name": "maxEntrants",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "buyTickets",
            "accounts": [
                {
                    "name": "buyer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "raffle",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "creator",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "treasuryWallet",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                },
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "revealWinner",
            "accounts": [
                {
                    "name": "buyer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "raffle",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "claimReward",
            "accounts": [
                {
                    "name": "claimer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "raffle",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "claimerNftTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "srcNftTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "nftMintAddress",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "withdrawNft",
            "accounts": [
                {
                    "name": "claimer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "raffle",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "claimerNftTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "srcNftTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "nftMintAddress",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "GlobalPool",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "superAdmin",
                        "type": "publicKey"
                    }
                ]
            }
        },
        {
            "name": "CollectionPool",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "count",
                        "type": "u64"
                    },
                    {
                        "name": "collections",
                        "type": {
                            "array": [
                                "publicKey",
                                400
                            ]
                        }
                    }
                ]
            }
        },
        {
            "name": "RafflePool",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "creator",
                        "type": "publicKey"
                    },
                    {
                        "name": "nftMint",
                        "type": "publicKey"
                    },
                    {
                        "name": "count",
                        "type": "u64"
                    },
                    {
                        "name": "noRepeat",
                        "type": "u64"
                    },
                    {
                        "name": "maxEntrants",
                        "type": "u64"
                    },
                    {
                        "name": "startTimestamp",
                        "type": "i64"
                    },
                    {
                        "name": "endTimestamp",
                        "type": "i64"
                    },
                    {
                        "name": "ticketPriceSol",
                        "type": "u64"
                    },
                    {
                        "name": "claimed",
                        "type": "u64"
                    },
                    {
                        "name": "winnerIndex",
                        "type": "u64"
                    },
                    {
                        "name": "winner",
                        "type": "publicKey"
                    },
                    {
                        "name": "entrants",
                        "type": {
                            "array": [
                                "publicKey",
                                2000
                            ]
                        }
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "MaxEntrantsTooLarge",
            "msg": "Max entrants is too large"
        },
        {
            "code": 6001,
            "name": "RaffleEnded",
            "msg": "Raffle has ended"
        },
        {
            "code": 6002,
            "name": "NotREAPToken",
            "msg": "Your Token is not REAP Token"
        },
        {
            "code": 6003,
            "name": "RaffleNotEnded",
            "msg": "Raffle has not ended"
        },
        {
            "code": 6004,
            "name": "InvalidPrizeIndex",
            "msg": "Invalid prize index"
        },
        {
            "code": 6005,
            "name": "EndTimeError",
            "msg": "Invalid new End time"
        },
        {
            "code": 6006,
            "name": "NoPrize",
            "msg": "No prize"
        },
        {
            "code": 6007,
            "name": "NotCreator",
            "msg": "You are not the Creator"
        },
        {
            "code": 6008,
            "name": "NotWinner",
            "msg": "You are not the Winnner"
        },
        {
            "code": 6009,
            "name": "OtherEntrants",
            "msg": "There are other Entrants"
        },
        {
            "code": 6010,
            "name": "InvalidCalculation",
            "msg": "Invalid calculation"
        },
        {
            "code": 6011,
            "name": "NotEnoughSOL",
            "msg": "You don't have enough SOL"
        },
        {
            "code": 6012,
            "name": "NotEnoughTicketsLeft",
            "msg": "Not enough tickets left"
        },
        {
            "code": 6013,
            "name": "RaffleStillRunning",
            "msg": "Raffle is still running"
        },
        {
            "code": 6014,
            "name": "WinnersAlreadyDrawn",
            "msg": "Winner already drawn"
        },
        {
            "code": 6015,
            "name": "WinnerNotDrawn",
            "msg": "Winner not drawn"
        },
        {
            "code": 6016,
            "name": "InvalidRevealedData",
            "msg": "Invalid revealed data"
        },
        {
            "code": 6017,
            "name": "TokenAccountNotOwnedByWinner",
            "msg": "Ticket account not owned by winner"
        },
        {
            "code": 6018,
            "name": "TicketHasNotWon",
            "msg": "Ticket has not won"
        },
        {
            "code": 6019,
            "name": "UnclaimedPrizes",
            "msg": "Unclaimed prizes"
        },
        {
            "code": 6020,
            "name": "InvalidRecentBlockhashes",
            "msg": "Invalid recent blockhashes"
        },
        {
            "code": 6021,
            "name": "InvalidCollection",
            "msg": "Invalid Collections"
        },
        {
            "code": 6022,
            "name": "InvaliedMetadata",
            "msg": "Invalid Metadata Address"
        },
        {
            "code": 6023,
            "name": "MetadataCreatorParseError",
            "msg": "Can't Parse The NFT's Creators"
        },
        {
            "code": 6024,
            "name": "UnkownOrNotAllowedNFTCollection",
            "msg": "Unknown Collection Or The Collection Is Not Allowed"
        }
    ]
};
