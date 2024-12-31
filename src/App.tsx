import React from "react";
import "./App.css";
function App() {
  const [tokenName, setTokenName] = React.useState("access_token");
  const [showSucessToken, setShowSucessToken] = React.useState(false);
  const [showErrorToken, setShowErrorToken] = React.useState(false);
  const handleButtonClick = async () => {
    const [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id! },
        args: [tokenName],
        func: (tokenName) => {
          const tokenNameToFetch =
            tokenName.length > 0 ? tokenName : "access_token";
          const tokenFetched = window.localStorage.getItem(tokenNameToFetch);
          if (tokenFetched) {
            return tokenFetched;
          } else {
            return "";
          }
        },
      },
      (r) => {
        if (r[0].result) {
          navigator.clipboard.writeText(r[0].result);
          setShowSucessToken(true);
          setTimeout(() => {
            setShowSucessToken(false);
          }, 10000);
        } else {
          setShowErrorToken(true);
          setTimeout(() => {
            setShowErrorToken(false);
          }, 10000);
        }
      }
    );
    setShowErrorToken(false);
    setShowSucessToken(false);
  };
  return (
    <>
      <div
        className={`extension ${showSucessToken && "success"} ${
          showErrorToken && "error"
        }`}
      >
        <div>
          <h1>Token Grabber.</h1>
          <span>Grab Your Token here.</span>
        </div>
        <div>
          <p>
            Usage : Input the token name to copy the token. Default value is
            "access_token"
          </p>
        </div>
        <div>
          <input
            type="text"
            placeholder="Enter your token name"
            id="token-input"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
          />
          <button onClick={handleButtonClick}>Get Token</button>
        </div>

        <div>
          {showSucessToken && <p>Token is copied to clipboard.</p>}
          {showErrorToken && <p>Token not found.</p>}
        </div>
      </div>
    </>
  );
}

export default App;
