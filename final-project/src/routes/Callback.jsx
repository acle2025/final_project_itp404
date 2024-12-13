import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/authUtils";
import { faCompactDisc } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Callback() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    useEffect(() => {

        if (!code) {
            console.error("Authorization code not found in URL.");
            return;
        }

        getAccessToken(clientId, code)
            .then(({ accessToken }) => {
                console.log("Access Token in Callback.jsx:", accessToken);
                localStorage.setItem("spotify_access_token", accessToken);

                window.history.replaceState({}, document.title, "/library");
                navigate("/library");
            })
            .catch((error) => {
                console.error("Error fetching access token:", error);
                setError("Failed to authenticate. Please try again.");
            });
    }, [code, clientId, navigate]);

    return (
        <div className="text-secondary text-center my-5" role="status">
            <FontAwesomeIcon icon={faCompactDisc} spin size="2xl" style={{color: "#292929",}} />
            {" "}Processing Spotify login...
            {error ? <div className="error-message">{error}</div> : null}
        </div>
    );
}