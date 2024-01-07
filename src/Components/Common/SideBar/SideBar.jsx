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
                        <button
                            className="text-primary text-3xl p-4"
                            onClick={toggleSidebar}
                        >
                            <Icon icon="iconamoon:menu-burger-horizontal-duotone" />
                        </button>
                        <img className='sm:h-[60px] sm:w-[100px] h-6 w-10 mr-10' src='https://res.cloudinary.com/dzhdarh4q/image/upload/v1699014385/Reifenhauser/ReifenhauserLogo_hhc7wi.svg' alt='Logo' />
                    </div>
                ) : (
                    <div className="bg-base h-full z-50 p-3">
                        <div className="flex flex-row justify-between">
                            <img className='sm:h-[45px] sm:w-[90px] h-6 w-10' src='https://res.cloudinary.com/dzhdarh4q/image/upload/v1699014385/Reifenhauser/ReifenhauserLogo_hhc7wi.svg' alt='Logo' />
                            <button className="text-primary text-3xl p-4" onClick={toggleSidebar} >
                                <Icon icon="tabler:x" />
                            </button>
                        </div>

                        <div>
                            <ul className='flex flex-col gap-5 mt-5'>
                                <Nav title={"home"}/>
                                <Nav title={"About Us"}/>
                                <Nav title={"Services"}/>
                                <Nav title={"Principals"}/>
                                <Nav title={"Events"}/>
                                <Nav title={"Media"}/>
                                <Nav title={"Careers"}/>
                                <Nav title={"Contact us"}/>
                            </ul>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
