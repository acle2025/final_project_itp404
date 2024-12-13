import cover5 from "../assets/merch.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { faCompactDisc } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Account({ userId, setUserId }) {
    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");    
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("loggedInUser");
        if (storedUser && !userId) {
            const parsedUser = JSON.parse(storedUser)
            setUserId(parsedUser.id);
            localStorage.setItem("userId", parsedUser.id);
            navigate(`/account/${parsedUser.id}`, {replace: true});
        }
    }, [userId, setUserId, navigate]);

    const handleSubmit = (event) => {
        event.preventDefault();
    
        fetch('http://localhost:3001/users')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const matchUser = data.find(
                (user) => user.email === email && user.password === password
            );

            if (matchUser) {
                setUserId(matchUser.id);
                localStorage.setItem("loggedInUser", JSON.stringify(matchUser));
                navigate(`/account/${matchUser.id}`);
                setError("");
            } else {
                setError('Invalid email or password.');
            }
        })
    
        setValidated(true);
    };

    const handleLogout = () => {
        setUserId(null);
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("refresh_token");
        navigate("/account");
    };

    if (userId) {
        return <UserAccount userId={userId} onLogout={handleLogout} />;
    }

    return (
        <div className="container-fluid">
            <div className="row w-75 h-auto mx-auto my-5">
                <div className="col-6">
                    <img src={cover5} alt="Woman wearing tshirt" className="img-fluid" />
                </div>
                
                <div className="col-5 d-flex align-items-center text-start ms-5">
                    <div>
                        <h1>Welcome Back!</h1>
                        <p>
                            Don't have an account?
                            <button 
                                className="btn btn-link link-info mb-1" 
                                data-bs-toggle="modal" 
                                data-bs-target="#registerModal"
                            >
                                Sign Up
                            </button>
                        </p>
                        <form 
                            className={`needs-validation ${validated ? "was-validated" : ""}`}
                            noValidate
                            onSubmit={handleSubmit}
                        >
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input 
                                    type="text" 
                                    id="email" 
                                    className="form-control" 
                                    name="email" 
                                    placeholder="ttrojan@usc.edu" 
                                    required
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                    }}
                                />
                                <div className="invalid-feedback">
                                    Please enter a valid email address.
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password-login">Password</label><br />
                                <input
                                    type="text"
                                    id="password-login"
                                    className="form-control"
                                    name="password"
                                    placeholder="usc"
                                    required
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                    }}
                                />
                                <div className="invalid-feedback">
                                    Password is required.
                                </div>
                            </div>
                            <button className="btn btn-dark w-100 p-2" type="submit">
                                Login
                            </button>
                        </form>
                        <p className="text-danger" data-testid="login-error-message">{error ? error : null}</p>
                    </div>
                </div>
            </div>
            <Register />
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [feedback, setFeedback] = useState("");
    const [validated, setValidated] = useState(false);

    const handleRegister = (event) => {
        event.preventDefault();

        const form = event.currentTarget;

        if (!form.checkValidity()) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        const newUser = { email, password, fname, lname };

        fetch("http://localhost:3001/users")
        .then((response) => {
            return response.json();
        })
        .then((users) => {
            const duplicateEmails = users.filter((user) => user.email === email);

            if (duplicateEmails.length > 0) {
                toast.error("This email is already in use. Please use a different email.")
            } else {
                fetch('http://localhost:3001/users', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newUser),
                })
                .then((response) => {
                    return response.json();
                })
                .then(() => {
                    toast.success("Account created successfully!");
                    setFeedback("Account created successfully!");
                    setEmail("");
                    setPassword("");
                    setFname("");
                    setLname("");

                    setValidated(false);
                });
            }
        });
    };

    return (
        <div
            className="modal fade"
            id="registerModal"
            tabIndex="-1"
            aria-labelledby="registerModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="registerModalLabel">Register</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form
                            className={`needs-validation ${validated ? "was-validated" : ""}`}
                            noValidate
                            onSubmit={handleRegister}
                        >
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="fname" className="form-label">First Name<span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="fname"
                                        placeholder="Bob"
                                        value={fname}
                                        onChange={(event) => {
                                            setFname(event.target.value);
                                        }}
                                        required
                                    />
                                    <div className="invalid-feedback">Please enter your first name.</div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="lname" className="form-label">Last Name<span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lname"
                                        placeholder="Smith"
                                        value={lname}
                                        onChange={(event) => {
                                            setLname(event.target.value);
                                        }}
                                        required
                                    />
                                    <div className="invalid-feedback">Please enter your last name.</div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="registerEmail" className="form-label">Email<span className="text-danger">*</span></label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="registerEmail"
                                    placeholder="bobsmith@gmail.com"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                    }}
                                    required
                                />
                                <div className="invalid-feedback">Please enter a valid email address.</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="registerPassword" className="form-label">Password<span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="registerPassword"
                                    placeholder="bsmith1234"
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                    }}
                                    required
                                />
                                <div className="invalid-feedback">Password is required.</div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Register
                                </button>
                            </div>
                        </form>
                        {feedback && (
                            <p className={`mt-3 ${feedback.includes("successfully") ? "text-success" : "text-danger"}`}>
                                {feedback}
                            </p>                        
                        )}
                        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                    </div>
                </div>
            </div>
        </div>
    );
}

function UserAccount({ userId, onLogout }) {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        password: '',
        shippingAddress: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: '',
        },
    });
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("loggedInUser");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setFormData({
                fname: parsedUser.fname,
                lname: parsedUser.lname,
                email: parsedUser.email,
                password: parsedUser.password,
                shippingAddress: parsedUser.shippingAddresses?.[0] || {
                    street: '',
                    city: '',
                    state: '',
                    zip: '',
                    country: '',
                },
            });
        } else {
            fetch(`http://localhost:3001/users/${userId}`)
            .then((response) => {
                return response.json();
            })
            .then((userData) => {
                setUser(userData);
                setFormData({
                    fname: userData.fname,
                    lname: userData.lname,
                    email: userData.email,
                    password: userData.password,
                    shippingAddress: userData.shippingAddresses?.[0] || {
                        street: '',
                        city: '',
                        state: '',
                        zip: '',
                        country: '',
                    },
                });
                localStorage.setItem("loggedInUser", JSON.stringify(userData));
            });
        }
    }, [userId]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
    
        if (name.startsWith('shippingAddress.')) {
            const addressField = name.split('.')[1];
            
            const updatedShippingAddress = {
                street: formData.shippingAddress.street,
                city: formData.shippingAddress.city,
                state: formData.shippingAddress.state,
                zip: formData.shippingAddress.zip,
                country: formData.shippingAddress.country,
            };

            updatedShippingAddress[addressField] = value;

            setFormData({
                fname: formData.fname,
                lname: formData.lname,
                email: formData.email,
                password: formData.password,
                shippingAddress: updatedShippingAddress,
            });
        } else {
            const updatedFormData = {
                fname: formData.fname,
                lname: formData.lname,
                email: formData.email,
                password: formData.password,
                shippingAddress: formData.shippingAddress,
            };
            
            updatedFormData[name] = value;
            setFormData(updatedFormData);
        }
    };

    const handleSave = (event) => {
        event.preventDefault();

        fetch(`http://localhost:3001/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fname: formData.fname,
                lname: formData.lname,
                email: formData.email,
                password: formData.password,
                shippingAddresses: [formData.shippingAddress],
            }),
        })
        .then((response) => {
            return response.json();
        })
        .then((updatedUser) => {
            setUser(updatedUser);
            toast.success("Account information updated successfully!");
            setFeedback("Account information updated successfully!");
            localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
        })
        .catch(() => {
            toast.error("Error updating account information.");
        });
    };

    if (!user) {
        return (
            <div className="text-secondary text-center my-5" role="status">
                <FontAwesomeIcon icon={faCompactDisc} spin size="2xl" style={{color: "#292929",}} />
                {" "}Loading...
                <p>Try refreshing the page</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h1>Manage Your Account</h1>
            <form onSubmit={handleSave} className="mt-4">
                <div className="row">
                    <div className="col-md-6">
                        <h4>User Information</h4>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="fname" className="form-label">First Name</label>
                                <input
                                    type="text"
                                    id="fname"
                                    name="fname"
                                    className="form-control"
                                    value={formData.fname}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="lname" className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    id="lname"
                                    name="lname"
                                    className="form-control"
                                    value={formData.lname}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="text"
                                id="password"
                                name="password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <h4>Shipping Address</h4>
                        <div className="mb-3">
                            <label htmlFor="shippingAddress.street" className="form-label">Street</label>
                            <input
                                type="text"
                                id="shippingAddress.street"
                                name="shippingAddress.street"
                                className="form-control"
                                value={formData.shippingAddress.street}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="shippingAddress.city" className="form-label">City</label>
                            <input
                                type="text"
                                id="shippingAddress.city"
                                name="shippingAddress.city"
                                className="form-control"
                                value={formData.shippingAddress.city}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label htmlFor="shippingAddress.state" className="form-label">State</label>
                                <input
                                    type="text"
                                    id="shippingAddress.state"
                                    name="shippingAddress.state"
                                    className="form-control"
                                    value={formData.shippingAddress.state}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="shippingAddress.zip" className="form-label">ZIP</label>
                                <input
                                    type="text"
                                    id="shippingAddress.zip"
                                    name="shippingAddress.zip"
                                    className="form-control"
                                    value={formData.shippingAddress.zip}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="shippingAddress.country" className="form-label">Country</label>
                                <input
                                    type="text"
                                    id="shippingAddress.country"
                                    name="shippingAddress.country"
                                    className="form-control"
                                    value={formData.shippingAddress.country}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                    Save Changes
                </button>
            </form>
            <p className="text-success mt-3">{feedback ? feedback : null}</p>
            <button className="btn btn-danger mt-4" onClick={onLogout}>
                Logout
            </button>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}