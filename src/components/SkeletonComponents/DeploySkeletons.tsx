import { Skeleton } from "@mui/material"

export const DeployItemSkeleton = () => {
    return (
        <div className="deploy-item" >
            <div className="item-content">
                <div className="media">
                    <Skeleton variant="rectangular" animation="wave" sx={{ borderRadius: "16px", width: "164px", height: "164px" }} />
                </div>
                <div className="item-box" style={{ display: "flex", justifyContent: "space-between" }}>
                    <div className="content">
                        <div className="content-header">
                            <Skeleton variant="rectangular" animation="wave" sx={{ borderRadius: "16px", width: "60px", height: "20px", marginRight: "20px" }} />
                            <Skeleton variant="rectangular" animation="wave" sx={{ borderRadius: "16px", width: "160px", height: "20px" }} />
                        </div>
                        <div className="deploy-active-view">
                            <Skeleton variant="rectangular" animation="wave" sx={{ borderRadius: "16px", width: "260px", height: "20px", marginTop: "10px" }} />
                        </div>
                    </div>
                    <div className="deploy-action-right">
                        <Skeleton variant="rectangular" animation="wave" sx={{ borderRadius: "16px", width: "120px", height: "164px" }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export const DeployDenseItemSkeleton = () => {
    return (

        <div className="deploy-item-dense">
            <div className="deploy-dense-content">
                <div className="content">
                    <Skeleton variant="rectangular" animation="wave" sx={{ borderRadius: "4.8px", width: "48px", height: "48px" }} />
                    <p className="nft-id"><Skeleton variant="rectangular" animation="wave" sx={{ borderRadius: "4px", width: "48px", height: "20px" }} /></p>
                    <Skeleton variant="rectangular" animation="wave" sx={{ borderRadius: "4px", width: "160px", height: "20px" }} />
                    <Skeleton variant="rectangular" animation="wave" sx={{ borderRadius: "4px", width: "260px", height: "20px", marginLeft: "20px" }} />
                </div>
                <Skeleton variant="rectangular" animation="wave" sx={{ borderRadius: "116px", width: "116px", height: "48px" }} />
            </div>
        </div >
    )
}