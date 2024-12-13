import React from "react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { redirectToAuthCodeFlow } from "../utils/authUtils";

export default function Library() {
    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("album");
    const [results, setResults] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const accessToken = localStorage.getItem("spotify_access_token");
    const expirationTime = localStorage.getItem("token_expiration_time");

    useEffect((accessToken, expirationTime) => {
        if (accessToken && Date.now() < parseInt(expirationTime, 10)) {
            setIsLoggedIn(true);
        }

        fetchFavorites();
    }, [clientId]);

    const fetchFavorites = () => {
        fetch("http://localhost:3001/favorites")
        .then((response) => response.json())
        .then((data) => {
            setFavorites(data);
        })
    };    

    const handleLogin = () => {
        redirectToAuthCodeFlow(clientId);
    };

    const handleSearch = () => {
        setLoading(true);
        setError(null);
    
        if (!accessToken || Date.now() >= parseInt(expirationTime, 10)) {
            console.error("Access token is missing or expired. Redirecting to login...");
            setLoading(false);
            setError("Access token invalid or expired.");
            return;
        }
    
        fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(search)}&type=${searchType}`, {
            headers: { 
                Authorization: `Bearer ${accessToken}` 
            },
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            setResults(searchType === "album" ? data.albums.items : data.artists.items);
            setLoading(false);
        })
    };

    const handleFavorite = async (item) => {
        const currentTime = new Date().toLocaleString();
    
        const favoriteData = {
            id: item.id,
            type: searchType,
            name: item.name,
            image: item.images[0]?.url || null,
            hearted: currentTime,
        };
    
        if (isFavorite(item)) {
            setFavorites(favorites.filter((fav) => fav.id !== item.id));
    
            const response = await fetch(`http://localhost:3001/favorites/${item.id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to remove favorite");
        } else {
            setFavorites([...favorites, favoriteData]);
    
            const response = await fetch("http://localhost:3001/favorites", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify(favoriteData),
            });

            if (!response.ok) {
                throw new Error("Failed to add favorite");
            }
        }
    };      

    const isFavorite = (item) => favorites.some((fav) => fav.id === item.id);

    return (
        <div className="container mt-4">
            {!isLoggedIn ? (
                <div className="text-center">
                    <h1>Welcome to Spotify Search</h1>
                    <button onClick={handleLogin} className="btn btn-primary mt-3">
                        Log into Spotify
                    </button>
                </div>
            ) : (
                <>
                    <h1 className="mb-4">Spotify Search</h1>

                    {error ? <div className="alert alert-danger">{error}</div> : null}

                    <div className="row mb-4">
                        <div className="col-md-8">
                            <input
                                type="text"
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                }}
                                placeholder={`Search for a ${searchType}`}
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-2">
                            <select
                                value={searchType}
                                onChange={(event) => {
                                    setSearchType(event.target.value);
                                }}
                                className="form-select"
                            >
                                <option value="album">Album</option>
                                <option value="artist">Artist</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button onClick={handleSearch} className="btn btn-primary w-100">
                                Search
                            </button>
                        </div>
                    </div>

                    {loading ? <div className="text-center">Loading...</div> : null}

                    {results.length === 0 && !loading ? (
                        <div className="text-center text-muted">
                            No results found. Try a different search.
                        </div>
                    ) : null}

                    <div className="row g-3">
                        {results.map((item) => (
                            <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
                                <div className="card h-100 shadow-sm">
                                    <img
                                        src={item.images[0]?.url}
                                        alt={item.name}
                                        className="card-img-top"
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{item.name}</h5>
                                        <button
                                            onClick={() => {
                                                handleFavorite(item);
                                            }}
                                            className={`btn ${
                                                isFavorite(item) ? "btn-danger" : "btn-outline-danger"
                                            }`}
                                        >
                                            <FontAwesomeIcon icon={faHeart} />{" "}
                                            {isFavorite(item) ? "Unfavorite" : "Favorite"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}