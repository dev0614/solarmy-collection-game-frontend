import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ClipLoader from "react-spinners/ClipLoader";
import { ClickAwayListener, Skeleton } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { DAY_LENGTH, DEPLOY_LEVEL } from "../../config";
import { stakeNFT, withdrawNft } from "../../solana/transaction_staking";
import { DeployIcon, HiveIcon, MissionActiveIcon, MissionCompletedIcon, MissionReverseIcon } from "../svgIcons";
import { DeployDenseItemSkeleton, DeployItemSkeleton } from "../SkeletonComponents/DeploySkeletons";

export default function DeployItem(props: {
    status?: "reverse" | "active" | "complete",
    nftMint: string,
    uri: string,
    update: Function,
    stakedTime?: number,
    lockTime?: number
    duration?: number
}) {
    const router = useRouter();
    const { nftMint } = props;
    const wallet = useWallet();
    const [actionState, setActionState] = useState(false);
    const [level, setLevel] = useState(1);
    const [levelId, setLevelId] = useState(0);
    const [showStake, setShowStake] = useState(false);
    const [nftId, setNftId] = useState(1);
    const [image, setImage] = useState("");
    const [isStakeLoading, setIsStakeLoading] = useState(false);
    const [isDelistLoading, setIsDelistLoading] = useState(false);
    const [view, setView] = useState<any>("normal");
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        await fetch(props.uri)
            .then(resp =>
                resp.json()
            ).then((json) => {
                setNftId(json?.name.split("#")[1]);
                setImage(json.image)
            })
            .catch((error) => {
                console.log(error);
            })
        setLoading(false);
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

    const onDelist = async () => {
        if (!wallet.publicKey) return;
        try {
            await withdrawNft(wallet, new PublicKey(nftMint), () => setIsDelistLoading(true), () => setIsDelistLoading(false), () => props.update())
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getNftData();
        setView(router?.query?.view);
        // eslint-disable-next-line
    }, [router])
    return (
        <ClickAwayListener onClickAway={() => onOutClick()}>
            <>
                {
                    view !== "dense" ?
                        (
                            loading ?
                                <DeployItemSkeleton />
                                :

                                <div className="deploy-item" >
                                    {!actionState ?
                                        <div className="item-content">
                                            <div className="media">
                                                {image !== "" ?
                                                    // eslint-disable-next-line
                                                    <img
                                                        src={image}
                                                        alt=""
                                                    />
                                                    :
                                                    <Skeleton variant="rectangular" animation="wave" width={164} height={164} sx={{ borderRadius: "16px" }} />
                                                }
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
                                                                {props.duration && props.stakedTime &&
                                                                    <p>{props.duration < Math.floor((new Date().getTime() / 1000 - props.stakedTime) / DAY_LENGTH) ? props.duration : Math.floor((new Date().getTime() / 1000 - props.stakedTime) / DAY_LENGTH)}/{props.duration}</p>
                                                                }
                                                            </div>
                                                            <div className="processbar">
                                                                {props.duration && props.stakedTime &&
                                                                    <span
                                                                        className="process"
                                                                        style={{ width: `${((new Date().getTime() / 1000 - props.stakedTime) / DAY_LENGTH / props.duration * 100)}%` }}
                                                                    >
                                                                    </span>
                                                                }
                                                            </div>
                                                            <div className="bottom">
                                                                <h5>AMMO Rewards</h5>
                                                                <p>{DEPLOY_LEVEL.find((x) => x.value === props.duration)?.showOption}</p>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                                <div className="deploy-action-right">
                                                    {props.status === "active" &&
                                                        <button
                                                            className="btn-delist"
                                                            disabled={isDelistLoading}
                                                            onClick={onDelist}
                                                        >
                                                            {isDelistLoading ?
                                                                <ClipLoader size={30} color="#fff" />
                                                                :
                                                                <>delist</>
                                                            }
                                                        </button>
                                                    }
                                                    {props.status === "complete" &&
                                                        <button
                                                            className="btn-claim"
                                                            disabled={isDelistLoading}
                                                            onClick={onDelist}
                                                        >
                                                            {isDelistLoading ?
                                                                <ClipLoader size={30} color="#fff" />
                                                                :
                                                                <>claim</>
                                                            }
                                                        </button>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className="item-content">
                                            <div className="media">
                                                {image !== "" ?
                                                    // eslint-disable-next-line
                                                    <img
                                                        src={image}
                                                        alt=""
                                                    />
                                                    :
                                                    <Skeleton variant="rectangular" animation="wave" width={48} height={48} sx={{ borderRadius: "4.8px" }} />
                                                }
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
                                                <h5>Stake Soldier</h5>
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
                                </div>
                        )
                        :
                        (
                            loading ?
                                <DeployDenseItemSkeleton />
                                :

                                <div className="deploy-item-dense">
                                    <div className={actionState ? "deploy-dense-content active-item" : "deploy-dense-content"}>
                                        {!actionState ?
                                            <div className="content">
                                                {/* eslint-disable-next-line */}
                                                <img
                                                    src={image}
                                                    className="thumb"
                                                    alt=""
                                                />
                                                <p className="nft-id">#{nftId}</p>
                                                <div className="status-box">
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
                                                {(props.status === "active" || props.status === "complete") &&
                                                    <div className="deploy-active-view">
                                                        <div className="top">
                                                            <h4>Deployed days</h4>
                                                        </div>
                                                        <div className="processbar">
                                                            {props.duration && props.stakedTime &&
                                                                <span
                                                                    className="process"
                                                                    style={{ width: `${((new Date().getTime() / 1000 - props.stakedTime) / DAY_LENGTH / props.duration * 100)}%` }}
                                                                >
                                                                </span>
                                                            }
                                                        </div>
                                                        <div className="bottom">
                                                            {props.duration && props.stakedTime &&
                                                                <p className="days">{props.duration < Math.floor((new Date().getTime() / 1000 - props.stakedTime) / DAY_LENGTH) ? props.duration : Math.floor((new Date().getTime() / 1000 - props.stakedTime) / DAY_LENGTH)}/{props.duration}</p>
                                                            }
                                                            <h5>AMMO</h5>
                                                            <p>{DEPLOY_LEVEL.find((x) => x.value === props.duration)?.showOption}</p>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                            :
                                            <div className="content">
                                                <span className="deploy-icon">
                                                    <span
                                                        style={{ transform: showStake ? "rotate(90deg)" : "rotate(0)" }}>
                                                        <DeployIcon />
                                                    </span>
                                                </span>
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
                                                    <div className="dense-action-group">
                                                        <button
                                                            className="btn-item-deploy"
                                                            disabled={isStakeLoading}
                                                            onClick={onStake}
                                                        >
                                                            {isStakeLoading ?
                                                                <ClipLoader size={20} color="#fff" />
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
                                        }
                                        {!actionState ?
                                            <>
                                                {props.status === "active" &&
                                                    <button
                                                        className="btn btn-delist"
                                                        disabled={isDelistLoading}
                                                        onClick={onDelist}
                                                    >
                                                        {isDelistLoading ?
                                                            <ClipLoader size={20} color="#fff" />
                                                            :
                                                            <>delist</>
                                                        }
                                                    </button>
                                                }
                                                {props.status === "complete" &&
                                                    <button
                                                        className="btn btn-claim"
                                                        disabled={isDelistLoading}
                                                        onClick={onDelist}
                                                    >
                                                        {isDelistLoading ?
                                                            <ClipLoader size={20} color="#fff" />
                                                            :
                                                            <>claim</>
                                                        }
                                                    </button>
                                                }

                                                {props.status === "reverse" &&
                                                    <button className="btn btn-delist" onClick={() => setActionState(true)}>
                                                        deploy
                                                    </button>
                                                }
                                            </>
                                            :
                                            <p className="deny-name">Stake Soldier</p>
                                        }
                                    </div>
                                </div>
                        )
                }
            </>
        </ClickAwayListener >
    )
}
