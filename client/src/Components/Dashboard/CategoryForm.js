import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const allCategories = ['Human Rights', 'Criminal','Economics', 'Religion']

export function ConfirmationDialogRaw(props) {
    const { onClose, value: valueProp, open, ...other } = props
    const [value, setValue] = React.useState(valueProp)
    const [options, setOptions]= React.useState(allCategories)
    const radioGroupRef = React.useRef(null)
    React.useEffect(() => {
        setOptions(allCategories)
        if (!open) {
            setValue(valueProp);
        }
        removalExistedCategoriesFromOptions(props.existedCategories)

    }, [valueProp, open]);

    const removalExistedCategoriesFromOptions = (existedCategories) =>{

        setOptions(allCategories.filter( ( el ) => !existedCategories.includes( el ) ));
    }

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
            radioGroupRef.current.focus();
        }
    };

    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        onClose(value)
    };

    const handleChange = event => {
        setValue(event.target.value);
    };

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            onEntering={handleEntering}
            aria-labelledby="confirmation-dialog-title"
            open={open}
            {...other}
        >
            <DialogTitle id="confirmation-dialog-title">Phone Ringtone</DialogTitle>
            <DialogContent dividers>
                <RadioGroup
                    ref={radioGroupRef}
                    aria-label="ringtone"
                    name="ringtone"
                    value={value}
                    onChange={handleChange}
                >
                    {options.map(option => (
                        <FormControlLabel value={option} key={option} control={<Radio />} label={option} />
                    ))}
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleOk} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ConfirmationDialogRaw.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
};


