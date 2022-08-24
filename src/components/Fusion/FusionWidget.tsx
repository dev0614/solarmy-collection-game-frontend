import { useRouter } from "next/router";
import { MouseEventHandler } from "react";
import { CategoryTwoToneIcon } from "../svgIcons";

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
            {props.headAccessoriesImage !== "" &&
                // eslint-disable-next-line
                <img
                    src={props.headAccessoriesImage}
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