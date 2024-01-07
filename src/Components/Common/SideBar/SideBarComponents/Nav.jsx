import { useEffect, useState } from "react";

const Nav = ({ title }) => {

    const [location, setLocation] = useState(null);
    const [titleLocation, setTitleLocation] = useState(null);

    useEffect(() => {
        setLocation(window.location.pathname);
        setTitleLocation(`/${title}`);
    }, [title]);

    console.log(location);
    console.log(titleLocation);


    return (
        <li>
            <a href={`/${title}`}
                className={`block py-2 px-4 rounded-lg text-center transition duration-300 ease-in-out hover:bg-gray-200 hover:shadow-md hover:text-black ${location === titleLocation ? 'bg-primary text-white' : ' text-gray-700'}`}>

                {title}
            </a>
        </li>
    );
};

export default Nav;
