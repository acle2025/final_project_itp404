import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCompactDisc } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";

export default function Favorite({ userId }) {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = () => {
            fetch(`http://localhost:3001/favorites?userId=${userId}`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    setFavorites(data);
                })
        };

        if (!userId) {
            toast.error("Please log in.");
        } else {
            fetchFavorites();
        }
    }, [userId]);

    const handleUnfavorite = (item) => {
        const updatedFavorites = favorites.filter((fav) => fav.id !== item.id);
        setFavorites(updatedFavorites);

        fetch(`http://localhost:3001/favorites/${item.id}`, {
            method: "DELETE",
        })
    };

    if (!userId) {
        return (
            <div className="text-secondary text-center my-5" data-testid="favorites-empty-message">
                <h3>Please Log In To See Your Favorites!</h3>
                <FontAwesomeIcon icon={faCompactDisc} spin size="2xl" style={{color: "#292929"}} />
            </div>
        );
    }

    return (
        <div className="row g-3 py-3">
            {favorites.length > 0 ? (
                favorites.map((item) => (
                    <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
                        <div className="card h-100 shadow-sm">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="card-img-top"
                            />
                            <div className="card-body">
                                <h5 className="card-title">{item.name}</h5>
                                <p className="text-muted">Type: {item.type}</p>
                                <p className="text-muted">
                                    Favorited on:{" "}
                                    {item.hearted
                                        ? new Date(item.hearted).toLocaleString()
                                        : "Unknown"}
                                </p>
                                <button
                                    onClick={() => handleUnfavorite(item)}
                                    className="btn btn-danger"
                                >
                                    <FontAwesomeIcon icon={faHeart} /> Unfavorite
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="container text-center my-5">
                    <h3>You don't have any favorites yet <br/> Start adding some in the Library page!</h3>
                    <FontAwesomeIcon icon={faCompactDisc} spin size="2xl" style={{color: "#292929"}} />
                </div>
            )}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}