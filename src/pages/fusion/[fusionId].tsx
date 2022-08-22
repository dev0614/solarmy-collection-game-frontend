import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { FusionMediaImage, FusionType } from "../../components/Fusion/FusionWidget";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { CircleCloseIcon, CircleCloseMdIcon, RoundCornerLeft, RoundCornerRight } from "../../components/svgIcons";
import { AttributeSetting, MainPage } from "../../components/Widget";
import { getAttributeItemData, getAvailableInventory } from "../../solana/server";
import { getNftMetaData } from "../../solana/transaction_staking";
import { AbleFetchedItem, AttributeFetched, AttributeFilterTypes, AttributeItem } from "../../solana/types";
import { titleCamel, titleCase, titleLowerCase } from "../../solana/utils";

interface SelectedItemType {
    attribute: string,
    attribute_type: string,
    points: string,
    rarity: string,
    url: string,
}

export default function FusionEdit(props: {
    startLoading: Function,
    closeLoading: Function
}) {
    const { startLoading, closeLoading } = props;
    const router = useRouter();
    const [itemId, setItemId] = useState<number>(1);
    const wallet = useWallet();
    const [equipedAttr, setEquipedAttr] = useState<any>();
    const [seeTab, setSeeTab] = useState("changes");
    const [selectedKind, setSelectedKind] = useState('head');
    const [selectedName, setSelectedName] = useState<AttributeFetched>();
    const [attributeFilter, setAttributeFilter] = useState<AttributeFilterTypes>({
        common: false,
        universal: false,
        rare: false,
        first_class: false,
        transendental: false
    });
    const [selectAbled, setSelectAbled] = useState<AbleFetchedItem[]>();
    const [ableInventories, setAbleInventoris] = useState<AbleFetchedItem[]>();
    const [changesItems, setChangesItems] = useState<{
        attribute: string,
        attribute_type: string,
        points: string,
        rarity: string,
        url: string,
    }[]>([]);
    const [forceRender, setForceRender] = useState(false);

    const [equipedTotal, setEquipedTotal] = useState(0);
    const [changedTotal, setChangedTotal] = useState(0);

    // NFT image group with attribute
    const [headImage, setHeadImage] = useState("");
    const [headAccessoriesImage, setHeadAccessoriesImage] = useState("");
    const [torsoImage, setTorsoImage] = useState("");
    const [leftArmImage, setLeftArmImage] = useState("");
    const [rightArmImage, setRighttArmImage] = useState("");
    const [legsImage, setLegsImage] = useState("");
    const [backgroundImage, setBackgroundImage] = useState("");

    const getNftData = async (mint: string) => {
        startLoading();
        const uri = await getNftMetaData(new PublicKey(mint));
        await fetch(uri)
            .then(resp =>
                resp.json()
            ).then((json) => {
                setEquipedAttributes(json.attributes);
            })
            .catch((error) => {
                closeLoading();
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
        closeLoading();
    };

    const getAbleInventory = async () => {
        if (!wallet.publicKey) return;
        let inventories: any[];

        try {
            const data = await getAvailableInventory(wallet.publicKey?.toBase58());
            if (data.length !== 0) {
                setAbleInventoris(data)
                console.log(data)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAttribute = (e: any) => {
        const attr = e.target.innerText;
        setSelectedKind(titleCamel(attr as string));
        let attrName = '';
        if (attr === 'L Arm') {
            attrName = 'left arm';
        } else if (attr === 'R Arm') {
            attrName = 'right arm';
        } else if (attr === 'Head' && attr !== "Head Accessories") {
            attrName = 'head';
        } else {
            attrName = titleLowerCase(attr);
        }
        const item = equipedAttr?.find((item: any) => item.attribute_type === attrName);
        const names = ableInventories?.filter((attr) => attr.attribute_type === attrName);
        setSelectAbled(names)
        setSelectedName(item);
        // eslint-disable-next-line
    };

    const handleRemoveSelected = (attr: string, attr_type: string) => {
        let selected: SelectedItemType[] = changesItems;
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].attribute === attr && selected[i].attribute_type === attr_type) {
                selected.splice(i, 1);
                setChangesItems(selected);
                setForceRender(!forceRender);
            }
        }
    }

    const handleNameSelect = (attribute_type: string, attribute: string, points: string, rarity: string, url: string) => {
        let selected: SelectedItemType[] = changesItems;
        const current = selected?.filter((attr) => attr.attribute_type === attribute_type);
        if (current.length === 0) {
            selected.push({
                attribute: attribute,
                attribute_type: attribute_type,
                points: points,
                rarity: rarity,
                url: url,
            })
        } else if (current.length === 1) {
            handleRemoveSelected(current[0].attribute, current[0].attribute_type);
            selected.push({
                attribute: attribute,
                attribute_type: attribute_type,
                points: points,
                rarity: rarity,
                url: url,
            })
        }
        setChangesItems(selected);
        setForceRender(!forceRender);
    };

    useEffect(() => {
        if (equipedAttr && selectedKind === "head") {
            const item = equipedAttr?.find((item: any) => selectedKind === 'head');
            setSelectedName(item);
            const names = ableInventories?.filter((attr) => attr.attribute_type === 'head');
            setSelectAbled(names);
        }
        const eTotal = equipedAttr?.reduce((attr: any, { points }: any) => attr + parseFloat(points), 0);
        setEquipedTotal(eTotal);
        if (equipedAttr) {
            for (let item of equipedAttr) {
                switch (item.attribute_type) {
                    case "right arm":
                        setRighttArmImage(item.url);
                        break;
                    case "head":
                        setHeadImage(item.url);
                        break;
                    case "head accessories":
                        setHeadAccessoriesImage(item.url);
                        break;
                    case "left arm":
                        setLeftArmImage(item.url);
                        break;
                    case "torso":
                        setTorsoImage(item.url);
                        break;
                    case "legs":
                        setLegsImage(item.url);
                        break;
                    case "background":
                        setBackgroundImage(item.url);
                        break;
                    default:
                        break;
                }
            }
        }
        // eslint-disable-next-line
    }, [equipedAttr, selectedKind]);

    useEffect(() => {
        let cTotal = 0;
        if (equipedAttr) {
            for (let item of equipedAttr) {
                const filtered = changesItems?.filter((attr: any) => attr.attribute_type === item.attribute_type);
                if (filtered.length !== 0) {
                    cTotal += parseFloat(filtered[0].points);
                    switch (filtered[0].attribute_type) {
                        case "right arm":
                            setRighttArmImage(filtered[0].url);
                            break;
                        case "head":
                            setHeadImage(filtered[0].url);
                            break;
                        case "head accessories":
                            setHeadAccessoriesImage(filtered[0].url);
                            break;
                        case "left arm":
                            setLeftArmImage(filtered[0].url);
                            break;
                        case "torso":
                            setTorsoImage(filtered[0].url);
                            break;
                        case "legs":
                            setLegsImage(filtered[0].url);
                            break;
                        case "background":
                            setBackgroundImage(filtered[0].url);
                            break;
                        default:
                            break;
                    }
                } else {
                    cTotal += parseFloat(item.points)
                }
            }
        }
        setChangedTotal(cTotal);
        // eslint-disable-next-line
    }, [equipedAttr, JSON.stringify(changesItems)])

    useEffect(() => {
        startLoading();
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
                            <FusionType
                                selectedKind={selectedKind}
                                handleAttribute={handleAttribute}
                            />
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
                                        <h5 className="title">{selectedName?.attribute}</h5>
                                        <p className="points"><span className="common">{selectedName?.rarity}</span>{selectedName?.points} Equiped</p>
                                    </li>

                                    {selectAbled && selectAbled.length !== 0 && selectAbled.map((item, key) => (
                                        <li
                                            className={`option-item ${changesItems.filter((attr) => attr.attribute === item.attribute && attr.attribute_type === item.attribute_type).length === 1 ? "selected" : ""}`}
                                            key={key}
                                            onClick={() => handleNameSelect(item.attribute_type, item.attribute, item.points, item.rarity, item.url)}
                                        >
                                            <h5 className="title">{item.attribute}</h5>
                                            <p className="points">
                                                <span className="universal">{item.rarity}</span>
                                                &nbsp;{item.points}&nbsp;
                                                {changesItems.filter((attr) => attr.attribute === item.attribute && attr.attribute_type === item.attribute_type).length === 1 &&
                                                    <span className="selected-dot"></span>
                                                }
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="fusion-edit-card box-shadow">
                        <div className="media">
                            <FusionMediaImage
                                headImage={headImage}
                                headAccessoriesImage={headAccessoriesImage}
                                torsoImage={torsoImage}
                                leftArmImage={leftArmImage}
                                rightArmImage={rightArmImage}
                                legsImage={legsImage}
                                backgroundImage={backgroundImage}
                            />
                            <div className="fusion-see-detail">
                                <div className="header-tabs">
                                    <div className={seeTab === "changes" ? "tab active" : "tab"} onClick={() => setSeeTab("changes")}>changes</div>
                                    <div className={seeTab === "equiped" ? "tab active" : "tab"} onClick={() => setSeeTab("equiped")}>equiped</div>
                                </div>
                                {seeTab === "changes" &&
                                    <>
                                        <div className="header-points">
                                            <h2>Points</h2>
                                            <div className="">
                                                <h3 className={`${(changedTotal - equipedTotal) > 0 ? "inc-title" : "dec-title"} ${(changedTotal - equipedTotal) === 0 ? "normal-title" : ""}`}>
                                                    {changedTotal.toLocaleString()}
                                                </h3>
                                                <p>
                                                    {
                                                        (changedTotal - equipedTotal) > 0 ? "+" : ""
                                                    }
                                                    {(changedTotal - equipedTotal).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="attr-table changes">
                                            <div className="thead">
                                                <div className="tr changes">
                                                    <div className="th">Equiped</div>
                                                    <div className="th">New</div>
                                                    <div className="th">Points</div>
                                                </div>
                                            </div>
                                            <div className="tbody">
                                                {changesItems.length !== 0 && changesItems.map((item: SelectedItemType, key) => (
                                                    <div className="tr" key={key}>
                                                        <div
                                                            className={`tr-content ${(parseFloat(item.points) - parseFloat(equipedAttr?.find((attr: any) => attr.attribute_type === item.attribute_type)?.points)) > 0 ? "inc" : "dec"}`}
                                                        >
                                                            <div className="td">{equipedAttr?.find((attr: any) => attr.attribute_type === item.attribute_type)?.attribute}</div>
                                                            <div className="td">{item.attribute}</div>
                                                            <div className="td">
                                                                {(parseFloat(item.points) - parseFloat(equipedAttr?.find((attr: any) => attr.attribute_type === item.attribute_type)?.points)).toLocaleString()}
                                                            </div>
                                                        </div>
                                                        <button className="close" onClick={() => handleRemoveSelected(item.attribute, item.attribute_type)}>
                                                            <CircleCloseMdIcon />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                }
                                {seeTab === "equiped" &&
                                    <>
                                        <div className="header-points">
                                            <h2>Points</h2>
                                            <div className="">
                                                <h3>{equipedTotal}</h3>
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
                                                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "head")?.attribute}</div>
                                                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "head")?.points}</div>
                                                </div>
                                                <div className="tr">
                                                    <div className="td">Head Accessories</div>
                                                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "head accessories")?.attribute}</div>
                                                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "head accessories")?.points}</div>
                                                </div>
                                                <div className="tr">
                                                    <div className="td">L Arm</div>
                                                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "left arm")?.attribute}</div>
                                                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "left arm")?.points}</div>
                                                </div>
                                                <div className="tr">
                                                    <div className="td">R Arm</div>
                                                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "right arm")?.attribute}</div>
                                                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "right arm")?.points}</div>
                                                </div>
                                                <div className="tr">
                                                    <div className="td">Torso</div>
                                                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "torso")?.attribute}</div>
                                                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "torso")?.points}</div>
                                                </div>
                                                <div className="tr">
                                                    <div className="td">Legs</div>
                                                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "legs")?.attribute}</div>
                                                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "legs")?.points}</div>
                                                </div>
                                                <div className="tr">
                                                    <div className="td">Background</div>
                                                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "background")?.attribute}</div>
                                                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "background")?.points}</div>
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
                            {changesItems.length !== 0 && changesItems.map((item: SelectedItemType, key) => (
                                <li className="option-tab-item" key={key} onClick={() => handleRemoveSelected(item.attribute, item.attribute_type)}>
                                    <label>{item.attribute}</label>
                                    <button>
                                        <CircleCloseIcon />
                                    </button>
                                </li>
                            ))}
                            {changesItems.length !== 0 &&
                                <li
                                    className="option-tab-item"
                                    style={{ background: "transparent" }}
                                    onClick={() => setChangesItems([])}
                                >
                                    <button className="btn-noborder">clear all</button>
                                </li>
                            }
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
