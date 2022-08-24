import { Dialog } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { NextRouter, useRouter } from "next/router";
import { PureComponent, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useUserContext } from "../../context/UserProvider";
import { depositToVault } from "../../solana/transaction_staking";

export default function PlanItem(props: {
    id: 1 | 2 | 3
}) {
    const { id } = props;
    const wallet = useWallet();
    const { getUserData } = useUserContext();
    const [planContent, setPlanContent] = useState({
        label: "",
        description: "",
        image: "",
        price: 0
    });
    const [loading, setLoading] = useState(false);
    const [modalOpened, setModalOpened] = useState(false);
    const router = useRouter();
    const [fetchedItem, setFetchedItem] = useState({
        Atribute: "",
        Atribute_Type: "",
        Points: "",
        Rarity: "",
        URL: "",
    })
    const handleBuy = async () => {
        setLoading(true);
        try {
            const data = await depositToVault(wallet, id, () => setLoading(true), () => setLoading(false), () => getUserData());
            console.log(data, "===> item data");
            if (data && data.length !== 0) {
                setFetchedItem({
                    Atribute: data.attribute,
                    Atribute_Type: data.attribute_type,
                    Points: data.points,
                    Rarity: data.rarity,
                    URL: data.url,
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
                {wallet.publicKey &&
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
                }
            </div>
            <PurchasedModal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title={planContent.label}
                router={router}
                fetchedItem={fetchedItem}
            />
        </div>
    )
}

export const PurchasedModal = (props: {
    opened: boolean,
    onClose: Function,
    title: string,
    router: NextRouter,
    fetchedItem: any
}) => {
    const { opened, onClose, title, router, fetchedItem } = props;
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
                            src={fetchedItem.URL}
                            alt=""
                        />
                        <p className="attribute-name">{fetchedItem.Atribute_Type}: {fetchedItem.Atribute}</p>
                        <h5 className="attribute-points">{fetchedItem.Rarity} {fetchedItem.Points}</h5>
                    </div>
                </div>
                <div className="button-group">
                    <button className="btn-close" onClick={() => onClose()}>
                        close
                    </button>
                    <button className="btn-fuse" onClick={() => router.push("/fusion")}>
                        go fuse
                    </button>
                </div>
            </div>
        </Dialog>
    )
}