import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { CircleCloseIcon, CircleCloseMdIcon, RoundCornerLeft, RoundCornerRight } from "../../components/svgIcons";
import { AttributeSetting, MainPage } from "../../components/Widget";
import { getAttributeItemData, getAvailableInventory } from "../../solana/server";
import { getNftMetaData } from "../../solana/transaction_staking";
import { AttributeFetched, AttributeFilterTypes, AttributeItem, NftAttrsTypes } from "../../solana/types";
import { titleCamel, titleCase } from "../../solana/utils";

export default function FusionEdit() {
    const router = useRouter();
    const { query } = router;
    const [itemId, setItemId] = useState<number>(1);
    const wallet = useWallet();
    const [equipedAttr, setEquipedAttr] = useState<any>();
    const [seeTab, setSeeTab] = useState("changes");
    const [selectedKind, setSelectedKind] = useState('head');
    const [attributeFilter, setAttributeFilter] = useState<AttributeFilterTypes>({
        common: false,
        universal: false,
        rare: false,
        first_class: false,
        transendental: false
    });

    const getNftData = async (mint: string) => {
        const uri = await getNftMetaData(new PublicKey(mint));
        await fetch(uri)
            .then(resp =>
                resp.json()
            ).then((json) => {
                setEquipedAttributes(json.attributes);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const setEquipedAttributes = async (attrs: AttributeItem[]) => {
        let promise = [];
        for (let item of attrs) {
            const attrType = titleCase(item.trait_type);
            const attr = titleCase(item.value);
            const data = getAttributeItemData(attrType, attr);
            if (item)
                promise.push(data);
        }
        const res = await Promise.all(promise);
        setEquipedAttr(res);
    };

    const getAbleInventory = async () => {
        if (!wallet.publicKey) return;
        try {
            const data = await getAvailableInventory(wallet.publicKey?.toBase58());
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    };

    const handleAttribute = useCallback(async (e: any) => {
        const attr = e.target.innerText;
        setSelectedKind(titleCamel(attr as string));
        // eslint-disable-next-line
    }, [equipedAttr]);

    const setNameSpace = () => {

    }

    useEffect(() => {
        console.log(equipedAttr)
        // eslint-disable-next-line
    }, [selectedKind])

    useEffect(() => {
        if (router.query.fusionId) {
            setItemId(parseInt(router.query.fusionId as string));
            getAbleInventory()
        }
        if (router.query.mint) {
            getNftData(router.query.mint as string)
            // FIND
        }
        // eslint-disable-next-line
    }, [router, wallet.connected]);

    return (
        <MainPage>
            {router?.query?.fusionId &&
                <Header
                    back={{
                        title: `Fusion NFT #${itemId < 10 ? "0" + router.query?.fusionId : router.query?.fusionId}`,
                        backUrl: "/fusion-demo"
                    }}
                />
            }
            <div className="fusion-edit-page">
                <div className="content">
                    <div className="attributes">
                        <div className="kind">
                            <h4>Type</h4>
                            <ul>
                                <li
                                    className={`${selectedKind === "head" ? "selected" : ""}`}
                                    onClick={handleAttribute}
                                >
                                    Head
                                </li>
                                {/* <li className="selected activated">Head</li> */}
                                <li
                                    className={`${selectedKind === "head_accessories" ? "selected" : ""}`}
                                    onClick={handleAttribute}
                                >
                                    Head Accessories
                                </li>
                                <li
                                    className={`${selectedKind === "torse" ? "selected" : ""}`}
                                    onClick={handleAttribute}
                                >
                                    Torse
                                </li>
                                <li
                                    className={`${selectedKind === "l_arm" ? "selected" : ""}`}
                                    onClick={handleAttribute}
                                >
                                    L Arm
                                </li>
                                <li
                                    className={`${selectedKind === "r_arm" ? "selected" : ""}`}
                                    onClick={handleAttribute}
                                >
                                    R Arm
                                </li>
                                <li
                                    className={`${selectedKind === "legs" ? "selected" : ""}`}
                                    onClick={handleAttribute}
                                >
                                    Legs
                                </li>
                                <li
                                    className={`${selectedKind === "background" ? "selected" : ""}`}
                                    onClick={handleAttribute}
                                >
                                    Background
                                </li>
                            </ul>
                        </div>
                        <div className="options">
                            <div className="option-header">
                                <h4>Name</h4>
                                {attributeFilter &&
                                    <AttributeSetting
                                        attributeFilter={attributeFilter}
                                        setAttributeFilter={setAttributeFilter}
                                    />
                                }
                            </div>
                            <div className="option-list">
                                <ul>
                                    <li className="option-item current">
                                        <h5 className="title">Robot orglass</h5>
                                        <p className="points"><span className="common">common</span>300 Equiped</p>
                                    </li>
                                    <li className="option-item selected">
                                        <h5 className="title">Robot orglass</h5>
                                        <p className="points"><span className="universal">universal</span>300 <span className="selected-dot"></span></p>
                                    </li>
                                    <li className="option-item">
                                        <h5 className="title">Robot orglass</h5>
                                        <p className="points"><span className="rare">rare</span>300</p>
                                    </li>
                                    <li className="option-item">
                                        <h5 className="title">Robot orglass</h5>
                                        <p className="points"><span className="first_class">1st class</span>300</p>
                                    </li>
                                    <li className="option-item">
                                        <h5 className="title">Robot orglass</h5>
                                        <p className="points"><span className="transendental">transendental</span>300</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="fusion-edit-card box-shadow">
                        <div className="media">
                            <div className="merged-image" style={{ display: "none" }}>
                                {/* === Background === */}
                                {/* eslint-disable-next-line */}
                                <img
                                    src={"/img/attributes/forest.png"}
                                    // src={equipedAttr?.background.URL}
                                    alt=""
                                />
                                {/* === Shadow === */}
                                {/* eslint-disable-next-line */}
                                <img
                                    src="/img/attributes/shadow.png"
                                    alt=""
                                />
                                {/* === Legs === */}
                                {/* eslint-disable-next-line */}
                                <img
                                    src={"/img/attributes/alien wings.png"}
                                    // src={equipedAttr?.legs.URL}
                                    alt=""
                                />
                                {/* === Left Arm === */}
                                {/* eslint-disable-next-line */}
                                <img
                                    src={"/img/attributes/robot honour.png"}
                                    // src={equipedAttr?.left_arm.URL}
                                    alt=""
                                />
                                {/* eslint-disable-next-line */}
                                <img
                                    src={"/img/attributes/alien chain.png"}
                                    // src={equipedAttr?.torse.URL}
                                    alt=""
                                />
                                {/* eslint-disable-next-line */}
                                <img
                                    src={"/img/attributes/plant down.png"}
                                    // src={equipedAttr?.right_arm.URL}
                                    alt=""
                                />
                                {/* eslint-disable-next-line */}
                                <img
                                    src={"/img/attributes/soldier helmet.png"}
                                    // src={equipedAttr?.head.URL}
                                    alt=""
                                />
                            </div>
                            <div className="fusion-see-detail" style={{ display: "block" }}>
                                <div className="header-tabs">
                                    <div className={seeTab === "changes" ? "tab active" : "tab"} onClick={() => setSeeTab("changes")}>changes</div>
                                    <div className={seeTab === "equiped" ? "tab active" : "tab"} onClick={() => setSeeTab("equiped")}>equiped</div>
                                </div>
                                {seeTab === "changes" &&
                                    <>
                                        <div className="header-points">
                                            <h2>Points</h2>
                                            <div className="">
                                                <h3>1500</h3>
                                                <p>+500</p>
                                            </div>
                                        </div>
                                        <div className="attr-table changes">
                                            <div className="thead">
                                                <div className="tr">
                                                    <div className="th">Equiped</div>
                                                    <div className="th">New</div>
                                                    <div className="th">Points</div>
                                                </div>
                                            </div>
                                            <div className="tbody">
                                                <div className="tr">
                                                    <div className="tr-content inc">
                                                        <div className="td">BoneWolrd</div>
                                                        <div className="td">Alien Jason Mask</div>
                                                        <div className="td">-100</div>
                                                    </div>
                                                    <button className="close">
                                                        <CircleCloseMdIcon />
                                                    </button>
                                                </div>
                                                <div className="tr">
                                                    <div className="tr-content dec">
                                                        <div className="td">BoneWolrd</div>
                                                        <div className="td">Alien Jason Mask</div>
                                                        <div className="td">-100</div>
                                                    </div>
                                                    <button className="close">
                                                        <CircleCloseMdIcon />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }
                                {seeTab === "equiped" &&
                                    <>
                                        <div className="header-points">
                                            <h2>Points</h2>
                                            <div className="">
                                                <h3>{equipedAttr?.reduce((attr: any, { Points }: any) => attr + parseFloat(Points), 0)}</h3>
                                            </div>
                                        </div>
                                        <div className="attr-table">
                                            <div className="thead">
                                                <div className="tr">
                                                    <div className="th">Attribute</div>
                                                    <div className="th">Name</div>
                                                    <div className="th">Rarity &#38; Points</div>
                                                </div>
                                            </div>
                                            <div className="tbody">
                                                <div className="tr">
                                                    <div className="td">Head</div>
                                                    <div className="td">{equipedAttr?.find((element: any) => element.Atribute_Type === "Head")?.Atribute}</div>
                                                    <div className="td">{equipedAttr?.find((element: any) => element.Atribute_Type === "Head")?.Points}</div>
                                                </div>
                                                <div className="tr">
                                                    <div className="td">Head Accessories</div>
                                                    <div className="td">{equipedAttr?.find((element: any) => element.Atribute_Type === "Head Accessories")?.Atribute}</div>
                                                    <div className="td">{equipedAttr?.find((element: any) => element.Atribute_Type === "Head Accessories")?.Points}</div>
                                                </div>
                                                <div className="tr">
                                                    <div className="td">L Arm</div>
                                                    <div className="td">{equipedAttr?.find((element: any) => element.Atribute_Type === "Left Arm")?.Atribute}</div>
                                                    <div className="td">{equipedAttr?.find((element: any) => element.Atribute_Type === "Left Arm")?.Points}</div>
                                                </div>
                                                <div className="tr">
                                                    <div className="td">R Arm</div>
                                                    <div className="td">{equipedAttr?.find((element: any) => element.Atribute_Type === "Right Arm")?.Atribute}</div>
                                                    <div className="td">{equipedAttr?.find((element: any) => element.Atribute_Type === "Right Arm")?.Points}</div>
                                                </div>
                                                <div className="tr">
                                                    <div className="td">Torso</div>
                                                    <div className="td">{equipedAttr?.find((element: any) => element.Atribute_Type === "Torso")?.Atribute}</div>
                                                    <div className="td">{equipedAttr?.find((element: any) => element.Atribute_Type === "Torso")?.Points}</div>
                                                </div>
                                                <div className="tr">
                                                    <div className="td">Legs</div>
                                                    <div className="td">{equipedAttr?.find((element: any) => element.Atribute_Type === "Legs")?.Atribute}</div>
                                                    <div className="td">{equipedAttr?.find((element: any) => element.Atribute_Type === "Legs")?.Points}</div>
                                                </div>
                                                <div className="tr">
                                                    <div className="td">Background</div>
                                                    <div className="td">{equipedAttr?.find((element: any) => element.Atribute_Type === "Background")?.Atribute}</div>
                                                    <div className="td">{equipedAttr?.find((element: any) => element.Atribute_Type === "Background")?.Points}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        <button className="see-points">
                            <RoundCornerLeft />
                            <span>See points</span>
                            <RoundCornerRight />
                        </button>
                    </div>
                </div>
                <div className="fusion-controls">
                    <div className="tabs-set">
                        <ul>
                            <li className="option-tab-item">
                                <label>Robot Orglass</label>
                                <button>
                                    <CircleCloseIcon />
                                </button>
                            </li>
                            <li className="option-tab-item">
                                <label>Orglass</label>
                                <button>
                                    <CircleCloseIcon />
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="fusion-fuse">
                        <div className="total-ammo" style={{ width: "calc(100% - 280px)" }}>
                            <h5>Total AMMO</h5>
                            <p>90</p>
                        </div>
                        <div className="fuse-group">
                            <button className="cancel">
                                cancel
                            </button>
                            <button className="fuse">
                                fuse
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Menu />
        </MainPage >
    )
}
