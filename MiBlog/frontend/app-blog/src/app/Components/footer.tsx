import React from "react";

const Footer = () => {
    return(
        <footer className="bg-gray-600 text-white py-4">
            <div className="container mx-auto text-center">
                <p>&copy;{new Date().getFullYear()} My Blog. All rights reserved.</p>
            </div>
        </footer>
    )
}
export default Footer;