import { useRouter } from "next/router";
import { ArrowBackIosTwoTone, DiscordIcon, EditTwoTone } from "./svgIcons";

export default function Header(props: {
    back?: {
        backUrl: string,
        title: string
    },

}) {
    const router = useRouter();
    return (
        <header>
            <div className="header-content">
                <div className="back-link">
                    {props.back &&
                        <button className="btn-back" onClick={() => router.push(props.back ? props.back.backUrl : "/")}>
                            <div className="btn-body">
                                <ArrowBackIosTwoTone />
                            </div>
                            <span>{props.back.title}</span>
                        </button>
                    }
                </div>
                <div className="header-control">
                    <div className="user-badge">
                        {/* eslint-disable-next-line */}
                        <img
                            src="/img/badge/special-forces-sm.png"
                            alt=""
                            className="badge-sm"
                        />
                    </div>
                    <div className="username-box">
                        <div className="name">
                            <p>Sasuke0601</p>
                            <label><DiscordIcon /><span>Username</span></label>
                        </div>
                        <button className="btn-icon">
                            <EditTwoTone />
                        </button>
                    </div>
                    <button className="special-effect">
                        {/* eslint-disable-next-line */}
                        <img
                            src="/img/special-effects.png"
                            alt=""
                        />
                    </button>
                    <button className="btn-balance">
                        <div className="content">
                            {/* eslint-disable-next-line */}
                            <img
                                src="/img/ammo.svg"
                                className="ammo-icon"
                                alt=""
                            />
                            <p>1,250 $AMMO</p>
                            <h5>Buy here</h5>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    )
}