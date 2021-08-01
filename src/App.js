import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { msalConfig } from "./authConfig";
import msTeamsLogo from "./images/msteams_icon.png";
import Search from "./components/Search.js";
import { useIsAuthenticated } from "@azure/msal-react";

import {
  MsalProvider,
  AuthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import {
  Configuration,
  PublicClientApplication,
  EventType,
} from "@azure/msal-browser";

export const msalInstance = new PublicClientApplication(msalConfig);



function ProtectedComponent() {
  const [showSearch, setShowSearch] = React.useState(true);
  const clickShowSearch = () => setShowSearch(!showSearch);

  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  function handleLogin(isAuthenticated) {
    if (!isAuthenticated) {
      msalInstance.loginPopup();
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
      }
    } else {
      clickShowSearch();
    }
  }

  return (
    <div style={{ marginLeft: "40px", marginTop: "10px" }}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <img
          src={msTeamsLogo}
          alt="MS Teams LOGO"
          style={{ maxWidth: "60px" }}
          onClick={() => handleLogin(isAuthenticated)}
        />
        <AuthenticatedTemplate>
          {showSearch ? <Search /> : null}
        </AuthenticatedTemplate>
      </Grid>
    </div>
  );
}

const App = () => {


  let inputRef;

  return (
    <MsalProvider instance={msalInstance}>
      <ProtectedComponent />
    </MsalProvider>
  );
};

export default App;
