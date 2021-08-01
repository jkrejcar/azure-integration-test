   
import { loginRequest, graphConfig } from "../authConfig";
import { msalInstance } from "../App";

export async function getPresence(userId) {

    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      msalInstance.setActiveAccount(accounts[0]);
    }

    const account = msalInstance.getActiveAccount();
    if (!account) {
        throw Error("No active account! Verify a user has been signed in and setActiveAccount has been called.");
    }

    const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0]
    });

    const headers = new Headers();
    const bearer = `Bearer ${response.accessToken}`;

    headers.append("Authorization", bearer);
    headers.append("ConsistencyLevel", "eventual")

    const options = {
        method: "GET",
        headers: headers
    };

    return fetch(graphConfig.graphPresenceEndpoint + userId + '/presence', options)
        .then(response => response.json())
        .then(data => {
            return data ;
          })
        .catch(error => console.log(error));
}