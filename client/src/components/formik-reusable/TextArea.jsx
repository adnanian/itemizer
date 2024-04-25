import { useField } from "formik";
import InputErrorMessage from "../InputErrorMessage";

/**
 * TODO
 */
const TextArea = ({label, id, ...props}) => {
    // field - info about the input fields
    // meta - info about input interactions and errors
    // helpers - functions
    const [field, meta] = useField(props);

    return (
        <>
            <label htmlFor={id}>{label}</label>
            <textarea 
                className={meta.error && meta.touched ? "input-error" : ""}
                {...field}
                {...props} 
            ></textarea>
            <InputErrorMessage errors={meta.error} touched={meta.touched}/>
        </>
    );
}

export default TextArea;