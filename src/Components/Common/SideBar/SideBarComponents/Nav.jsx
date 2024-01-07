import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

const Nav = ({ destination, title}) => {

    const [location, setLocation] = useState(null); 
    const [destinationLocation, setdestinationLocation] = useState(null);

    useEffect(() => {
        setLocation(window.location.pathname);
        setdestinationLocation(`/${destination}`);
    }, [destination]);

    return (
        <li>
            <a href={`/${destination}`}
                className={`block py-2 px-4 rounded-lg text-center transition duration-300 ease-in-out hover:bg-gray-200 hover:shadow-md hover:text-black ${location === destinationLocation ? 'bg-primary text-white' : ' text-gray-700'}`}>

                {title}
            </a>
        </li>
    );
};

Nav.propTypes = {
    destination: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};

export default Nav;
