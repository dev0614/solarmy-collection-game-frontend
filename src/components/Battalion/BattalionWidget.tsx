import { AttributeFilterTypes } from "../../solana/types"
import { SettingIcon, SoldierItemHoverIcon, SoldierItemSelectIcon } from "../svgIcons"

export const SoliderFilter = (props: {
    attributes: AttributeFilterTypes
}) => {
    return (
        <div className="solider-filter">
            <button className="btn-icon btn-transparent">
                <SettingIcon />
            </button>
        </div>
    )
}

export const SoliderSideItem = (props: {
    selected: boolean,
    mint: string,
    selectedId: string,
    image: string,
    uri: string,
    id: string,
    onSelect: Function,
    collection: string
}) => {
    return (
        <div className={`solider-side-item ${props.selected ? "selected" : ""}`}
            onClick={() => props.onSelect(props.mint, props.id, props.collection, props.image, props.uri)}>
            <div className="soldier-media">
                {props.selected &&
                    <SoldierItemSelectIcon />
                }
                {!props.selected &&
                    <div className="hover-icon">
                        <SoldierItemHoverIcon />
                    </div>
                }
                {/* eslint-disable-next-line */}
                <img
                    src={props.image}
                    alt=""
                />
            </div>
            <p>#{props.id}</p>
        </div>
    )
}