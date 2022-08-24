export default function PageLoading(props: {
    loading?: boolean,
    label?: string
}) {
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
                    {props.label &&
                        <p className="loading-label">This is loading</p>
                    }
                </div>
                :
                <div></div>
            }
        </>
    )
}
