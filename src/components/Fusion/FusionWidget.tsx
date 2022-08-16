import { MouseEventHandler } from "react";

export function FusionType(props:
    {
        selectedKind: string,
        handleAttribute: MouseEventHandler<HTMLLIElement>
    }
) {
    const { selectedKind, handleAttribute } = props;
    return (
        <ul>
            <li
                className={`${selectedKind === "head" ? "selected" : ""}`}
                onClick={handleAttribute}
            >
                Head
            </li>
            {/* <li className="selected activated">Head</li> */}
            <li
                className={`${selectedKind === "head_accessories" ? "selected" : ""}`}
                onClick={handleAttribute}
            >
                Head Accessories
            </li>
            <li
                className={`${selectedKind === "torso" ? "selected" : ""}`}
                onClick={handleAttribute}
            >
                Torso
            </li>
            <li
                className={`${selectedKind === "l_arm" ? "selected" : ""}`}
                onClick={handleAttribute}
            >
                L Arm
            </li>
            <li
                className={`${selectedKind === "r_arm" ? "selected" : ""}`}
                onClick={handleAttribute}
            >
                R Arm
            </li>
            <li
                className={`${selectedKind === "legs" ? "selected" : ""}`}
                onClick={handleAttribute}
            >
                Legs
            </li>
            <li
                className={`${selectedKind === "background" ? "selected" : ""}`}
                onClick={handleAttribute}
            >
                Background
            </li>
        </ul>
    )
}

export const FusionMediaImage = () => {
    return (
        <div className="merged-image" style={{ display: "none" }}>
            {/* === Background === */}
            {/* eslint-disable-next-line */}
            <img
                src={"/img/attributes/forest.png"}
                // src={equipedAttr?.background.URL}
                alt=""
            />
            {/* === Shadow === */}
            {/* eslint-disable-next-line */}
            <img
                src="/img/attributes/shadow.png"
                alt=""
            />
            {/* === Legs === */}
            {/* eslint-disable-next-line */}
            <img
                src={"/img/attributes/alien wings.png"}
                // src={equipedAttr?.legs.URL}
                alt=""
            />
            {/* === Left Arm === */}
            {/* eslint-disable-next-line */}
            <img
                src={"/img/attributes/robot honour.png"}
                // src={equipedAttr?.left_arm.URL}
                alt=""
            />
            {/* eslint-disable-next-line */}
            <img
                src={"/img/attributes/alien chain.png"}
                // src={equipedAttr?.torso.URL}
                alt=""
            />
            {/* eslint-disable-next-line */}
            <img
                src={"/img/attributes/plant down.png"}
                // src={equipedAttr?.right_arm.URL}
                alt=""
            />
            {/* eslint-disable-next-line */}
            <img
                src={"/img/attributes/soldier helmet.png"}
                // src={equipedAttr?.head.URL}
                alt=""
            />
        </div>
    )
}