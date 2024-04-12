function InputErrorMessage( { errors, touched }) {
    if (errors && touched) {
        return (
            <p className="error">{errors}</p>
        )
    }
    return null;
}

export default InputErrorMessage;