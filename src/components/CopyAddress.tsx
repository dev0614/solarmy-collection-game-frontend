import copy from "copy-to-clipboard";
import { useState } from "react";
import { PastIcon } from "./svgIcons";

export default function CopyAddress(props: { address: string, length?: number }) {
    const { address, length } = props;
    const [isCopied, setIsCopied] = useState(false);
    const handleCopy = (text: string) => {
        copy(text);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    }

    return (
        <div className="winner-address" onClick={() => handleCopy(address)}>
            {length ? `${address.slice(0, length)}..${address.slice(0 - length)}` : `${address.slice(0, 8)}..${address.slice(-8)}`}
            <span className="copy-icon">
                {!isCopied ?
                    <PastIcon /> :
                    <span className="copied">copied!</span>
                }
            </span>
        </div>
    )
}
