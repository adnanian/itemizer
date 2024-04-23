export default function Grid(props) {
    return (
        <div id={props.blockId} className="grid-block">
            <div id={props.intermediateId} className="grid">
                {props.children}
            </div>
        </div>
    )
}