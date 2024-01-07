import React, { useState } from 'react';
import AdminEvents from './EventComponents/AdminEvents';
import ArchivedEvents from './EventComponents/ArchivedEvents'; // Import the ArchivedEvents component

export default function Events() {
    const [showCurrentEvents, setShowCurrentEvents] = useState(true); // State to toggle between Current and Archived Events

    const handleShowCurrentEvents = () => {
        setShowCurrentEvents(true);
    };

    const handleShowArchivedEvents = () => {
        setShowCurrentEvents(false);
    };

    return (
        <div>
            <div className="p-4 relative flex justify-between items-center">
                <h1 className="text-2xl font-bold mb-4 px-4">Admin Panel</h1>
                <div className="space-x-4 flex flex-row">
                    <button
                        onClick={handleShowCurrentEvents}
                        className={`${
                            showCurrentEvents ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                        } py-2 px-4 w-[200px] rounded-md`}
                    >
                        Current Events
                    </button>
                    <button
                        onClick={handleShowArchivedEvents}
                        className={`${
                            !showCurrentEvents ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                        } py-2 px-4 w-[200px] rounded-md`}
                    >
                        Archived Events
                    </button>
                </div>
            </div>
            {showCurrentEvents ? <AdminEvents /> : <ArchivedEvents />} {/* Conditionally render based on state */}
        </div>
    );
}
