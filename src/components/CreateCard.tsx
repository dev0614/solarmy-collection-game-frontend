import { useLayoutEffect, useRef, useState } from "react";
import { CardChecked, CardUnChecked } from "./svgIcons";

export default function CreateCard(props: {
    selected: boolean,
    description: string,
    external_url: string,
    image: string,
    name: string,
    mint: string,
    handleSelect: Function,
    collectionName: string,
    collectionId: string
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        if (cardRef.current) {
            setDimensions({
                width: cardRef.current.offsetWidth,
                height: cardRef.current.offsetHeight
            });
        }
    }, []);

    const [selected, setSelected] = useState(false);
    const onSelect = () => {
        setSelected(!selected);
        props.handleSelect({
            mint: props.mint,
            selected: !selected,
            collectionName: props.collectionName,
            collectionId: props.collectionId,
        })
    }
    return (
        <div className="create-card">
            <div
                className="card-media"
                ref={cardRef}
                style={{ height: dimensions.width }}
            >
                {/* eslint-disable-next-line */}
                <img
                    src={props.image}
                    alt=""
                />
            </div>
            {!selected &&
                <div className="card-overlay"></div>
            }
            <span className="card-checked" onClick={() => onSelect()}>
                {selected ?
                    <CardChecked />
                    :
                    <CardUnChecked />
                }
            </span>
        </div>
    )
}
