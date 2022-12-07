/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { Dialog } from "@mui/material";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import EquipedTable from "../../components/Fusion/EquipedTable";
import { FusionMediaImage, FusionType } from "../../components/Fusion/FusionWidget";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { ApprovedCheck, ApprovedUnCheck, CircleCloseIcon, CircleCloseMdIcon, RoundCornerLeft, RoundCornerRight } from "../../components/svgIcons";
import { successAlert } from "../../components/toastGroup";
import { AttributeSetting, MainPage } from "../../components/Widget";
import { useUserContext } from "../../context/UserProvider";
import { getAttributeItemData, getAvailableInventory, makeNft, modifyInventory } from "../../solana/server";
import { fusion, getNftMetaData } from "../../solana/transaction_staking";
import { AbleFetchedItem, AttributeFetched, AttributeFilterTypes, AttributeItem, SelectedItemType } from "../../solana/types";
import { titleCamel, titleCase, titleLowerCase } from "../../solana/utils";

export default function FusionEdit(props: {
    startLoading: Function,
    closeLoading: Function,
    setLoadingLabel: any
}) {
    const { startLoading, closeLoading } = props;
    const { getUserData } = useUserContext();
    const router = useRouter();
    const [itemId, setItemId] = useState<number>(1);
    const wallet = useWallet();
    const anchorWallet = useAnchorWallet();
    const [equipedAttr, setEquipedAttr] = useState<any>();
    const [seeTab, setSeeTab] = useState("changes");
    const [selectedKind, setSelectedKind] = useState("head");
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
    const [confirmModal, setConfirmModal] = useState(false);

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

    // Page Status Loading
    const [fusionTxLoading, setFusionTxLoading] = useState(false);

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
        let promise: any = [];
        for (let item of attrs) {
            if (item.trait_type.toLocaleLowerCase() !== "shadow") {
                const attrType = titleCase(item.trait_type);
                const attr = titleCase(item.value);
                const data = getAttributeItemData(attrType, attr);
                if (item)
                    promise.push(data);
            }
        }
        const res = await Promise.all(promise);
        console.log(res, "===> res")
        setEquipedAttr(res);
        closeLoading();
    };

    const getAbleInventory = async () => {
        if (!wallet.publicKey) return;
        try {
            const data = await getAvailableInventory(wallet.publicKey?.toBase58());
            if (data.length !== 0) {
                setAbleInventoris(data)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAttribute = (attrName: any) => {
        setSelectedKind(titleCamel(attrName as string));
        const names = ableInventories?.filter((attr) => attr.attribute_type === attrName);

        setSelectAbled(names);
        console.log(names);
    };

    const handleRemoveSelected = (attr: string, attr_type: string) => {
        let selected: SelectedItemType[] = changesItems;
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].attribute === attr && selected[i].attribute_type === attr_type) {
                selected.splice(i, 1);
                console.log(selected, "==> selected")
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

    const onFusion = async () => {
        if (!wallet.publicKey || !router.query.fusionId || !router.query.mint) return;
        try {
            let id: string = router.query.fusionId as string;
            let head = equipedAttr?.filter((item: any) => item.attribute_type === "head")[0].attribute;
            let head_accessories = equipedAttr?.filter((item: any) => item.attribute_type === "head accessories")[0].attribute;
            let l_arm = equipedAttr?.filter((item: any) => item.attribute_type === "left arm")[0].attribute;
            let r_arm = equipedAttr?.filter((item: any) => item.attribute_type === "right arm")[0].attribute;
            let torso = equipedAttr?.filter((item: any) => item.attribute_type === "torso")[0].attribute;
            let legs = equipedAttr?.filter((item: any) => item.attribute_type === "legs")[0].attribute;
            let backgroundImage = equipedAttr?.filter((item: any) => item.attribute_type === "background")[0].attribute;

            if (changesItems?.filter((item: any) => item.attribute_type === "head").length > 0) {
                head = changesItems?.filter((item: any) => item.attribute_type === "head")[0].attribute;
            }
            if (changesItems?.filter((item: any) => item.attribute_type === "head accessories").length > 0) {
                head_accessories = changesItems?.filter((item: any) => item.attribute_type === "head accessories")[0].attribute;
            }
            if (changesItems?.filter((item: any) => item.attribute_type === "right arm").length > 0) {
                r_arm = changesItems?.filter((item: any) => item.attribute_type === "right arm")[0].attribute;
            }
            if (changesItems?.filter((item: any) => item.attribute_type === "left arm").length > 0) {
                l_arm = changesItems?.filter((item: any) => item.attribute_type === "left arm")[0].attribute;
            }
            if (changesItems?.filter((item: any) => item.attribute_type === "torso").length > 0) {
                torso = changesItems?.filter((item: any) => item.attribute_type === "torso")[0].attribute;
            }
            if (changesItems?.filter((item: any) => item.attribute_type === "legs").length > 0) {
                legs = changesItems?.filter((item: any) => item.attribute_type === "legs")[0].attribute;
            }
            if (changesItems?.filter((item: any) => item.attribute_type === "background").length > 0) {
                backgroundImage = changesItems?.filter((item: any) => item.attribute_type === "background")[0].attribute;
            }
            let changed: any = [];
            let post: any = [];
            for (let item of changesItems) {
                changed.push({
                    attribute_type: item.attribute_type,
                    attribute: item.attribute
                })
                let p_type = "";
                let p_attr = "";
                p_type = equipedAttr?.filter((post: any) => post.attribute_type === item.attribute_type)[0].attribute_type;
                p_attr = equipedAttr?.filter((post: any) => post.attribute_type === item.attribute_type)[0].attribute;
                post.push({
                    attribute_type: p_type,
                    attribute: p_attr
                })

            }
            // // Get new nft uri
            startLoading();
            // props.setLoadingLabel("Generation new NFT uri...")
            // const newUri = "https://solarmy-1.s3.amazonaws.com/16612733845591484";
            const newUri = await makeNft(
                wallet.publicKey?.toBase58(),
                id,
                head,
                head_accessories,
                l_arm,
                r_arm,
                torso,
                legs,
                backgroundImage
            );
            // Get fusion transaction id
            if (newUri) {
                let mint: string = router.query.mint as string;
                const fusionTx = await fusion(
                    anchorWallet,
                    new PublicKey(mint),
                    changesItems.length * 90,
                    newUri,
                    () => startLoading(),
                    () => closeLoading(),
                    () => console.log("Fetched Tx id")
                );
                startLoading();
                if (fusionTx) {
                    const modified = await modifyInventory(
                        wallet.publicKey.toBase58(),
                        fusionTx,
                        JSON.stringify(post),
                        JSON.stringify(changed)
                    )
                    if (modified) {
                        setChangesItems([]);
                        successAlert("Fusion completed successfully!");
                        getUserData();
                        router.push("/fusion");
                    }
                }
            }
            closeLoading();

        } catch (error) {
            console.log("make nft error: ", error);
            closeLoading();
        }
    }

    useEffect(() => {
        // if (equipedAttr && selectedKind === "head") {
        //     const item = equipedAttr?.find((item: any) => selectedKind === "head");
        //     setSelectedName(item);
        //     const names = ableInventories??.filter((attr) => attr.attribute_type === "head");
        //     setSelectAbled(names);
        // }
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
    }, [equipedAttr, JSON.stringify(changesItems)]);

    useEffect(() => {
        let cTotal = 0;
        if (equipedAttr && changesItems) {
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
    }, [equipedAttr, JSON.stringify(changesItems), forceRender])

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
                        backUrl: "/fusion"
                    }}
                />
            }
            <div className="fusion-edit-page">
                <div className="content">
                    <div className="attributes">
                        <div className="kind">
                            <h4>Type</h4>
                            {ableInventories &&
                                <FusionType
                                    ableInventories={ableInventories}
                                    selectedKind={selectedKind}
                                    handleAttribute={handleAttribute}
                                />
                            }
                        </div>
                        <div className="options">
                            <div className="option-header">
                                <h4>Name</h4>
                                {/* {attributeFilter &&
                                    <AttributeSetting
                                        attributeFilter={attributeFilter}
                                        setAttributeFilter={setAttributeFilter}
                                    />
                                } */}
                            </div>
                            <div className="option-list">
                                <ul>
                                    {selectedName &&
                                        <li className="option-item current">
                                            <h5 className="title">{selectedName?.attribute}</h5>
                                            <p className="points"><span className="common">{selectedName?.rarity}</span>{selectedName?.points} Equiped</p>
                                        </li>
                                    }
                                    {selectAbled && selectAbled.length !== 0 && selectAbled.map((item, key) => (
                                        selectedName?.attribute !== item.attribute &&
                                        <li
                                            className={`option-item ${changesItems?.filter((attr) => attr.attribute === item.attribute && attr.attribute_type === item.attribute_type).length === 1 ? "selected" : ""}`}
                                            key={key}
                                            onClick={() => handleNameSelect(item.attribute_type, item.attribute, item.points, item.rarity, item.url)}
                                        >
                                            <h5 className="title">{item.attribute}</h5>
                                            <p className="points">
                                                <span className="universal">{item.rarity}</span>
                                                &nbsp;{item.points}&nbsp;
                                                {changesItems?.filter((attr) => attr.attribute === item.attribute && attr.attribute_type === item.attribute_type).length === 1 &&
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
                                        <EquipedTable
                                            equipedAttr={equipedAttr}
                                        />
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
                        <div
                            className="total-ammo"
                            style={{
                                width:
                                    changesItems.length !== 0 ?
                                        "calc(100% - 280px)" :
                                        "100%"
                            }}
                        >
                            <h5>Total AMMO</h5>
                            <p>{changesItems.length * 90}</p>
                        </div>
                        {changesItems.length !== 0 &&
                            <div className="fuse-group">
                                <button className="cancel" onClick={() => setChangesItems([])}>
                                    cancel
                                </button>
                                <button className="fuse" onClick={() => onFusion()}>
                                    fuse
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <Menu />
            <FusionConfirmAlert opened={false} onClose={() => setConfirmModal(false)} />
        </MainPage >
    )
}

export const FusionConfirmAlert = (props: {
    opened: boolean,
    onClose: Function
}) => {
    const { opened, onClose } = props;
    const [approved, setApproved] = useState(false);
    const handleChange = (e: any) => {
        setApproved(!approved);
    }
    return (
        <Dialog
            open={opened}
            onClose={() => onClose()}
        >
            <div
                className="fusion-confirm"
            >
                <div className="head">
                    <h4>Fuse</h4>
                </div>
                <div className="content">
                    <p>By fusing new attributes onto your soldier, the current attributes will be discarded and replaced with the new attrbiute.</p>
                    <div className="confirm-checkbox">
                        <input
                            checked={approved}
                            type="checkbox"
                            id="fusion-approved"
                            onChange={handleChange}
                        />
                        <label htmlFor="fusion-approved">
                            {approved ?
                                <ApprovedCheck />
                                :
                                <ApprovedUnCheck />
                            }
                            <span>I understand this cannot be undone.</span>
                        </label>
                    </div>
                </div>
                <div className="confirm-control">
                    <button
                        className="btn-item-cancel"
                    >
                        cancel
                    </button>
                    <button
                        className="btn-item-fuse"
                    >
                        fuse now
                    </button>
                </div>
            </div>
        </Dialog>
    )
}
