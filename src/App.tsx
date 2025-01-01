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
        if (r) {
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
      <div className="extension">
        <div className="header">
          <h1>Token Grabber</h1>
          <span>Grab Your Token here.</span>
        </div>
        <div className="usage">
          <span className="usage-header">HOW TO USE</span>
          <p>
            Input the token name to copy the token. <br />
            Default value is <span className="emphasis">access_token</span>
          </p>
        </div>
        <div className="main">
          <div className="input">
            <label htmlFor="token-input">Token Name</label>
            <input
              type="text"
              placeholder="Enter your token name"
              id="token-input"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
            />
          </div>
          <button onClick={handleButtonClick}>Get Token</button>
        </div>

        <div className="footer">
          {showSucessToken && (
            <div className="success">Token is copied to clipboard.</div>
          )}
          {showErrorToken && <div className="error">Unable to find token.</div>}
        </div>
      </div>
    </>
  );
}

export default App;
