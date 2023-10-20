import {styled} from "@mui/system";
import {TextField,Autocomplete} from "@mui/material";
import {Chip} from "@mui/material";

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

export const StyledChip = styled(Chip)(({ theme }) => ({
    background: "#2F2F2F",
    color: "#FFF",
    fontSize: "10px",
    fontStyle: "normal",
    fontWeight: "400",
    '& .MuiChip-deleteIcon': {
        color: '#FFFFFF',
        '&:hover': {
            color: '#FFFFFF',
          }
      }
  }));