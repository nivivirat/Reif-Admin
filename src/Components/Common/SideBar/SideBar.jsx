import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import Nav from "./SideBarComponents/Nav";

export default function SideBar() {
    const [isOpen, setIsOpen] = useState(true);
    const [location, setLocation] = useState(null);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        setLocation(window.location.pathname.slice(1)); // Remove the leading '/'
    }, []);

    return (
        <div className="fixed top-0 left-0 z-20">
            <div className={`${isOpen ? 'w-[300px] h-screen' : 'w-screen h-[80px]'} transition-all duration-500`}>

                {!isOpen ? (
                    <div className="flex flex-row justify-between border-b bg-base shadow-lg">
                        <div className="flex flex-row">
                            <button
                                className="text-primary text-3xl p-4"
                                onClick={toggleSidebar}
                            >
                                <Icon icon="iconamoon:menu-burger-horizontal-duotone" />
                            </button>
                            <h1 className="text-2xl font-bold p-4">{location}</h1>
                        </div>
                        <img className='sm:h-[60px] sm:w-[100px] h-6 w-10 mr-10' src='https://res.cloudinary.com/dzhdarh4q/image/upload/v1699014385/Reifenhauser/ReifenhauserLogo_hhc7wi.svg' alt='Logo' />
                    </div>
                ) : (

                    // side bar
                    <div className="bg-base h-full z-50 p-3">
                        <div className="flex flex-row justify-between">
                            <img className='sm:h-[45px] sm:w-[90px] h-6 w-10' src='https://res.cloudinary.com/dzhdarh4q/image/upload/v1699014385/Reifenhauser/ReifenhauserLogo_hhc7wi.svg' alt='Logo' />
                            <button className="text-primary text-3xl p-4" onClick={toggleSidebar} >
                                <Icon icon="tabler:x" />
                            </button>
                        </div>

                        <div>
                            <ul className='flex flex-col gap-5 mt-5'>
                                <Nav title={"Home"} destination={"Home"} />
                                <Nav title={"About Us"} destination={"AboutUs"} />
                                <Nav title={"Services"} destination={"Aervices"} />
                                <Nav title={"Principals"} destination={"Principals"} />
                                <Nav title={"Events"} destination={"Events"} />
                                <Nav title={"Media"} destination={"Media"} />
                                <Nav title={"Careers"} destination={"Careers"} />
                                <Nav title={"Contact us"} destination={"ContactUs"} />
                            </ul>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
