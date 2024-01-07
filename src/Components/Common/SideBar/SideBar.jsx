import { Icon } from "@iconify/react";
import { useState } from "react";
import Nav from "./SideBarComponents/Nav";

export default function SideBar() {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed top-0 left-0 h-full z-10">
            <div className={`${isOpen ? 'w-[300px] h-screen' : 'w-screen h-[100px]'} transition-all duration-500`}>

                {!isOpen ? (
                    <div className="flex flex-row justify-between">
                        <div>
                            <button
                                className="text-primary text-3xl p-4"
                                onClick={toggleSidebar}
                            >
                                <Icon icon="iconamoon:menu-burger-horizontal-duotone" />
                            </button>
                            <div></div>
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
                                <Nav title={"Home"} destination={"home"}/>
                                <Nav title={"About Us"} destination={"aboutUs"}/>
                                <Nav title={"Services"} destination={"services"}/>
                                <Nav title={"Principals"}destination={"principals"} />
                                <Nav title={"Events"} destination={"events"}/>
                                <Nav title={"Media"} destination={"media"}/>
                                <Nav title={"Careers"} destination={"careers"}/>
                                <Nav title={"Contact us"} destination={"contactUs"}/>
                            </ul>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
