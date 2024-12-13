import "bootstrap/dist/css/bootstrap.css";

import React from 'react';
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./routes/Index";
import Root from "./routes/Root";
import Account from "./routes/Account";
import Products from "./routes/Products";
import ProductDetail from "./routes/ProductDetail";
import Library from "./routes/Library";
import Callback from "./routes/Callback";
import Favorite from "./routes/Favorite";
import Cart from "./routes/Cart";

function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

function PageWithTitle({ title, element }) {
  useDocumentTitle(title);
  return element;
}

function ProductDetailWithTitle({ userId }) {
  const [title, setTitle] = useState("Products | The Record");

  return (
    <PageWithTitle
      title={title}
      element={
        <ProductDetail
          userId={userId}
          onProductLoad={(product) => {
            setTitle(`${product.type} | The Record`);
          }}
        />
      }
    />
  );
}

function App() {
  const [userId, setUserId] = useState(() => {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      return loggedInUser && loggedInUser.id ? loggedInUser.id : null;
  });

  useEffect(() => {
      console.log("App userId updated:", userId);
  }, [userId]);

  const router = createBrowserRouter([
    {
      element: <Root />,
      children: [
        {
          path: "/",
          element: <PageWithTitle title="Home | The Record" element={<Index />} />,
        },
        {
          path: "/products",
          element: <PageWithTitle title="Products | The Record" element={<Products />} />,
        },
        {
          path: "/products/:id",
          element: <ProductDetailWithTitle userId={userId} />,
        },
        {
          path: "/library",
          element: <PageWithTitle title="Library | The Record" element={<Library />} />,
        },
        {
          path: "/account",
          element: <PageWithTitle title="Account | The Record" element={<Account userId={userId} setUserId={setUserId} />} />,
        },
        {
          path: "/account/:userId",
          element: <PageWithTitle title="User Account | The Record" element={<Account userId={userId} setUserId={setUserId} />} />,
        },
        {
          path: "/callback",
          element: <PageWithTitle title="Callback | The Record" element={<Callback />} />,
        },
        {
          path: "/favorite",
          element: <PageWithTitle title="Favorites | The Record" element={<Favorite userId={userId} />} />,
        },
        {
          path: "/cart",
          element: <PageWithTitle title="Cart | The Record" element={<Cart userId={userId} />} />,
        },
      ],
    },
  ]);
  
  return <RouterProvider router={router} />
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
