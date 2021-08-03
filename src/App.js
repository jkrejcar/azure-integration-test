import React from "react";
import Grid from "@material-ui/core/Grid";
import { msalConfig } from "./authConfig";
import msTeamsLogo from "./images/msteams_icon.png";
import Search from "./components/Search.js";
import { useIsAuthenticated } from "@azure/msal-react";

import { MsalProvider, AuthenticatedTemplate } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";

export const msalInstance = new PublicClientApplication(msalConfig);

function ProtectedComponent() {
  const [showSearch, setShowSearch] = React.useState(true);
  const clickShowSearch = () => setShowSearch(!showSearch);

  const isAuthenticated = useIsAuthenticated();

  async function handleLogin(isAuthenticated) {
    if (!isAuthenticated) {
      try {
        await msalInstance.loginPopup();
      } catch (error) {
        console.log("User cancelled the flow.");
      }
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
      }
    } else {
      clickShowSearch();
    }
  }

  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={2}
    >
      <Grid item xs={2}>
        <img
          src={msTeamsLogo}
          alt="MS Teams LOGO"
          width="60"
          onClick={() => handleLogin(isAuthenticated)}
        />
      </Grid>
      <Grid item xs={10}>
        <AuthenticatedTemplate>
          {showSearch ? <Search /> : null}
        </AuthenticatedTemplate>
      </Grid>
    </Grid>
  );
}

const App = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <ProtectedComponent />
    </MsalProvider>
  );
};

export default App;
