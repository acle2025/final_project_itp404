import { Outlet } from "react-router-dom";
import Navigation from "../Navigation";
import Footer from "../Footer";

export default function Root() {
    return (
        <div className="container">
            <Navigation />
            <Outlet />
            <Footer />
        </div>
    );
}