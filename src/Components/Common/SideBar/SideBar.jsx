import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import EmailPopup from "./SideBarComponents/EmailPopup";

import Nav from "./SideBarComponents/Nav";

export default function SideBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [location, setLocation] = useState(null);
    const [user, setUser] = useState(null);
    const [showResetPasswordPopup, setShowResetPasswordPopup] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const path = window.location.pathname.slice(1);
        setLocation(path === '' || path === '/' ? 'home' : path);
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    const handleLogOut = async () => {
        try {
            // Ask for confirmation before logging out
            const confirmLogout = window.confirm("Are you sure you want to logout?");
            if (confirmLogout) {
                await signOut(auth);
            }
        } catch (error) {
            console.error("Error during logout:", error.message);
        }
    };

    const handleForgotPassword = async () => {
        // try {
        //     await sendPasswordResetEmail(auth, email);
        //     console.log("Password reset email sent. Check your inbox.");
        // } catch (error) {
        //     // setError(error.message);
        //     console.log(error);
        // }
        setShowResetPasswordPopup(true);
    };

    const closeResetPasswordPopup = () => {
        // Close the reset password popup
        setShowResetPasswordPopup(false);
    };

    const handleResetPassword = () => {
        // Handle any additional logic after resetting the password
        // For example, showing a success message or redirecting the user
        // ...

        // Close the reset password popup
        closeResetPasswordPopup();
    };


    return (
        <div className="fixed top-0 left-0 z-20">
            <div className={`${isOpen ? 'w-screen h-screen' : 'w-screen h-[80px]'} transition-all duration-500`}>
                {!isOpen ? (
                    <div className="flex flex-row justify-between border-b bg-base shadow-lg">
                        <div className="flex flex-row">
                            <button className="text-primary text-3xl p-4" onClick={toggleSidebar}>
                                <Icon icon="iconamoon:menu-burger-horizontal-duotone" />
                            </button>
                            <h1 className="text-2xl font-bold p-4 capitalize">{location}</h1>
                        </div>
                        <img
                            className="sm:h-[60px] sm:w-[100px] h-6 w-10 mr-10"
                            src="https://res.cloudinary.com/dzhdarh4q/image/upload/v1699014385/Reifenhauser/ReifenhauserLogo_hhc7wi.svg"
                            alt="Logo"
                        />
                    </div>
                ) : (
                    <div className="z-40 h-screen" onClick={() => setIsOpen(false)}>
                        <div className="bg-base h-full z-50 p-3 w-[300px]">
                            <div className="flex flex-row justify-between">
                                <img
                                    className="sm:h-[45px] sm:w-[90px] h-6 w-10"
                                    src="https://res.cloudinary.com/dzhdarh4q/image/upload/v1699014385/Reifenhauser/ReifenhauserLogo_hhc7wi.svg"
                                    alt="Logo"
                                />
                                <button className="text-primary text-3xl p-4" onClick={toggleSidebar}>
                                    <Icon icon="tabler:x" />
                                </button>
                            </div>

                            <div>
                                <ul className="flex flex-col gap-2 mt-5">
                                    <Nav title={"Home Banner"} destination={""} />
                                    <Nav title={"Events"} destination={"Events"} />
                                    <Nav title={"Testimonials"} destination={"Testimonials"} />
                                    <Nav title={"Principals"} destination={"Principals"} />
                                    <Nav title={"Media"} destination={"Media"} />
                                    <Nav title={"Careers"} destination={"Careers"} />
                                    <Nav title={"Careers Image"} destination={"CareersImage"} />
                                    <Nav title={"Contact us"} destination={"ContactUs"} />
                                    <Nav title={"Newsletter Subscription"} destination={"Newsletter"} />
                                    <Nav title={"Youtube Video"} destination={"YoutubeVideo"} />
                                </ul>
                                {user && (
                                    <div className="mt-5 flex flex-row justify-between">
                                        <button
                                            className="hover:text-primary text-white"
                                            onClick={handleForgotPassword}
                                        >
                                            <div
                                                className="w-[130px] flex flex-row justify-center place-items-center py-2 gap-1 rounded-lg text-center transition duration-300 ease-in-out hover:bg-gray-200 hover:shadow-md hover:text-black bg-primary"
                                            >
                                                <Icon
                                                    icon="mdi:password-reset"
                                                    className=" hover:text-primary text-2xl"
                                                />
                                                Reset pass
                                            </div>
                                        </button>
                                        <button
                                            className="hover:text-primary text-white"
                                            onClick={handleLogOut}
                                        >
                                            <div
                                                className="w-[130px] flex flex-row justify-center place-items-center gap-2 py-2 px-4 rounded-lg text-center transition duration-300 ease-in-out hover:bg-gray-200 hover:shadow-md hover:text-black bg-primary">
                                                <Icon icon="material-symbols:logout" className="hover:text-primary text-2xl" />
                                                logout
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <EmailPopup
                isOpen={showResetPasswordPopup}
                onClose={closeResetPasswordPopup}
                onResetPassword={handleResetPassword}
            />
        </div>
    );
}
