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
     *          https://medium.com/web-development-with-sumit/useref-vs-usestate-in-react-330539025245#:~:text=serve%20different%20purposes.-,useRef%20is%20primarily%20used%20to%20access%20and%20manipulate%20the%20DOM,renders%20when%20the%20state%20updates.
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