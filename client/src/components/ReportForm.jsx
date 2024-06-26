import { useState } from "react";

/**
 * A mock form for submitting anything suspicious about an item.
 * No actual changes take effect upon successful submission.
 * 
 * @returns a mock form to report suspicious items.
 */
export default function ReportForm() {
    const [formData, setFormData] = useState({
        itemName: "",
        reason: ""
    })

    /**
     * Updates formData state value.
     * 
     * @param {*} e 
     */
    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    /**
     * Mocks form submission of a reported item.
     * No changes take effect on submission.
     * For now, client will simply send request to server to check if an item
     * with an item with a given name or part number exists. An alert message
     * will display the result.
     * 
     * @param {*} e the event.
     */
    function handleSubmit(e) {
        e.preventDefault();
        for (const key in formData) {
            if (!formData[key]) {
                alert(`${key.toUpperCase()} field required.`);
                return;
            }
        }
        fetch(`/api/items/${formData.itemName}`)
            .then((response) => response.json().then((data) => ({ data, status: response.status })))
            .then(({ data, status }) => {
                console.log(data);
                if (status == 200) {
                    alert("Thank you for your submission. We'll look into it.");
                } else {
                    throw new Error(`Item name/part #, ${formData.itemName}, does not exist in our system. Please try again.`);
                }
            })
            .catch((error) => {
                alert(error);
            })
            .finally(() => {
                setFormData((oldFormData) => {
                    const clearedFormData = {}
                    for (const key in oldFormData) {
                        clearedFormData[key] = "";
                    }
                    return clearedFormData;
                })
            });
    }


    return (
        <div >
            <div id="report-form">
                <h3 id="report-form-title">Report an Illegal/Suspicious Product?</h3>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="itemName">Name / Part #</label>
                    <input
                        id="itemName"
                        name="itemName"
                        type="text"
                        value={formData.itemName}
                        onChange={handleChange}
                    />
                    <label htmlFor="reason">Reason</label>
                    <textarea
                        id="reason"
                        name="reason"
                        rows="15"
                        cols="80"
                        value={formData.reason}
                        onChange={handleChange}
                    >
                    </textarea>
                    <input type="submit" />
                </form>
            </div>
        </div>
    )
}