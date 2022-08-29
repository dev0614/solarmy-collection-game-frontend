export default function Soldier2DAttributeTable(props: {
    head: {
        name: string,
        rarity: string
    },
    head_accessories: {
        name: string,
        rarity: string
    },
    l_arm: {
        name: string,
        rarity: string
    },
    r_arm: {
        name: string,
        rarity: string
    },
    torso: {
        name: string,
        rarity: string
    },
    legs: {
        name: string,
        rarity: string
    },
    background: {
        name: string,
        rarity: string
    }
}) {
    return (
        <div className="attribute-table">
            <div className="thead">
                <div className="tr changes">
                    <div className="th">Attribute</div>
                    <div className="th">Name</div>
                    <div className="th">Rarity</div>
                </div>
            </div>
            <div className="tbody">
                <div className="tr">
                    <div className="td">Head</div>
                    <div className="td">{props.head?.name}</div>
                    <div className="td">{props.head?.rarity}</div>
                </div>
                <div className="tr">
                    <div className="td">Head Accessories</div>
                    <div className="td">{props.head_accessories?.name}</div>
                    <div className="td">{props.head_accessories?.rarity}</div>
                </div>
                <div className="tr">
                    <div className="td">L Arm</div>
                    <div className="td">{props.l_arm?.name}</div>
                    <div className="td">{props.l_arm?.rarity}</div>
                </div>
                <div className="tr">
                    <div className="td">R Arm</div>
                    <div className="td">{props.r_arm?.name}</div>
                    <div className="td">{props.r_arm?.rarity}</div>
                </div>
                <div className="tr">
                    <div className="td">Torso</div>
                    <div className="td">{props.torso?.name}</div>
                    <div className="td">{props.torso?.rarity}</div>
                </div>
                <div className="tr">
                    <div className="td">Legs</div>
                    <div className="td">{props.legs?.name}</div>
                    <div className="td">{props.legs?.rarity}</div>
                </div>
                <div className="tr">
                    <div className="td">Background</div>
                    <div className="td">{props.background?.name}</div>
                    <div className="td">{props.background?.rarity}</div>
                </div>
            </div>
        </div>
    )
}