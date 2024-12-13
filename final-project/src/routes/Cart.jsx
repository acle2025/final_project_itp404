import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DOMPurify from "dompurify";

export default function Cart({ userId }) {
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [userInfo, setUserInfo] = useState({ fname: "", lname: "" });
    const [shippingAddress, setShippingAddress] = useState({
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
    });
    const [isGift, setIsGift] = useState(false);
    const [giftMessage, setGiftMessage] = useState("");
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3001/cart`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            return setCartItems(data.filter((item) => item.userId === userId));
        })

        fetch("http://localhost:3001/products")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            return setProducts(data); 
        })
        .catch(() => {
            toast.error("Failed to load products")
        });

        fetch(`http://localhost:3001/favorites?userId=${userId}`)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            setFavorites(data)
        })
        .catch(() => {
            toast.error("Failed to load favorites")
        });

        fetch(`http://localhost:3001/users/${userId}`)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            setUserInfo({ fname: data.fname, lname: data.lname });
            const address = data.shippingAddresses[0];
            if (address) {
            setShippingAddress(address);
            }
        })
        .catch(() => {
            toast.error("Failed to load user details");
        });
    }, [userId]);

    const getProductType = (productId) => {
        const product = products.find((product) => product.id === parseInt(productId));
        return product ? product.type : "Unknown Product";
    };

    const getFavoriteImage = (favoriteId) => {
        const favorite = favorites.find((favorite) => favorite.id === favoriteId);
        return favorite ? favorite.image : "placeholder.jpg";
    };
    
    const getItemPrice = (productId) => {
        const product = products.find((product) => product.id === parseInt(productId));
        return product ? product.price : 0;
    };

    const handleRemove = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    
        fetch(`http://localhost:3001/cart/${id}`, {
          method: "DELETE",
        })
        .then(() => {
            toast.success("Item removed from cart");
        })
        .catch(() => {
            toast.error("Failed to remove item");
        });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name.startsWith("shippingAddress.")) {
        const fieldName = name.split(".")[1];
        setShippingAddress((prev) => ({ ...prev, [fieldName]: value }));
        } else {
        setUserInfo((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleCheckout = (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (!form.checkValidity()) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        setValidated(false);

        const order = {
        userId,
        products: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            customizations: item.customizations,
        })),
        totalPrice: cartItems.reduce((total, item) => total + item.quantity * getItemPrice(item.productId), 0),
        shippingAddress,
        gift: isGift,
        giftMessage: isGift ? giftMessage : "",
        recipientName: isGift ? `${userInfo.fname} ${userInfo.lname}` : undefined,
        created: new Date().toLocaleString(),
        };

        fetch("http://localhost:3001/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
        })
        .then((response) => {
            return response.json();
        })
        .then(() => {
            toast.success("Order placed successfully!");
            setCartItems([]);
            setShippingAddress({
                street: "",
                city: "",
                state: "",
                zip: "",
                country: "",
        });
            setIsGift(false);
            setGiftMessage("");
            })
    };

    return (
        <div className="container py-4">
          <h1>Shopping Cart</h1>
          <div className="row">
            <div className="col-md-8">
              {cartItems.length > 0 ? (
                cartItems.map((item) => {
                  const itemPrice = getItemPrice(item.productId);
                  const productType = getProductType(item.productId);
                  const favoriteImage = item.favorite ? getFavoriteImage(item.favorite) : null;
      
                  return (
                    <div className="card mb-3 shadow-sm">
                        <div className="row g-0">
                            <div className="col-md-4 d-flex align-items-center">
                                {favoriteImage ? (
                                    <img
                                    src={favoriteImage}
                                    alt="Favorite Album"
                                    className="img-fluid w-100 ms-2 p-3"
                                    />
                                ) : (
                                    <div
                                    className="d-flex align-items-center justify-content-center bg-light w-100 h-100 text-muted"
                                    style={{ height: "200px" }}
                                    >
                                    No Image Available
                                    </div>
                                )}
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title"><strong>Product:</strong> {productType}</h5>
                                    <p className="card-text mb-1"><strong>Quantity:</strong> {item.quantity}</p>
                                    <p className="card-text mb-1"><strong>Price per Item:</strong> ${itemPrice}</p>
                                    <p className="card-text mb-3"><strong>Total Price:</strong> ${item.quantity * itemPrice}</p>
                                    <div className="card-text mb-3">
                                        <span className="fs-6">Customizations:</span> {JSON.stringify(item.customizations)}
                                    </div>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        data-testid={`remove-button-${item.id}`}
                                        onClick={() => handleRemove(item.id)}
                                    >
                                    Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                  );
                })
            ) : (
                <p data-testid="cart-empty-message">Your cart is empty.</p>
            )}
            </div>
            <div className="col-md-4">
                <h3>Recipient Information</h3>
                <form
                    className={`needs-validation ${validated ? "was-validated" : ""}`}
                    noValidate
                    onSubmit={handleCheckout}
                >
                    <div className="mb-3">
                        <label className="form-label">First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="fname"
                            value={userInfo.fname}
                            onChange={handleInputChange}
                            required
                            data-testid="first-name-input"
                        />
                        <div className="invalid-feedback">Please enter a first name.</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="lname"
                            value={userInfo.lname}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="invalid-feedback">Please enter a last name.</div>
                    </div>
                    <h3>Shipping Address</h3>
                    <div className="mb-3">
                        <label className="form-label">Street</label>
                        <input
                            type="text"
                            className="form-control"
                            name="shippingAddress.street"
                            value={shippingAddress.street}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="invalid-feedback">Please enter a street address.</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">City</label>
                        <input
                            type="text"
                            className="form-control"
                            name="shippingAddress.city"
                            value={shippingAddress.city}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="invalid-feedback">Please enter a city.</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">State</label>
                        <input
                            type="text"
                            className="form-control"
                            name="shippingAddress.state"
                            value={shippingAddress.state}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="invalid-feedback">Please enter a state.</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">ZIP Code</label>
                        <input
                            type="text"
                            className="form-control"
                            name="shippingAddress.zip"
                            value={shippingAddress.zip}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="invalid-feedback">Please enter a ZIP code.</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Country</label>
                        <input
                            type="text"
                            className="form-control"
                            name="shippingAddress.country"
                            value={shippingAddress.country}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="invalid-feedback">Please enter the United States.</div>
                    </div>
                    <div className="form-check mb-3">
                    <input
                    type="checkbox"
                    className="form-check-input"
                    id="isGift"
                    checked={isGift}
                    onChange={(event) => {
                        setIsGift(event.target.checked);
                    }}
                    />
                    <label className="form-check-label" htmlFor="isGift">
                    Is this a gift?
                    </label>
                    </div>
                    {isGift && (
                        <div className="mb-3">
                        <label className="form-label">Gift Message</label>
                        <textarea
                            className="form-control"
                            value={giftMessage}
                            onChange={(event) => {
                                const sanitizedMessage = DOMPurify.sanitize(event.target.value);
                                setGiftMessage(sanitizedMessage);
                            }}
                        />
                        </div>
                    )}
                    <button className="btn btn-primary w-100" type="submit">
                        Checkout
                    </button>
                </form>
            </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}