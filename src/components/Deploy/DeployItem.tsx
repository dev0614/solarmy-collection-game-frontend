import { ClickAwayListener } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { DEPLOY_LEVEL } from "../../config";
import { stakeNFT } from "../../contexts/transaction_staking";
import ClipLoader from "react-spinners/ClipLoader";
import { DeployIcon, HiveIcon, MissionActiveIcon, MissionCompletedIcon, MissionReverseIcon } from "../svgIcons";

export default function DeployItem(props: {
    status?: "reverse" | "active" | "complete",
    nftMint: string,
    uri: string,
    update: Function,
    stakedTime?: number,
    lockTime?: number
    duration?: number
}) {
    const { nftMint } = props;
    const [actionState, setActionState] = useState(false);
    const [level, setLevel] = useState(1);
    const [levelId, setLevelId] = useState(0);
    const [showStake, setShowStake] = useState(false);
    const [isStakeLoading, setIsStakeLoading] = useState(false);
    const [nftId, setNftId] = useState(1);
    const [image, setImage] = useState("");

    const wallet = useWallet();
    const handleLevel = (level: number, id: number) => {
        setLevel(level);
        setLevelId(id)
    }

    const handleShowStake = (level: number, id: number) => {
        setLevel(level);
        setLevelId(id);
        setShowStake(true);
    }

    const getNftData = async () => {
        if (props.status === "reverse") {
            await fetch(props.uri)
                .then(resp =>
                    resp.json()
                ).then((json) => {
                    setNftId(json?.name.split("#")[1]);
                    setImage(json?.image)
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    const onOutClick = () => {
        setShowStake(false);
        setActionState(false)
    }

    const onStake = async () => {
        if (!wallet.publicKey) return;
        try {
            await stakeNFT(wallet, new PublicKey(nftMint), level, () => setIsStakeLoading(true), () => setIsStakeLoading(false), () => props.update());
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getNftData();
    }, [])
    return (

        <ClickAwayListener onClickAway={() => onOutClick()}>
            <div className="deploy-item" >
                {!actionState ?
                    <div className="item-content">
                        <div className="media">
                            {/* eslint-disable-next-line */}
                            <img
                                src={image}
                                alt=""
                            />
                        </div>
                        <div className={`item-box ${props.status === "reverse" ? "no-right" : ""}`}>
                            <div className="content">
                                <div className="content-header">
                                    <p className="id">{nftId ? "#" + nftId : ""}</p>
                                    {props.status === "reverse" &&
                                        <div className="status">
                                            <span className="icon">
                                                <MissionReverseIcon />
                                            </span>
                                            <span>
                                                Reverse
                                            </span>
                                        </div>
                                    }
                                    {props.status === "active" &&
                                        <div className="status">
                                            <span className="icon">
                                                <MissionActiveIcon />
                                            </span>
                                            <span>
                                                Active Mission
                                            </span>
                                        </div>
                                    }
                                    {props.status === "complete" &&
                                        <div className="status">
                                            <span className="icon">
                                                <MissionCompletedIcon />
                                            </span>
                                            <span>
                                                Mission Completed
                                            </span>
                                        </div>
                                    }
                                </div>
                                {props.status === "reverse" &&
                                    <div className="item-action">
                                        <button className="btn-deploy" onClick={() => setActionState(true)}>
                                            deploy
                                        </button>
                                    </div>
                                }
                                {(props.status === "active" || props.status === "complete") &&
                                    <div className="deploy-active-view">
                                        <div className="top">
                                            <h4>Deployed days</h4>
                                            <p>7/10</p>
                                        </div>
                                        <div className="processbar">
                                            <span className="process" style={{ width: "70%" }}></span>
                                        </div>
                                        <div className="bottom">
                                            <h5>AMMO Rewards</h5>
                                            <p>1350 + 270 Bonus</p>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="deploy-action-right">
                                {props.status === "active" &&
                                    <button className="btn-delist">
                                        delist
                                    </button>
                                }
                                {props.status === "complete" &&
                                    <button className="btn-claim">
                                        claim
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <div className="item-content">
                        <div className="media">
                            {/* eslint-disable-next-line */}
                            <img
                                src={image}
                                alt=""
                            />
                            <div className="media-overlay">
                                {/* eslint-disable-next-line */}
                                <img
                                    src="/img/deploy-item-pattern.svg"
                                    className="pattern"
                                    alt=""
                                />
                                <span className="deploy-icon">
                                    <span
                                        style={{ transform: showStake ? "rotate(90deg)" : "rotate(0)" }}>
                                        <DeployIcon />
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div className="set-deploy-item">
                            <h5>Stake Solider</h5>
                            {!showStake ?
                                <div className="stepper">
                                    <div className="stepper-option">
                                        {DEPLOY_LEVEL.map((item, key) => (
                                            <button
                                                className={`btn-step ${item.value === level ? "hovered" : ""}`}
                                                onClick={() => handleShowStake(item.value, item.id)}
                                                onMouseEnter={() => handleLevel(item.value, item.id)}
                                                style={{ left: key * 72 }}
                                                key={key}
                                            >
                                                {item.value}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                :
                                <div className="stepper-action">
                                    <button
                                        className="btn-item-deploy"
                                        disabled={isStakeLoading}
                                        onClick={onStake}
                                    >
                                        {isStakeLoading ?
                                            <ClipLoader size={30} color="#fff" />
                                            :
                                            <>deploy</>
                                        }
                                    </button>
                                    <button
                                        className="btn-item-cancel"
                                        onClick={() => setShowStake(false)}
                                        disabled={isStakeLoading}
                                    >
                                        cancel
                                    </button>
                                </div>
                            }
                            <p className="option-dec">
                                {DEPLOY_LEVEL[levelId].title} = <span><HiveIcon /> {DEPLOY_LEVEL[levelId].option}</span>
                            </p>
                        </div>
                    </div>
                }
            </div >
        </ClickAwayListener>
    )
}
