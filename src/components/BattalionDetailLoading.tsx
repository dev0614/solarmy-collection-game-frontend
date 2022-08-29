import { Skeleton } from "@mui/material";

export default function BattalionDetailLoading() {
    return (
        <div className="battalion-detail-loading">
            <div className="list-head">
                <div className="id-line">
                    <h3><Skeleton variant="rectangular" width={62} height={28} /></ h3>
                    <p><Skeleton variant="rectangular" width={15.5} height={20} /></p>
                </div>
                <div className="score-line">
                    <h3><Skeleton variant="rectangular" width={50} height={24} /></h3>
                    <p><Skeleton variant="rectangular" width={30} height={24} /></p>
                </div>
                <div className="rank-line">
                    <h3><Skeleton variant="rectangular" width={60} height={24} /></h3>
                    <p><Skeleton variant="rectangular" width={45} height={24} /></p>
                </div>
            </div>
            <div className="attribute-table">
                <div className="tbody">
                    <div className="tr">
                        <div className="td">
                            <Skeleton variant="rectangular" width={40} height={19.8} />
                        </div>
                        <div className="td">
                            <Skeleton variant="rectangular" width={40} height={19.8} />
                        </div>
                        <div className="td">
                            <Skeleton variant="rectangular" width={40} height={19.8} />
                        </div>
                    </div>
                    <div className="tr">
                        <div className="td">
                            <Skeleton variant="rectangular" width={40} height={19.8} />
                        </div>
                        <div className="td">
                            <Skeleton variant="rectangular" width={40} height={19.8} />
                        </div>
                        <div className="td">
                            <Skeleton variant="rectangular" width={40} height={19.8} />
                        </div>
                    </div>
                    <div className="tr">
                        <div className="td">
                            <Skeleton variant="rectangular" width={40} height={19.8} />
                        </div>
                        <div className="td">
                            <Skeleton variant="rectangular" width={40} height={19.8} />
                        </div>
                        <div className="td">
                            <Skeleton variant="rectangular" width={40} height={19.8} />
                        </div>
                    </div>
                    <div className="tr">
                        <div className="td">
                            <Skeleton variant="rectangular" width={40} height={19.8} />
                        </div>
                        <div className="td">
                            <Skeleton variant="rectangular" width={40} height={19.8} />
                        </div>
                        <div className="td">
                            <Skeleton variant="rectangular" width={40} height={19.8} />
                        </div>
                    </div>
                    <div className="tr">
                        <div className="td">
                            <Skeleton variant="rectangular" width={40} height={19.8} />
                        </div>
                        <div className="td">
                            <Skeleton variant="rectangular" width={40} height={19.8} />
                        </div>
                        <div className="td">
                            <Skeleton variant="rectangular" width={40} height={19.8} />
                        </div>
                    </div>
                    <div className="tr">
                        <div className="td">
                            <Skeleton variant="rectangular" width={40} height={19.8} />
                        </div>
                        <div className="td">
                            <Skeleton variant="rectangular" width={40} height={19.8} />
                        </div>
                        <div className="td">
                            <Skeleton variant="rectangular" width={40} height={19.8} />
                        </div>
                    </div>
                    <div className="tr">
                        <div className="td">
                            <Skeleton variant="rectangular" width={40} height={19.8} />
                        </div>
                        <div className="td">
                            <Skeleton variant="rectangular" width={40} height={19.8} />
                        </div>
                        <div className="td">
                            <Skeleton variant="rectangular" width={40} height={19.8} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}