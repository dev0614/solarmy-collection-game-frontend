import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Menu from '../../components/Menu';
import { RoundCornerLeft, RoundCornerRight } from '../../components/svgIcons';
import { AttributeSetting, MainPage } from '../../components/Widget';

export default function FusionEdit() {
    const router = useRouter();
    const [itemId, setItemId] = useState<any>(0);
    useEffect(() => {
        if (router.query.fusionId)
            setItemId(router.query.fusionId)
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
                                <li className='selected activated'>Head</li>
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
                                <AttributeSetting />
                            </div>
                        </div>
                    </div>
                    <div className='fusion-edit-card box-shadow'>
                        <div className='media'>
                            {/* eslint-disable-next-line */}
                            <img
                                src='https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https://www.arweave.net/yu3APANxGICaEQxyZicV86nNNcUIo_KZO14Xjs3kR6M?ext=png'
                                alt=''
                            />
                            <button className='see-points'>
                                <RoundCornerLeft />
                                <span>See points</span>
                                <RoundCornerRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Menu />
        </MainPage>
    )
}
