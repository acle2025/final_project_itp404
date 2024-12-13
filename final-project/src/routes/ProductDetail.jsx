import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompactDisc } from "@fortawesome/free-solid-svg-icons";

import tshirt1a from "../assets/black_tshirt_front_mockup.jpg";
import tshirt1b from "../assets/black_tshirt_back_mockup.jpg";
import tshirt1c from "../assets/black_tshirt_back_mockup1.png";
import tshirt1d from "../assets/black_tshirt_front_mockup1.png";
import tshirt2a from "../assets/tshirt_front_mockup.jpg";
import tshirt2b from "../assets/tshirt_back_mockup.jpg";
import tshirt2c from "../assets/tshirt_front_mockup1.jpeg";
import tshirt2d from "../assets/tshirt_back_mockup1.jpeg";
import hoodie1 from "../assets/black_hoodie_mockup.jpeg";
import hoodie2 from "../assets/hoodie_mockup.jpeg";
import tote1 from "../assets/black_totebag_mockup.jpg";
import tote2 from "../assets/totebag_mockup.jpg";
import keychain from "../assets/keychain_mockup.jpg";
import poster from "../assets/poster_mockup.jpg";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

const productData = {
  1: {
    type: "T-Shirt Front",
    price: 21,
    customizations: ["Size: ", "Color: "],
    images: [tshirt1a, tshirt1d, tshirt2a, tshirt2c],
  },
  2: {
    type: "T-Shirt Back",
    price: 21,
    customizations: ["Size: ", "Color: "],
    images: [tshirt1b, tshirt1c, tshirt2b, tshirt2d],
  },
  3: {
    type: "Hoodie",
    price: 35,
    customizations: ["Size: ", "Color: "],
    images: [hoodie1, hoodie2],
  },
  4: {
    type: "Tote Bag",
    price: 17,
    customizations: ["Material: ", "Color: "],
    images: [tote1, tote2],
  },
  5: {
    type: "Poster",
    price: 17,
    customizations: ["Size: "],
    images: [poster],
  },
  6: {
    type: "Keychain",
    price: 5,
    customizations: ["Material: "],
    images: [keychain],
  },
};

export default function ProductDetail({ userId }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [selectedFavorite, setSelectedFavorite] = useState();
  const [customizations, setCustomizations] = useState({
    size: "",
    color: "",
    material: "",
  });
  const [quantity, setQuantity] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const product = productData[id];
    if (product) {
      setProduct(product);
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      document.title = `${product.type} | The Record`;
    }
  }, [product]);

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:3001/favorites?userId=${userId}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          return setFavorites(data);
        })
    }
  }, [userId]);

  const handleCustomizationChange = (event) => {
    const { name, value } = event.target;
    setCustomizations((prev) => ({ ...prev, [name]: value }));
  };

  if (!product) {
    return (
      <div className="text-secondary text-center" role="status">
          <FontAwesomeIcon icon={faCompactDisc} spin size="2xl" style={{color: "#292929",}} />
          {" "}Loading...
      </div>
    );
  }

  const handleAddToCart = (quantity) => {
    setFormSubmitted(true);
    const missingFields = [];

    product.customizations.forEach((customization) => {
      const key = customization.toLowerCase().replace(": ", "");
      if (!customizations[key]) {
        missingFields.push(customization);
      }
    });

    if (!selectedFavorite) {
      missingFields.push("Favorite Album/Artist");
    }

    if (missingFields.length > 0) {
      toast.error("Please fill in all of the options");
      return;
    }

    fetch("http://localhost:3001/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        productId: id,
        customizations,
        favorite: selectedFavorite,
        quantity: quantity,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        toast.success("Item added to cart!", data);
      })
      .catch(() => {
        toast.error("Failed to add item to cart. Please try again.");
      });
  };
  
  return (
    <div className="container py-3">
      <button 
        className="btn btn-link text-decoration-none mb-4" 
        onClick={() => {
          navigate("/products")
        }}>
        &#8592; Back to Products
      </button>
      <h1 className="mb-4">{product.type}</h1>
      <div className="row">
        <div className="col-md-6 position-relative">
          <Carousel data-bs-theme="dark">
            {product.images.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={image}
                  alt={`Slide ${index + 1}`}
                  style={{ objectFit: "cover", height: "400px" }}
                />
                {selectedFavorite && (
                  <img
                    src={favorites.find((favorite) => favorite.id === selectedFavorite)?.image}
                    alt="Selected Favorite Overlay"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "130px",
                      height: "130px",
                      opacity: 0.85
                    }}
                  />
                )}
              </Carousel.Item>
            ))}
          </Carousel>
          <p className="text-secondary">*This is a represenation, not the real product</p>
        </div>
        <div className="col-md-6">
          <h3>Price: ${product.price}</h3>
            

          <h5 className="mt-4">Customize Your Product:</h5>
          <form>
            {product.customizations.map((customization) => {
              if (customization === "Size: ") {
                return (
                  <div className="mb-3" key="size">
                    <label htmlFor="size" className="form-label">Size</label>
                    <select
                      id="size"
                      name="size"
                      className={`form-select ${formSubmitted && !customizations.size ? "is-invalid" : ""}`}
                      value={customizations.size || ""}
                      onChange={handleCustomizationChange}
                      data-testid="size-select"
                    >
                      <option value="">Select a size</option>
                      {product.type === "Poster" ? (
                        <>
                          <option value="Square-Matte">Square -- Matte Finish</option>
                          <option value="Rectangle-Gloss">Rectangle -- Matte Finish</option>
                          <option value="Square-Gloss">Square -- Glossy Finish</option>
                          <option value="Rectangle-Gloss">Rectangle -- Glossy Finish</option>
                        </>
                      ) : (
                        <>
                          <option value="XS">Extra Small</option>
                          <option value="S">Small</option>
                          <option value="M">Medium</option>
                          <option value="L">Large</option>
                          <option value="XL">Extra Large</option>
                        </>
                      )}
                    </select>
                    <div className="invalid-feedback">
                      Please select a size.
                    </div>
                  </div>
                );
              }

              if (customization === "Color: ") {
                return (
                  <div className="mb-3" key="color">
                    <p>Color</p>
                    <div className={`form-check form-check-inline ${formSubmitted && !customizations.color ? "is-invalid" : ""}`}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="color"
                        id="color-black"
                        value="Black"
                        onChange={handleCustomizationChange}
                        checked={customizations.color === "Black"}
                      />
                      <label className="form-check-label" htmlFor="color-black">
                        Black
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="color"
                        id="color-white"
                        value="White"
                        onChange={handleCustomizationChange}
                        checked={customizations.color === "White"}
                      />
                      <label className="form-check-label" htmlFor="color-white">
                        White
                      </label>
                    </div>
                    <div className="invalid-feedback">
                      Please select a color.
                    </div>
                  </div>
                );
              }

              if (customization === "Material: ") {
                return (
                  <div className="mb-3" key="material">
                    <p>Material</p>
                    {product.type === "Keychain" ? (
                      <>
                        <div className={`form-check ${formSubmitted && !customizations.material ? "is-invalid" : ""}`}>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="material"
                            id="material-metal"
                            value="Metal"
                            onChange={handleCustomizationChange}
                            checked={customizations.material === "Metal"}
                          />
                          <label className="form-check-label" htmlFor="material-metal">
                            Stainless Steel
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="material"
                            id="material-plastic"
                            value="Plastic"
                            onChange={handleCustomizationChange}
                            checked={customizations.material === "Plastic"}
                          />
                          <label className="form-check-label" htmlFor="material-plastic">
                            Acrylic
                          </label>
                        </div>
                        <div className="invalid-feedback">Please select a material.</div>
                      </>
                    ) : (
                      <>
                        <div className={`form-check ${formSubmitted && !customizations.material ? "is-invalid" : ""}`}>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="material"
                            id="material-cotton"
                            value="Cotton"
                            onChange={handleCustomizationChange}
                            checked={customizations.material === "Cotton"}
                          />
                          <label className="form-check-label" htmlFor="material-cotton">
                            Cotton
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="material"
                            id="material-canvas"
                            value="Canvas"
                            onChange={handleCustomizationChange}
                            checked={customizations.material === "Canvas"}
                          />
                          <label className="form-check-label" htmlFor="material-canvas">
                            Canvas
                          </label>
                        </div>
                        <div className="invalid-feedback">Please select a material.</div>
                      </>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </form>

          <h5 className="mt-4">Your Favorite Albums/Artists:</h5>
          {!userId ? (
            <p className="text-danger">Sign in to see your favorites.</p>
          ) : favorites.length === 0  ? (
            <p>No favorites found. Add some in your library!</p>
          ) : (
            <div>
              <select
                className="form-select"
                onChange={(event) => {
                  setSelectedFavorite(event.target.value);
                }}
                value={selectedFavorite || ""}
              >
                <option value="">
                  Select a favorite album/artist
                </option>
                {favorites.map((favorite) => (
                  <option key={favorite.id} value={favorite.id}>
                    {favorite.name}
                  </option>
                ))}
              </select>

              <div className="mt-4 row">
                <h6>Selected Favorite:</h6>
                <img
                  src={favorites.find((favorite) => favorite.id === selectedFavorite)?.image}
                  alt="Selected Favorite"
                  className="img-fluid w-50"
                />
              </div>
            </div>
          )}

          <Counter onQuantityChange={setQuantity}/>

          <button 
            className="btn btn-primary mt-4" 
            onClick={() => {
              handleAddToCart(quantity);
            }}
            data-testid="add-to-cart-button"
          >
            Add to Cart
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

function Counter({ onQuantityChange }) {
  const [count, setCount] = useState(1);

  const handleDecrement = () => {
    if (count > 1) {
      const newCount = count - 1;
      setCount(newCount);
      onQuantityChange(newCount);
    }
  };

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    onQuantityChange(newCount);
  };

  return (
    <div className="d-flex align-items-center mt-3">
      <button 
        className="btn btn-outline-secondary" 
        onClick={handleDecrement}
        data-testid="decrement-button"
      >
        –
      </button>
      <span className="mx-3 fs-5">{count}</span>
      <button 
        className="btn btn-outline-secondary" 
        onClick={handleIncrement}
        data-testid="increment-button"
      >
        +
      </button>
    </div>
  );
}