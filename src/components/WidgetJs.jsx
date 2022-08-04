import { useState } from "react";
import Switch from "react-switch";

export const ToggleSwitch = ({ label, id }) => {
    const [checked, setChecked] = useState(false);
    const handleChange = (checked, id) => {
        setChecked(checked)
        console.log(id)
    }
    return (
        <label className="toggle-switch">
            <Switch
                onChange={(checked) => handleChange(checked, "shit")}
                checked={checked}
                checkedIcon={false}
                uncheckedIcon={false}
                onColor="#4AF497"
                offColor="#ffffff99"
                width={50}
                height={28}
                onHandleColor="#292929"
                offHandleColor="#292929"
            />
            <span className="label">{label}</span>
        </label>
    )
}