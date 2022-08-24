export default function EquipedTable(props: {
    equipedAttr: any
}) {
    const { equipedAttr } = props;
    return (
        <div className="attr-table">
            <div className="thead">
                <div className="tr">
                    <div className="th">Attribute</div>
                    <div className="th">Name</div>
                    <div className="th">Rarity &#38; Points</div>
                </div>
            </div>
            <div className="tbody">
                <div className="tr">
                    <div className="td">Head</div>
                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "head")?.attribute}</div>
                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "head")?.points}</div>
                </div>
                <div className="tr">
                    <div className="td">Head Accessories</div>
                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "head accessories")?.attribute}</div>
                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "head accessories")?.points}</div>
                </div>
                <div className="tr">
                    <div className="td">L Arm</div>
                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "left arm")?.attribute}</div>
                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "left arm")?.points}</div>
                </div>
                <div className="tr">
                    <div className="td">R Arm</div>
                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "right arm")?.attribute}</div>
                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "right arm")?.points}</div>
                </div>
                <div className="tr">
                    <div className="td">Torso</div>
                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "torso")?.attribute}</div>
                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "torso")?.points}</div>
                </div>
                <div className="tr">
                    <div className="td">Legs</div>
                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "legs")?.attribute}</div>
                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "legs")?.points}</div>
                </div>
                <div className="tr">
                    <div className="td">Background</div>
                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "background")?.attribute}</div>
                    <div className="td">{equipedAttr?.find((item: any) => item.attribute_type === "background")?.points}</div>
                </div>
            </div>
        </div>
    )
}