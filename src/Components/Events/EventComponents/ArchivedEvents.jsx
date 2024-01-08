import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase';
import EventForm from './EventForm/EventForm';
import { getDatabase, ref, onValue, set, push, update } from 'firebase/database'; // Update imports for v9 syntax
import { Icon } from '@iconify/react';

export default function ArchivedEvents() {
    const [eventsData, setEventsData] = useState({});
    const [formData, setFormData] = useState({
        date: "",
        eventName: "",
        img: "",
        location: "",
        uid: "",
        completed: false
    });

    const [currentYearForNewEvent, setCurrentYearForNewEvent] = useState(null);
    const [currentYearForEditEvent, setCurrentYearForEditEvent] = useState(null);

    const [newEventForm, setNewEventForm] = useState(false);

    // Function to fetch events data from Firebase
    const fetchEventsData = () => {
        const eventsRef = ref(db, 'events'); // Use ref from v9 syntax
        onValue(eventsRef, (snapshot) => {
            if (snapshot.exists()) {
                setEventsData(snapshot.val());
            }
        });
    };

    // Fetch events data on component mount
    useEffect(() => {
        fetchEventsData();
    }, []);

    const [selectedEvent, setSelectedEvent] = useState(null);

    // Function to update an event
    const updateEvent = (eventUid, updatedEventData) => {
        const updatedEventsData = { ...eventsData }; // Create a copy of the current eventsData

        if (
            updatedEventsData[currentYearForEditEvent] &&
            updatedEventsData[currentYearForEditEvent][eventUid]
        ) {
            updatedEventsData[currentYearForEditEvent][eventUid] = updatedEventData; // Update the specific event data

            console.log(eventUid);
            console.log(currentYearForEditEvent);

            const eventsRef = ref(db, `events/${currentYearForEditEvent}/${eventUid}`);
            set(eventsRef, updatedEventData)
                .then(() => {
                    console.log('Event updated successfully');
                    setSelectedEvent(null); // Reset selected event after updating
                    handleCloseForm(); // Close the editing form after updating

                    // Update the eventsData state with the modified event data
                    setEventsData(updatedEventsData);
                })
                .catch((error) => {
                    console.error('Error updating event: ', error);
                });
        } else {
            console.error('Event does not exist or cannot be updated');
        }
    };

    const handleCloseForm = () => {
        setSelectedEvent(null); // Close the editing form
    };

    const addNewEvent = (year) => {
        setNewEventForm(true);
        // If formData is a string, initialize it as an empty object
        const newEvent = typeof formData === 'string' ? {} : { ...formData };

        const eventsRef = ref(db, 'events/' + year);
        push(eventsRef, newEvent)
            .then((newEventRef) => {
                const newEventId = newEventRef.key;
                console.log('Event added successfully with UID:', newEventId);

                // Reset formData after adding the event
                setFormData({ date: '', eventName: '', img: '', location: '', uid: '' });

                // Close the new event form after adding the event
                setNewEventForm(false);

                // Update the value of uid field as newEventId in the database
                const eventRef = ref(db, `events/${year}/${newEventId}`);
                update(eventRef, { uid: newEventId })
                    .then(() => {
                        console.log('UID updated successfully in the database');
                    })
                    .catch((error) => {
                        console.error('Error updating UID in the database:', error);
                    });
            })
            .catch((error) => {
                console.error('Error adding event: ', error);
            });
    };

    // delete a event

    const deleteEvent = (year, eventUid) => {
        const eventsRef = ref(db, `events/${year}/${eventUid}`);

        // Remove the event data from the database
        set(eventsRef, null)
            .then(() => {
                console.log('Event deleted successfully');

                // Remove the event from the local state
                const updatedEventsData = { ...eventsData };
                delete updatedEventsData[year][eventUid];
                setEventsData(updatedEventsData);
            })
            .catch((error) => {
                console.error('Error deleting event: ', error);
            });
    };

    // delete confirmation

    const deleteEventWithConfirmation = (year, eventUid) => {
        const shouldDelete = window.confirm('Are you sure you want to delete this event?');

        if (shouldDelete) {
            deleteEvent(year, eventUid);
        }
    };

    // mark as complete

    // Function to handle marking an event as completed with user-provided description and image
    const handleMarkEventAsCurrentEvent = (year, eventUid) => {
        const eventRef = ref(db, `events/${year}/${eventUid}`);

        // Update the event data to set "completed" to false
        update(eventRef, { completed: false })
            .then(() => {
                console.log('Event marked as current successfully');

                // Update the local state to reflect the changes
                const updatedEventsData = { ...eventsData };
                updatedEventsData[year][eventUid].completed = false;
                setEventsData(updatedEventsData);
            })
            .catch((error) => {
                console.error('Error marking event as current: ', error);
            });
    };

    // Initialize a state to hold the count of incomplete events for each year
    const [completeEventCounts, setCompleteEventCounts] = useState({});

    // Function to calculate the count of incomplete events for a specific year
    const calculateCompleteEventCount = (year) => {
        const incompleteEventsCount = Object.values(eventsData[year] || {})
            .filter(event => event.completed) // Filter events where 'completed' is false
            .length;

        // Update the count in the incompleteEventCounts state for the specific year
        setCompleteEventCounts(prevCounts => ({
            ...prevCounts,
            [year]: incompleteEventsCount,
        }));
    };

    // Call the function to calculate the count of incomplete events for each year
    useEffect(() => {
        Object.keys(eventsData).forEach(year => {
            calculateCompleteEventCount(year);
        });
    }, [eventsData]);



    return (
        <div className="p-4 relative">

            <div className="flex flex-wrap gap-4">
                {Object.entries(eventsData).map(([year, events]) => (
                    <div key={year} className="border m-10 rounded-md p-10 w-screen px-24 gap-10">
                        <div className='flex flex-row justify-between py-5'>
                            {/* <h3 className="text-3xl text-primary font-bold mb-2">{year}</h3> */}
                            <h3 className="text-3xl text-primary font-bold mb-2">
                                {year} ({completeEventCounts[year] || 0} events)
                            </h3>
                        </div>


                        <div>
                            {Object.values(events)
                                .filter(event => event.completed) // Filter events where 'completed' is false
                                .map((event, index) => (
                                    <div key={index} className="bg-gray-100 flex-col border rounded-md p-2 px-10 mb-2 flex">

                                        {/* top */}
                                        <div className='flex flex-row justify-between w-full py-5'>
                                            <p className="font-semibold text-2xl"><span className="font-bold hover:text-primary">{event.eventName}</span></p>
                                            <div className="flex gap-2 justify-center place-items-center">
                                                <button
                                                    onClick={() => {
                                                        setCurrentYearForEditEvent(year);
                                                        setSelectedEvent(event);
                                                    }}
                                                    title="Edit Event"
                                                    className="flex flex-row py-2 px-4 text-2xl hover:text-primary rounded-md"
                                                >
                                                    <Icon icon="iconamoon:edit-duotone" />
                                                </button>

                                                {/* complete button */}
                                                <button
                                                    onClick={() => handleMarkEventAsCurrentEvent(year, event.uid)}
                                                    title="Mark as current event"
                                                    className="py-2 px-4 rounded-md text-3xl hover:text-green-600"
                                                >
                                                    <Icon icon="majesticons:undo" />
                                                </button>

                                                {/* delete button */}
                                                <button
                                                    onClick={() => deleteEventWithConfirmation(year, event.uid)}
                                                    title="Delete Event"
                                                    className="py-2 px-4 rounded-md text-3xl hover:text-red-600"
                                                >
                                                    <Icon icon="mdi:delete" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* bottom */}
                                        <div className='flex flex-row justify-between w-full text-[20px]'>
                                            <div className="w-[50%] justify-center flex flex-col">
                                                <p className="font-semibold">Date: <span className='font-normal'>{event.date}</span></p>
                                                <p className="font-semibold">Location: <span className='font-normal'>{event.location}</span></p>
                                            </div>

                                            <div className="w-[50%]">
                                                <p className="font-semibold">Archived Images:</p>
                                                <div className="flex flex-wrap gap-5">
                                                    {
                                                        Array.isArray(event.archivedImg) ? (
                                                            event.archivedImg.map((imgSrc, imgIndex) => (
                                                                <img
                                                                    key={imgIndex}
                                                                    src={imgSrc}
                                                                    alt={`Archived Image ${imgIndex}`}
                                                                    className="h-[150px] w-[200px] object-cover rounded-md mt-2"
                                                                />
                                                            ))
                                                        ) : (
                                                            <img
                                                                src={event.archivedImg}
                                                                alt="Archived Image"
                                                                className="h-[150px] w-[200px] object-cover rounded-md mt-2"
                                                            />
                                                        )
                                                    }

                                                </div>
                                            </div>
                                        </div>

                                        {/* Form to edit event details */}
                                        {selectedEvent && event.uid === selectedEvent.uid && (
                                            <div className=''>
                                                <EventForm
                                                    event={selectedEvent}
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        updateEvent(selectedEvent.uid, selectedEvent);
                                                    }}
                                                    onChange={(e) =>
                                                        setSelectedEvent({
                                                            ...selectedEvent,
                                                            [e.target.name]: e.target.value,
                                                        })
                                                    }
                                                    onClose={handleCloseForm}
                                                    title={`Edit Archived Event - ${currentYearForEditEvent}`} // Include the year in the title
                                                />
                                            </div>
                                        )}

                                        {newEventForm && (
                                            <EventForm
                                                event={formData}
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    addNewEvent(currentYearForNewEvent); // Pass the current year when adding the new event
                                                }}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        [e.target.name]: e.target.value,
                                                    })
                                                }
                                                onClose={() => {
                                                    setNewEventForm(false);
                                                    setCurrentYearForNewEvent(null); // Reset the current year after closing the form
                                                }}
                                                title={`Add New Event - ${currentYearForNewEvent}`}
                                            // title={"Add New Event"}
                                            />
                                        )}
                                    </div>
                                ))}

                        </div>
                    </div>
                ))}

                {/* <div className="border rounded-md p-4 mx-10">
                    <h3 className="font-semibold mb-2">Add New Year</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newYear}
                            onChange={(e) => setNewYear(e.target.value)}
                            className="border rounded-md p-2 flex-grow"
                            placeholder="Enter year"
                        />
                        <button onClick={addNewYear} className="bg-primary text-white py-2 px-4 rounded-md">
                            Add Year
                        </button>
                    </div>
                </div> */}
            </div>

        </div >
    );
}
