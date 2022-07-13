import { ArrowRightTwoTone, InfoTwoTone } from "./svgIcons"

export const MainPage = (props: { children: any }) => {
    return (
        <main className="main-page">
            {/* eslint-disable-next-line */}
            <img
                src="/img/main-bg.png"
                alt=""
                className="page-bg"
            />
            <div className="page-content">
                {props.children}
            </div>
        </main>
    )
}

export const Badge = (props: {
    title: string
}) => {
    return (
        <div className="dashboard-box">
            <div className="dashboard-box-header">
                <p className="title">{props.title} Badge</p>
                <button className="btn-icon">
                    <InfoTwoTone />
                </button>
            </div>
            <div className="badge-content">
                {/* eslint-disable-next-line */}
                <img
                    src="/img/badge/special-forces-lg.png"
                    alt=""
                />
            </div>
        </div>
    )
}

export const TopSolider = (props: {
    title: string,
    image: string
}) => {
    return (
        <div className="top-solider">
            {/* eslint-disable-next-line */}
            <img
                src={props.image}
            />
            <span>{props.title}</span>
        </div>
    )
}

export const LeaderboardState = () => {
    return (
        <div className="dashboard-box">
            <div className="dashboard-box-header">
                <p className="title">Mission Leaderboards</p>
                <button className="btn-icon">
                    <ArrowRightTwoTone />
                </button>
            </div>
            <div className="dashboard-tabs">
                <button className="btn-tab">top solider</button>
                <button className="btn-tab">top collection</button>
            </div>
            <div className="dashboard-tabs">
                <button className="btn-tab">2d</button>
                <button className="btn-tab">3d</button>
            </div>
        </div>
    )
}