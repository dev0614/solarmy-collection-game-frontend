export default function Soldier3DAttributeTable(props: {
    head: {
        value: string
        rarity: string,
        points: string,
        type: string
    },
    head_accessories: {
        value: string
        rarity: string,
        points: string,
        type: string
    },
    l_arm: {
        value: string
        rarity: string,
        points: string,
        type: string
    },
    r_arm: {
        value: string
        rarity: string,
        points: string,
        type: string
    },
    torso: {
        value: string
        rarity: string,
        points: string,
        type: string
    },
    legs: {
        value: string
        rarity: string,
        points: string,
        type: string
    },
    background: {
        value: string
        rarity: string,
        points: string,
        type: string
    }
}) {
    return (
        <div className="attribute-table">
            <div className="thead">
                <div className="tr changes">
                    <div className="th">Attribute</div>
                    <div className="th">Name</div>
                    <div className="th">Rarity &#38; Points</div>
                </div>
            </div>
            <div className="tbody">
                <div className="tr">
                    <div className="td">Head</div>
                    <div className="td">{props.head?.value.replaceAll("_", " ")}</div>
                    <div className="td">{props.head?.rarity} {props.head?.points}</div>
                </div>
                <div className="tr">
                    <div className="td">Head Accessories</div>
                    <div className="td">{props.head_accessories?.value.replaceAll("_", " ")}</div>
                    <div className="td">{props.head_accessories?.rarity} {props.head_accessories?.points}</div>
                </div>
                <div className="tr">
                    <div className="td">L Arm</div>
                    <div className="td">{props.l_arm?.value.replaceAll("_", " ")}</div>
                    <div className="td">{props.l_arm?.rarity} {props.l_arm?.points}</div>
                </div>
                <div className="tr">
                    <div className="td">R Arm</div>
                    <div className="td">{props.r_arm?.value.replaceAll("_", " ")}</div>
                    <div className="td">{props.r_arm?.rarity} {props.r_arm?.points}</div>
                </div>
                <div className="tr">
                    <div className="td">Legs</div>
                    <div className="td">{props.legs?.value.replaceAll("_", " ")}</div>
                    <div className="td">{props.legs?.rarity} {props.legs?.points}</div>
                </div>
                <div className="tr">
                    <div className="td">Torso</div>
                    <div className="td">{props.torso?.value.replaceAll("_", " ")}</div>
                    <div className="td">{props.torso?.rarity} {props.torso?.points}</div>
                </div>
                <div className="tr">
                    <div className="td">Background</div>
                    <div className="td">{props.background?.value.replaceAll("_", " ")}</div>
                    <div className="td">{props.background?.rarity} {props.background?.points}</div>
                </div>
            </div>
        </div>
    )
}
