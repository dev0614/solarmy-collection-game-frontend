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