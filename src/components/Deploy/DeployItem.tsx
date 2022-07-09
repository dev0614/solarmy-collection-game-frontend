import { ClickAwayListener } from "@mui/material";
import { useEffect, useState } from "react";
import { DEPLOY_LEVEL } from "../../config";
import { DeployIcon, HiveIcon, MissionActiveIcon, MissionCompletedIcon, MissionReverseIcon } from "../svgIcons";

export default function DeployItem(props: {
    id?: string | number,
    status?: "reverse" | "active" | "complete"
}) {
    const [actionState, setActionState] = useState(false);
    const [level, setLevel] = useState(1);
    const [levelId, setLevelId] = useState(0);
    const [showStake, setShowStake] = useState(false);

    const handleLevel = (level: number, id: number) => {
        setLevel(level);
        setLevelId(id)
    }

    const handleShowStake = (level: number, id: number) => {
        setLevel(level);
        setLevelId(id);
        setShowStake(true);
    }

    const onOutClick = () => {
        setShowStake(false);
        setActionState(false)
    }

    useEffect(() => {
        console.log(level)
    }, [level])
    return (

        <ClickAwayListener onClickAway={() => onOutClick()}>
            <div className="deploy-item" >
                {!actionState ?
                    <div className="item-content">
                        <div className="media">
                            {/* eslint-disable-next-line */}
                            <img
                                src="https://www.arweave.net/OD60d-CtASSWysjmYQqcCDkFPkbb1B6So_EWMEpxVdU?ext=png"
                                alt=""
                            />
                        </div>
                        <div className={`item-box ${props.status === "reverse" ? "no-right" : ""}`}>
                            <div className="content">
                                <div className="content-header">
                                    <p className="id">{props.id ? "#" + props.id : ""}</p>
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
                                src="https://www.arweave.net/OD60d-CtASSWysjmYQqcCDkFPkbb1B6So_EWMEpxVdU?ext=png"
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
                                    <button className="btn-item-deploy">deploy</button>
                                    <button className="btn-item-cancel" onClick={() => setShowStake(false)}>cancel</button>
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
