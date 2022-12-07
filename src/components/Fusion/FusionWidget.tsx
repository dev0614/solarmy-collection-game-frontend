import { useRouter } from "next/router";
import { CategoryTwoToneIcon } from "../svgIcons";

export function FusionType(props:
    {
        selectedKind: string,
        ableInventories: any,
        handleAttribute: Function
    }
) {
    const { selectedKind, ableInventories, handleAttribute } = props;
    return (
        <ul>
            <li
                className={`${selectedKind === "head" ? "selected" : ""}`}
                onClick={() => handleAttribute("head")}
            >
                Head
                ({ableInventories?.filter((item: any) => item.attribute_type === "head").length})
            </li>
            {/* <li className="selected activated">Head</li> */}
            <li
                className={`${selectedKind === "head_accessories" ? "selected" : ""}`}
                onClick={() => handleAttribute("head accessories")}
            >
                Head Accessories
                ({ableInventories?.filter((item: any) => item.attribute_type === "head accessories").length})
            </li>
            <li
                className={`${selectedKind === "torso" ? "selected" : ""}`}
                onClick={() => handleAttribute("torso")}
            >
                Torso
                ({ableInventories?.filter((item: any) => item.attribute_type === "torso").length})
            </li>
            <li
                className={`${selectedKind === "l_arm" ? "selected" : ""}`}
                onClick={() => handleAttribute("left arm")}
            >
                L Arm
                ({ableInventories?.filter((item: any) => item.attribute_type === "left arm").length})
            </li>
            <li
                className={`${selectedKind === "r_arm" ? "selected" : ""}`}
                onClick={() => handleAttribute("right arm")}
            >
                R Arm
                ({ableInventories?.filter((item: any) => item.attribute_type === "right arm").length})
            </li>
            <li
                className={`${selectedKind === "legs" ? "selected" : ""}`}
                onClick={() => handleAttribute("legs")}
            >
                Legs
                ({ableInventories?.filter((item: any) => item.attribute_type === "legs").length})
            </li>
            <li
                className={`${selectedKind === "background" ? "selected" : ""}`}
                onClick={() => handleAttribute("background")}
            >
                Background
                ({ableInventories?.filter((item: any) => item.attribute_type === "background").length})
            </li>
        </ul>
    )
}

export const FusionMediaImage = (props: {
    headImage: string,
    headAccessoriesImage: string,
    torsoImage: string,
    leftArmImage: string,
    rightArmImage: string,
    legsImage: string,
    backgroundImage: string,
}) => {
    return (
        <div className="merged-image">
            {props.backgroundImage !== "" &&
                // eslint-disable-next-line
                <img
                    src={props.backgroundImage}
                    alt=""
                />
            }
            {/* eslint-disable-next-line */}
            <img
                src="/img/attributes/shadow.png"
                alt=""
            />
            {props.legsImage !== "" &&
                // eslint-disable-next-line
                <img
                    src={props.legsImage}
                    alt=""
                />
            }
            {props.leftArmImage !== "" &&
                // eslint-disable-next-line
                <img
                    src={props.leftArmImage}
                    alt=""
                />
            }
            {props.torsoImage !== "" &&
                // eslint-disable-next-line
                <img
                    src={props.torsoImage}
                    alt=""
                />
            }
            {props.rightArmImage !== "" &&
                // eslint-disable-next-line
                <img
                    src={props.rightArmImage}
                    alt=""
                />
            }
            {props.headImage !== "" &&
                // eslint-disable-next-line
                <img
                    src={props.headImage}
                    alt=""
                />
            }
            {!props.headAccessoriesImage || props.headAccessoriesImage !== "" &&
                // eslint-disable-next-line
                <img
                    src={props.headAccessoriesImage}
                    alt=""
                />
            }

        </div>
    )
}

export const FusionStoreCta = (props: { link?: string }) => {
    const router = useRouter();
    return (
        <div className="fusion-store-cta" onClick={() => router.push(props.link ? props.link : "#")}>
            <CategoryTwoToneIcon />
            <span>store</span>
        </div>
    )
}