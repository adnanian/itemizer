export default function Grid(props) {
    return (
        <div id={props.blockId} className="grid-block">
            {
                props.intermediateId ? (
                    <div id={props.intermediateId} className="grid">
                        {props.children}
                    </div>
                ) : (
                    props.children
                )
            }
        </div>
    )
}