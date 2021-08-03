import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import Brightness1Icon from "@material-ui/icons/Brightness1";
import { green, red, orange, grey } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import CallIcon from "@material-ui/icons/Call";
import { searchUsers } from "../msgraph/searchUsers.js";
import { getPresence } from "../msgraph/getPresence.js";
import CircularProgress from "@material-ui/core/CircularProgress";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

export default function Search() {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const [buttonDisable, setButtonDisable] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const loading = open && options.length === 0 && inputValue.length > 0;

  function buttonEnable(value) {
    if (value) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  }

  React.useEffect(() => {
    
    let newOptions = [];
    let arrayLenght = 0;

    if (inputValue.length > 0) {
      (async () => {
        let usersResponse = await searchUsers(inputValue);

        if (usersResponse.value.length > 10) {
          arrayLenght = 10
        } else {
          arrayLenght = usersResponse.value.length
        }

        for (var i = 0; i < arrayLenght; i++) {
          let presenceResponse = await getPresence(usersResponse.value[i].id);
          newOptions.push({displayName: usersResponse.value[i].displayName, availability: presenceResponse.availability});
        }
        setOptions(newOptions);
        newOptions = [];
      })();
    } else {
      setOptions(newOptions);
    }

  }, [inputValue, loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Grid
      width="410"
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={1}
    >
      <Grid item xs={9}>
        <Autocomplete
          id="msteams-presense-search"
          width="300"
          autoComplete
          autoHighlight
          options={options}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          loading={loading}
          getOptionLabel={(option) => option.displayName}
          onChange={(event, value) => buttonEnable(value)}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Search"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
          renderOption={(option) => {
            let indicator;

            if (option.availability === "Available") {
              indicator = (
                <CheckCircleIcon
                  fontSize="small"
                  style={{ color: green[400], marginRight: "5px" }}
                />
              );
            }
            if (option.availability === "Away" || option.availability === "BeRightBack") {
              indicator = (
                <WatchLaterIcon
                  fontSize="small"
                  style={{ color: orange[400], marginRight: "5px" }}
                />
              );
            }
            if (option.availability === "DoNotDisturb") {
              indicator = (
                <RemoveCircleIcon
                  fontSize="small"
                  style={{ color: red[400], marginRight: "5px" }}
                />
              );
            }
            if (option.availability === "Busy") {
              indicator = (
                <Brightness1Icon
                  fontSize="small"
                  style={{ color: red[400], marginRight: "5px" }}
                />
              );
            }

            if (!option.availability || option.availability === "" || option.availability === "PresenceUnknown" || option.availability === "Offline") {
              indicator = (
                <HighlightOffIcon
                  fontSize="small"
                  style={{ color: grey[400], marginRight: "5px" }}
                />
              );
            }

            return (
              <Grid container alignItems="center">
                {indicator}
                {option.displayName}
              </Grid>
            );
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <Button
          variant="contained"
          color="primary"
          disabled={buttonDisable}
          startIcon={<CallIcon />}
        >
          Call
        </Button>
      </Grid>
    </Grid>
  );
}
