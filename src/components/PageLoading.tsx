export default function PageLoading(props: { loading?: boolean }) {
    return (
        <>
            {props.loading ?
                <div className="page-loading">
                    <div className="lds-roller">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
                :
                <div></div>
            }
        </>
    )
}
