import { useEffect, useRef } from "react";

export default function Modal( { openModal, closeModal, children } ) {
    const ref = useRef();

    /**
     * "?." - known as the optional chaning operator.
     * According to MDN, it will either access the object's property or call its function.
     * If the object itself is undefined or null, then the entire expression evaluates to undefined,
     * instead of throwing an error.
     * 
     * Sources: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
     *          https://medium.com/@dimterion/modals-with-html-dialog-element-in-javascript-and-react-fb23c885d62e
     * 
     */
    useEffect(() => {
        if (openModal) {
            ref.current?.showModal();
        } else {
            ref.current?.close();
        }
    }, [openModal]);

    return (
        <dialog ref={ref} onCancel={closeModal}> 
            {children}
            <button onClick={closeModal}>Close</button>
        </dialog>
    )
}