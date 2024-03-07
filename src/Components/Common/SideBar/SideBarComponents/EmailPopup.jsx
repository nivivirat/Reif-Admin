import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../../../firebase";

const EmailPopup = ({ isOpen, onClose, onResetPassword }) => {
    const handleResetPassword = async () => {
        try {
            // Get the currently authenticated user's email
            const userEmail = auth.currentUser.email;

            // Send password reset email to the authenticated user's email
            await sendPasswordResetEmail(auth, userEmail);
            
            alert("Kindly check your Email for the reset link.");
            onResetPassword();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div
            className={`${isOpen ? "fixed" : "hidden"
                } top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50`}
        >
            <div className="bg-white p-8 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
                <div className="flex justify-end">
                    <button
                        className="text-white bg-primary hover:bg-primary px-4 py-2 rounded-lg"
                        onClick={handleResetPassword}
                    >
                        Yes
                    </button>
                    <button
                        className="text-gray-600 ml-4 hover:underline"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailPopup;
