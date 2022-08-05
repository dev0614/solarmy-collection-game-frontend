import { useEffect, useState } from "react";

export default function PlanItem(props: {
    id: 1 | 2 | 3
}) {
    const { id } = props;
    const [planContent, setPlanContent] = useState({
        label: "",
        description: "",
        image: "",
        price: 0
    })
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
                    label: "Field Grade Loot Create",
                    description: "Guaranteed universal attribute and chance of a transcendental attribute.",
                    image: "/img/store/company.jpg",
                    price: 1500
                })
                break;
            case 3:
                setPlanContent({
                    label: "Field Grade Loot Create",
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
                <button className="btn-buy">
                    Buy
                </button>
            </div>
        </div>
    )
}