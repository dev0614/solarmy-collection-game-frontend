import { Dialog } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { NextRouter, useRouter } from "next/router";
import { PureComponent, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { depositToVault } from "../../solana/transaction_staking";

export default function PlanItem(props: {
    id: 1 | 2 | 3
}) {
    const { id } = props;
    const wallet = useWallet();
    const [planContent, setPlanContent] = useState({
        label: "",
        description: "",
        image: "",
        price: 0
    });
    const [loading, setLoading] = useState(false);
    const [modalOpened, setModalOpened] = useState(false);
    const router = useRouter();
    const [fechedItem, setFechedItem] = useState({
        Atribute: "",
        Atribute_Type: "",
        Points: "",
        Rarity: "",
        URL: "",
    })
    const handleBuy = async () => {
        setLoading(true);
        try {
            const data = await depositToVault(wallet, id, () => setLoading(true), () => setLoading(false));
            console.log(data, "===> item data");
            if (data && data.length !== 0) {
                setFechedItem({
                    Atribute: data.Atribute,
                    Atribute_Type: data.Atribute_Type,
                    Points: data.Points,
                    Rarity: data.Rarity,
                    URL: data.URL,
                })
                setModalOpened(true);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        switch (id) {
            case 1:
                setPlanContent({
                    label: "Field Grade Loot Create",
                    description: "Regular crate with no chance of a transcendental attribute.",
                    image: "/img/store/field.jpg",
                    price: 500
                })
                break;
            case 2:
                setPlanContent({
                    label: "Company Grade Loot Create",
                    description: "Guaranteed universal attribute and chance of a transcendental attribute.",
                    image: "/img/store/company.jpg",
                    price: 1500
                })
                break;
            case 3:
                setPlanContent({
                    label: "Elite Grade Loot Create",
                    description: "Guaranteed universal attribute and chance transcendental attribute.",
                    image: "/img/store/elite.jpg",
                    price: 3000
                })
                break;
            default:
                break;
        }
    }, [id])
    return (
        <div className="plan">
            <div className="plan-content">
                <div className="plan-media">
                    {/* eslint-disable-next-line */}
                    <img
                        src={planContent.image}
                        alt=""
                    />
                </div>
                <p className="plan-label">{planContent.label}</p>
                <p className="plan-description">{planContent.description}</p>
                <div className="plan-ammo">
                    <span>AMMO</span>
                    <span>{planContent.price}</span>
                </div>
                <button
                    className="btn-buy"
                    disabled={loading}
                    onClick={handleBuy}
                >

                    {loading ?
                        <ClipLoader size={18} color="#fff" />
                        :
                        <>Buy</>
                    }
                </button>
            </div>
            <PurchasedModal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title={planContent.label}
                router={router}
                fechedItem={fechedItem}
            />
        </div>
    )
}

export const PurchasedModal = (props: {
    opened: boolean,
    onClose: Function,
    title: string,
    router: NextRouter,
    fechedItem: any
}) => {
    const { opened, onClose, title, router, fechedItem } = props;
    return (
        <Dialog
            open={opened}
            onClose={() => onClose()}
        >
            <div className="purchased-modal">
                <div className="modal-content">
                    <p className="title">{title}</p>
                    <h5 className="desc">You received the following attributes</h5>
                    <div className="media-box">
                        {/* eslint-disable-next-line */}
                        <img
                            src={fechedItem.URL}
                            alt=""
                        />
                        <p className="attribute-name">{fechedItem.Atribute}</p>
                        <h5 className="attribute-points">{fechedItem.Rarity} {fechedItem.Points}</h5>
                    </div>
                </div>
                <div className="button-group">
                    <button className="btn-close" onClick={() => onClose()}>
                        close
                    </button>
                    <button className="btn-fuse" onClick={() => router.push("/fussion")}>
                        go fuse
                    </button>
                </div>
            </div>
        </Dialog>
    )
}