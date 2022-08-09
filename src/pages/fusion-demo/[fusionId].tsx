import { PublicKey } from '@solana/web3.js';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Menu from '../../components/Menu';
import { RoundCornerLeft, RoundCornerRight } from '../../components/svgIcons';
import { AttributeSetting, MainPage } from '../../components/Widget';
import { getNftMetaData } from '../../solana/transaction_staking';
import { AttributeFilterTypes, AttributeItem, AttributeTypes } from '../../solana/types';

export default function FusionEdit() {
    const router = useRouter();
    const { query } = router;
    const [itemId, setItemId] = useState<number>(1);
    const [image, setImage] = useState('');
    const [beforeAttr, setBeforeAttr] = useState<AttributeItem[]>();
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
                console.log(json)
                setImage(json.image)
                setBeforeAttr(json.attributes)
            })
            .catch((error) => {
                console.log(error);
            })
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
                                <li className=''>Head</li>
                                {/* <li className='selected activated'>Head</li> */}
                                <li>Head Accessories</li>
                                <li>Torse</li>
                                <li>L Arm</li>
                                <li>R Arm</li>
                                <li>Legs</li>
                                <li>Background</li>
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
                                src='/img/attributes/forest.png'
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
                                src='/img/attributes/alien wings.png'
                                alt=''
                            />
                            {/* === Left Arm === */}
                            {/* eslint-disable-next-line */}
                            <img
                                src='/img/attributes/robot honour.png'
                                alt=''
                            />
                            {/* eslint-disable-next-line */}
                            <img
                                src='/img/attributes/alien chain.png'
                                alt=''
                            />
                            {/* eslint-disable-next-line */}
                            <img
                                src='/img/attributes/plant down.png'
                                alt=''
                            />
                            {/* eslint-disable-next-line */}
                            <img
                                src='/img/attributes/soldier helmet.png'
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
            </div>
            <Menu />
        </MainPage>
    )
}
