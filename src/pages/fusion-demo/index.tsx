import Link from 'next/link'
import React, { useState } from 'react'
import Header from '../../components/Header'
import Menu from '../../components/Menu'
import { BuySoliderMarketplaceIcon, CompassIcon, FusionCardEditLg, FusionEmptyIcon } from '../../components/svgIcons'
import { MainPage } from '../../components/Widget'

export default function FusionPage() {
    const [pageTab, setPageTab] = useState('collection');
    return (
        <MainPage>
            <Header
                back={{
                    backUrl: '/dashboard',
                    title: 'Fusion'
                }} />
            <div className='fusion-page'>
                <div className='dashboard-tabs'>
                    <button className={pageTab === 'collection' ? 'btn-tab active' : 'btn-tab'} onClick={() => setPageTab('collection')}>your collection</button>
                    <button className={pageTab === 'attributes' ? 'btn-tab active' : 'btn-tab'} onClick={() => setPageTab('attributes')}>all attributes</button>
                </div>
                <div className='collection-main-box'>
                    <div className='fusion-nft-card box-shadow'>
                        <div className='card-media'>
                            {/* eslint-disable-next-line */}
                            <img
                                src='https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https://www.arweave.net/yu3APANxGICaEQxyZicV86nNNcUIo_KZO14Xjs3kR6M?ext=png'
                                alt=''
                            />
                        </div>
                        <div className='fusion-card-overview'>
                            <Link href={'/fusion-demo/1'}>
                                <a>
                                    <FusionCardEditLg />
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className='collection-placeholder'>
                        <Link href="https://magiceden.io/marketplace/3d_soldiers">
                            <a className='placeholder-icon' target="_blank">
                                <CompassIcon />
                                <span>buy 3d soldiers</span>
                            </a>
                        </Link>
                    </div>
                </div>
                <div className='nft-linst-box box-shadow'>
                    <h3>your soliders</h3>
                    <div className='content'>
                        {
                            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((item, key) => (
                                <div className='empty-fusion-card' key={key}>
                                    <FusionEmptyIcon />
                                    <div className='card-overview'>
                                        <Link href="https://magiceden.io/marketplace/3d_soldiers">
                                            <a target="_blank">
                                                <BuySoliderMarketplaceIcon />
                                                <span>Buy Soldiers</span>
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <Menu />
        </MainPage>
    )
}
