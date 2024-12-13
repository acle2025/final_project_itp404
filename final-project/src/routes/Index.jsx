import React from "react";
import { Carousel } from 'react-bootstrap';
import cover1 from "../assets/black_tshirt_back.png";
import cover2 from "../assets/tshirt_back.png";
import cover3 from "../assets/black_tshirt_front.png";
import cover4 from "../assets/tshirt_front.png";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Index() {
    return (
        <div className="index bg-dark text-light py-5">
            <div className="container text-center mb-5">
                <h1 className="display-4 fw-bold mb-3">Welcome to The Record!</h1>
                <p className="lead">
                    We create custom merchandise featuring your favorite artists and albums!
                </p>
            </div>

            <div className="container mb-5">
                <Carousel className="w-auto mx-auto" fade>
                    <Carousel.Item>
                        <img 
                            src={cover1} 
                            className="mx-auto d-block w-75" 
                            alt="Man wearing black t-shirt with 'Supernatural' album cover" 
                            style={{ height: '600px', objectFit: 'cover' }}
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img 
                            src={cover2} 
                            className="mx-auto d-block w-75" 
                            alt="Man wearing white t-shirt with 'Stranger in the Alps' album cover" 
                            style={{ height: '600px', objectFit: 'cover' }}
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img 
                            src={cover3} 
                            className="mx-auto d-block w-75" 
                            alt="Woman wearing black t-shirt with 'GNX' album cover" 
                            style={{ height: '600px', objectFit: 'cover' }}
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img 
                            src={cover4} 
                            className="mx-auto d-block w-75" 
                            alt="Man wearing white t-shirt with 'Tortured Poet Department' album cover" 
                            style={{ height: '600px', objectFit: 'cover' }}
                        />
                    </Carousel.Item>
                </Carousel>
            </div>

            <div className="container text-center bg-light text-dark py-5 shadow mb-0 border-0">
                <h3 className="fw-bold mb-4">How to Get Started:</h3>
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex align-items-center">
                            <span className="d-flex justify-content-center align-items-center me-3 p-3 fs-5">
                                1
                            </span>
                            Login or sign up on the <strong className="mx-1">Account</strong> page
                        </li>
                        <li className="list-group-item d-flex align-items-center">
                            <span className="d-flex justify-content-center align-items-center me-3 p-3 fs-5">
                                2
                            </span>
                            Connect your Spotify account via the <strong className="mx-1">Library</strong> page
                        </li>
                        <li className="list-group-item d-flex align-items-center">
                            <span className="d-flex justify-content-center align-items-center me-3 p-3 fs-5">
                                3
                            </span>
                            Search and <strong className="text-danger mx-1">heart</strong> any album or artist you love
                        </li>
                        <li className="list-group-item d-flex align-items-center">
                            <span className="d-flex justify-content-center align-items-center me-3 p-3 fs-5">
                                4
                            </span>
                            Visit the <strong className="mx-1">Shop</strong> page to select merchandise featuring your favorites
                        </li>
                    </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
