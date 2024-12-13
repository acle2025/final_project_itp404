import React from "react";
import { Link } from "react-router-dom";
import tshirt1a from "../assets/black_tshirt_front_mockup.jpg";
import tshirt1b from "../assets/black_tshirt_back_mockup.jpg";
import hoodie1 from "../assets/black_hoodie_mockup.jpeg";
import tote2 from "../assets/totebag_mockup.jpg";
import keychain from "../assets/keychain_mockup.jpg";
import poster from "../assets/poster_mockup.jpg";

export default function Products() {
  const products = [
    { id: 1, image: tshirt1a, name: "T-shirt Front Design", price: 21 },
    { id: 2, image: tshirt1b, name: "T-shirt Back Design", price: 21 },
    { id: 3, image: hoodie1, name: "Hoodie Design", price: 35 },
    { id: 4, image: tote2, name: "Tote Bag", price: 17 },
    { id: 5, image: poster, name: "Poster", price: 17 },
    { id: 6, image: keychain, name: "Key Chain", price: 5 },
  ];

  return (
    <div className="container py-3">
      <h1>Merchandise:</h1><br />
      <div className="row g-4">
        {products.map((product) => (
          <div className="col-md-4 col-sm-6" key={product.id}>
            <Product
              id={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Product({ id, image, name, price }) {
  return (
    <Link to={`/products/${id}`} data-testid={`product-link-${id}`} className="text-decoration-none">
      <div className="card h-100 shadow-sm border-0">
        <img
          className="card-img-top"
          src={image}
          alt={`${name}`}
          style={{ objectFit: "cover", height: "300px" }}
        />
        <div className="card-body text-center">
          <h5 className="card-title">{name}</h5>
          <p className="card-text text-muted">Price: ${price}</p>
        </div>
      </div>
    </Link>
  );
}