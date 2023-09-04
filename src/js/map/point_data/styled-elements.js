import {styled} from "@mui/system";
import {TextField,Autocomplete} from "@mui/material";

export const StyledTextField = styled(TextField)(({theme}) => ({

}));

export const StyledAutocomplete = styled(Autocomplete)(({theme}) => ({
    '& .MuiAutocomplete-input': {
        fontSize: '14px',
        padding: '0px 4px 0px 6px !important',
    },
    '& .MuiAutocomplete-inputRoot':{
        paddingTop: '5px !important',
        paddingBottom: '3px !important'
    }
}));