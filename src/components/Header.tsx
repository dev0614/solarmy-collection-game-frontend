import { ClickAwayListener } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getUsername, setUserName } from "../contexts/server";
import { getAmmo } from "../contexts/transaction_staking";
import { ArrowBackIosTwoTone, CheckTwoTone, CloseTwoTone, DiscordIcon, EditTwoTone } from "./svgIcons";

export default function Header(props: {
    back?: {
        backUrl: string,
        title: string
    },

}) {
    const router = useRouter();
    const wallet = useWallet();
    const [isEdit, setIsEdit] = useState(false);
    const [userName, setName] = useState("");
    const [userAmmo, setUserAmmo] = useState<number | null>(0);
    const getName = async () => {
        if (wallet.publicKey) {
            const name = await getUsername(wallet.publicKey.toBase58());
            setName(name)
        }
    }

    const updatePage = async () => {
        getUserAmmo();
        getName();
    }

    const updateUserName = async () => {
        if (wallet.publicKey) {
            await setUserName(wallet.publicKey.toBase58(), userName);
            setIsEdit(false);
        }
    }

    const getUserAmmo = async () => {
        if (wallet.publicKey) {
            const ammo = await getAmmo(wallet.publicKey);
            setUserAmmo(ammo)
        }
    }

    useEffect(() => {
        updatePage();
    }, [wallet.connected])


    useEffect(() => {
        if (wallet.publicKey) {
            getName();
        }
    }, [wallet.connected])
    return (
        <header>
            <div className="header-content">
                <div className="back-link">
                    {props.back &&
                        <button className="btn-back" onClick={() => router.push(props.back ? props.back.backUrl : "/")}>
                            <div className="btn-body">
                                <ArrowBackIosTwoTone />
                            </div>
                            <span>{props.back.title}</span>
                        </button>
                    }
                </div>
                {wallet.publicKey &&
                    <div className="header-control">
                        <div className="user-badge">
                            {/* eslint-disable-next-line */}
                            <img
                                src="/img/badge/special-forces-sm.png"
                                alt=""
                                className="badge-sm"
                            />
                        </div>
                        <div className="username-box">
                            {isEdit ?
                                <ClickAwayListener onClickAway={() => setIsEdit(false)}>
                                    <div className="name-control">
                                        <div className="default-input">
                                            <label>Play Name</label>
                                            <input
                                                className=""
                                                value={userName}
                                                placeholder="Input"
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <button onClick={() => setIsEdit(false)}><CloseTwoTone /></button>
                                        <button onClick={() => updateUserName()}><CheckTwoTone /></button>
                                    </div>
                                </ClickAwayListener>
                                :
                                <>
                                    <div className="name">
                                        <p>{userName === "" ? "Player" : userName}</p>
                                        <label><DiscordIcon /><span>Username</span></label>
                                    </div>
                                    <button className="btn-icon" onClick={() => setIsEdit(true)}>
                                        <EditTwoTone />
                                    </button>
                                </>
                            }
                        </div>
                        <button className="special-effect">
                            {/* eslint-disable-next-line */}
                            <img
                                src="/img/special-effects.png"
                                alt=""
                            />
                        </button>
                        <button className="btn-balance" onClick={() => router.push("/bunker")}>
                            <div className="content">
                                {/* eslint-disable-next-line */}
                                <img
                                    src="/img/ammo.svg"
                                    className="ammo-icon"
                                    alt=""
                                />
                                <p>{userAmmo?.toLocaleString()} $AMMO</p>
                                <h5>Buy here</h5>
                            </div>
                        </button>
                    </div>
                }
            </div>
        </header>
    )
}