import Switch from 'react-switch';

export const ToggleSwitch = ({ label, id, checked, handleChange }) => {
    return (
        <label className='toggle-switch'>
            <Switch
                onChange={(checked) => handleChange(checked)}
                checked={checked}
                checkedIcon={false}
                uncheckedIcon={false}
                onColor='#4AF497'
                offColor='#ffffff'
                width={50}
                height={28}
                onHandleColor='#292929'
                offHandleColor='#292929'
            />
            <span className='label'>{label}</span>
        </label>
    )
}