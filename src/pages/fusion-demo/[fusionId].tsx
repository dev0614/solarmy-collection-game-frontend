import { PublicKey } from '@solana/web3.js';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Menu from '../../components/Menu';
import { CircleCloseIcon, RoundCornerLeft, RoundCornerRight } from '../../components/svgIcons';
import { AttributeSetting, MainPage } from '../../components/Widget';
import { getAttributeItemData } from '../../solana/server';
import { getNftMetaData } from '../../solana/transaction_staking';
import { AttributeFetched, AttributeFilterTypes, AttributeItem, NftAttrsTypes } from '../../solana/types';
import { titleCamel, titleCase } from '../../solana/utils';

export default function FusionEdit() {
    const router = useRouter();
    const { query } = router;
    const [itemId, setItemId] = useState<number>(1);
    const [image, setImage] = useState('');
    const [beforeAttr, setBeforeAttr] = useState<NftAttrsTypes>();
    const [showSetting, setShowSetting] = useState(false);
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
                setImage(json.image);
                setBeforeAttributes(json.attributes);
            })
            .catch((error) => {
                console.log(error);
            })
        await getAttributeItemData('Right Arm', 'Alien Down');
    }

    const setBeforeAttributes = async (attrs: AttributeItem[]) => {
        let promise = [];
        let attrValues: any;
        for (let item of attrs) {
            const attrType = titleCase(item.trait_type);
            const attr = titleCase(item.value);
            const data = getAttributeItemData(attrType, attr);
            if (item)
                promise.push(data);
        }
        const res = await Promise.all(promise);
        for (let item of res) {
            // switch (item?.Atribute_Type)
            //     attrValues[titleCamel(item['Atribute_Type'])] = item;
            if (item)
                switch (item['Atribute_Type']) {
                    case 'head':
                        attrValues.head = item as AttributeFetched
                        break;
                    case 'head_accessories':
                        attrValues.head_accessories = item as AttributeFetched;
                    case 'right_arm':
                        attrValues.right_arm = item as AttributeFetched;
                    case 'left_arm':
                        attrValues.left_arm = item as AttributeFetched;
                    case 'torse':
                        attrValues.torse = item as AttributeFetched;
                    case 'legs':
                        attrValues.legs = item as AttributeFetched;
                    case 'background':
                        attrValues.background = item as AttributeFetched;
                }
        }
        if (attrValues) {
            setBeforeAttr(attrValues);
        }
    }

    const handleAttribute = (attr: string) => {
        switch (attr) {
            case 'head':

                break;

            default:
                break;
        }
    }

    useEffect(() => {
        if (router.query.fusionId) {
            setItemId(parseInt(router.query.fusionId as string))
        }
        if (router.query.mint) {
            getNftData(router.query.mint as string)
        }
    }, [router])
    return (
        <MainPage>
            {router?.query?.fusionId &&
                <Header
                    back={{
                        title: `Fusion NFT #${itemId < 10 ? '0' + router.query?.fusionId : router.query?.fusionId}`,
                        backUrl: '/fusion-demo'
                    }}
                />
            }
            <div className='fusion-edit-page'>
                <div className='content'>
                    <div className='attributes'>
                        <div className='kind'>
                            <h4>Type</h4>
                            <ul>
                                <li
                                    className=''
                                    onClick={() => handleAttribute('head')}
                                >
                                    Head
                                </li>
                                {/* <li className='selected activated'>Head</li> */}
                                <li onClick={() => handleAttribute('head_accessories')}>
                                    Head Accessories
                                </li>
                                <li onClick={() => handleAttribute('torse')}>
                                    Torse
                                </li>
                                <li onClick={() => handleAttribute('l_arm')}>
                                    L Arm
                                </li>
                                <li onClick={() => handleAttribute('r_arm')}>
                                    R Arm
                                </li>
                                <li onClick={() => handleAttribute('legs')}>
                                    Legs
                                </li>
                                <li onClick={() => handleAttribute('background')}>
                                    Background
                                </li>
                            </ul>
                        </div>
                        <div className='options'>
                            <div className='option-header'>
                                <h4>Name</h4>
                                {attributeFilter &&
                                    <AttributeSetting
                                        attributeFilter={attributeFilter}
                                        setAttributeFilter={setAttributeFilter}
                                    />
                                }
                            </div>
                            <div className='option-list'>
                                <ul>
                                    <li className='option-item current'>
                                        <h5 className='title'>Robot orglass</h5>
                                        <p className='points'><span className='common'>common</span>300 Equiped</p>
                                    </li>
                                    <li className='option-item selected'>
                                        <h5 className='title'>Robot orglass</h5>
                                        <p className='points'><span className='universal'>universal</span>300 <span className='selected-dot'></span></p>
                                    </li>
                                    <li className='option-item'>
                                        <h5 className='title'>Robot orglass</h5>
                                        <p className='points'><span className='rare'>rare</span>300</p>
                                    </li>
                                    <li className='option-item'>
                                        <h5 className='title'>Robot orglass</h5>
                                        <p className='points'><span className='first_class'>1st class</span>300</p>
                                    </li>
                                    <li className='option-item'>
                                        <h5 className='title'>Robot orglass</h5>
                                        <p className='points'><span className='transendental'>transendental</span>300</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='fusion-edit-card box-shadow'>
                        <div className='media'>
                            {/* === Background === */}
                            {/* eslint-disable-next-line */}
                            <img
                                src={beforeAttr?.background.URL}
                                alt=''
                            />
                            {/* === Shadow === */}
                            {/* eslint-disable-next-line */}
                            <img
                                src='/img/attributes/shadow.png'
                                alt=''
                            />
                            {/* === Legs === */}
                            {/* eslint-disable-next-line */}
                            <img
                                src={beforeAttr?.legs.URL}
                                alt=''
                            />
                            {/* === Left Arm === */}
                            {/* eslint-disable-next-line */}
                            <img
                                src={beforeAttr?.left_arm.URL}
                                alt=''
                            />
                            {/* eslint-disable-next-line */}
                            <img
                                src={beforeAttr?.torse.URL}
                                alt=''
                            />
                            {/* eslint-disable-next-line */}
                            <img
                                src={beforeAttr?.right_arm.URL}
                                alt=''
                            />
                            {/* eslint-disable-next-line */}
                            <img
                                src={beforeAttr?.head.URL}
                                alt=''
                            />
                        </div>
                        <button className='see-points'>
                            <RoundCornerLeft />
                            <span>See points</span>
                            <RoundCornerRight />
                        </button>
                    </div>
                </div>
                <div className='fusion-controls'>
                    <div className='tabs-set'>
                        <ul>
                            <li className='option-tab-item'>
                                <label>Robot Orglass</label>
                                <button>
                                    <CircleCloseIcon />
                                </button>
                            </li>
                            <li className='option-tab-item'>
                                <label>Orglass</label>
                                <button>
                                    <CircleCloseIcon />
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className='fusion-fuse'>
                        <div className='total-ammo' style={{ width: 'calc(100% - 280px)' }}>
                            <h5>Total AMMO</h5>
                            <p>90</p>
                        </div>
                        <div className='fuse-group'>
                            <button className='cancel'>
                                cancel
                            </button>
                            <button className='fuse'>
                                fuse
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Menu />
        </MainPage>
    )
}
