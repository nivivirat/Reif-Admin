import { Icon } from '@iconify/react';
import { onValue, push, ref, set, update } from 'firebase/database'; // Update imports for v9 syntax
import React, { useEffect, useState } from 'react';
import { db } from '../../../../firebase';
import EventForm from './EventForm/EventForm';

export default function AdminEvents() {
    const [eventsData, setEventsData] = useState({});
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        date: "",
        eventName: "",
        img: "",
        location: "",
        uid: "",
        completed: false,
        archivedImg: [],
        description: ""
    });

    const [currentYearForNewEvent, setCurrentYearForNewEvent] = useState(null);
    const [currentYearForEditEvent, setCurrentYearForEditEvent] = useState(null);

    const [newEventForm, setNewEventForm] = useState(false);
    const [editEventForm, setEditEventForm] = useState(false);

    // Function to fetch events data from Firebase
    const fetchEventsData = () => {

        setLoading(true);

        const eventsRef = ref(db, 'events');
        onValue(eventsRef, (snapshot) => {
            if (snapshot.exists()) {
                setEventsData(snapshot.val());
            }
        });

        setLoading(false);
    };

    // Fetch events data on component mount
    useEffect(() => {
        setLoading(true);
        fetchEventsData();
        setLoading(false);
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
                setFormData({ date: '', eventName: '', img: '', location: '', uid: '', desc: '', completed: false, archivedImg: [] });

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



    const [newYear, setNewYear] = useState("");

    const addNewYear = () => {
        if (newYear.trim() !== "") {
            const newYearKey = `Events ${newYear}`;
            const updatedEventsData = {
                ...eventsData,
                [newYearKey]: {}, // Initialize the new year's data as an empty object
            };

            setEventsData(updatedEventsData);

            // Update the database with the new events data
            const eventsRef = ref(db, 'events');
            set(eventsRef, updatedEventsData)
                .then(() => {
                    console.log(`Year ${newYear} added successfully to the database`);
                    setNewYear(""); // Reset the input field after adding the year

                    // After adding a new year, invoke a function to add a new event
                    // addNewEvent(newYearKey); // Pass the newly created year's key

                    setCurrentYearForNewEvent(newYearKey);
                    setNewEventForm(true);

                    window.alert('Event added successfully!');

                })
                .catch((error) => {
                    console.error('Error adding year to the database: ', error);
                });
        }
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

    const archiveEvent = (year, eventUid) => {
        const eventsRef = ref(db, `events/${year}/${eventUid}`);

        // Update the completed field to true for the specified event
        update(eventsRef, { completed: true })
            .then(() => {
                console.log('Event archived successfully');
            })
            .catch((error) => {
                console.error('Error archiving event: ', error);
            });
    };

    const archiveEventWithConfirmation = (year, eventUid) => {
        const shouldArchive = window.confirm('Are you sure you want to archive this event?');

        if (shouldArchive) {
            archiveEvent(year, eventUid);
        }
    };

    // delete year

    const deleteYearWithConfirmation = (year) => {
        const shouldDelete = window.confirm('Are you sure you want to delete this Year?');

        if (shouldDelete) {
            deleteYear(year);
        }
    };

    const deleteYear = (yearToDelete) => {
        const updatedEventsData = { ...eventsData };

        // Check if the year exists in the data
        if (updatedEventsData[yearToDelete]) {
            // Get the events for the specified year
            const eventsToDelete = updatedEventsData[yearToDelete];

            // Loop through the events to delete the ones with 'completed' as false
            Object.keys(eventsToDelete).forEach(eventKey => {
                if (!eventsToDelete[eventKey].completed) {
                    delete eventsToDelete[eventKey];
                }
            });

            // Update the eventsData with the modified events
            updatedEventsData[yearToDelete] = eventsToDelete;

            // Update the database with the modified events data
            const eventsRef = ref(db, 'events');
            set(eventsRef, updatedEventsData)
                .then(() => {
                    console.log(`Year ${yearToDelete} events with 'completed' as false deleted successfully from the database`);
                    // Update the state or perform any other necessary actions after deletion
                    setEventsData(updatedEventsData);
                    // Optionally, close any related forms or reset state variables after deletion
                    setNewEventForm(false);
                    setCurrentYearForNewEvent(null);
                    // Add more logic as per your requirements
                })
                .catch((error) => {
                    console.error('Error deleting events from the database: ', error);
                });
        } else {
            console.error(`Year ${yearToDelete} does not exist in the data`);
        }
    };


    // Initialize a state to hold the count of incomplete events for each year
    const [incompleteEventCounts, setIncompleteEventCounts] = useState({});

    // Function to calculate the count of incomplete events for a specific year
    const calculateIncompleteEventCount = (year) => {
        const incompleteEventsCount = Object.values(eventsData[year] || {})
            .filter(event => !event.completed) // Filter events where 'completed' is false
            .length;

        // Update the count in the incompleteEventCounts state for the specific year
        setIncompleteEventCounts(prevCounts => ({
            ...prevCounts,
            [year]: incompleteEventsCount,
        }));
    };

    // Call the function to calculate the count of incomplete events for each year
    useEffect(() => {
        Object.keys(eventsData).forEach(year => {
            calculateIncompleteEventCount(year);
        });
    }, [eventsData]);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const currentYearString = `Events ${currentYear}`;

    return (
        <div className="p-4 relative">

            {loading ? ( // Conditional rendering based on isLoading state
                <div>Loading...</div>
            ) : (
                // Existing JSX structure with fetched events data
                <div className="flex flex-wrap gap-4">

                    {Object.entries(eventsData).map(([year, events]) => (
                        ((year === currentYearString) || Object.values(events).filter(event => !event.completed).length > 0) && (
                            <div key={year} className="border m-10 rounded-md p-10 w-screen px-24 gap-10">
                                <div className='flex flex-row justify-between py-5'>
                                    {/* <h3 className="text-3xl text-primary font-bold mb-2">{year}</h3> */}
                                    <h3 className="text-3xl text-primary font-bold mb-2">
                                        {year} ({incompleteEventCounts[year] || 0} events)
                                    </h3>
                                    <div className='flex flex-row gap-5'>
                                        <button
                                            onClick={() => {
                                                setCurrentYearForNewEvent(year);
                                                setNewEventForm(true);
                                            }}
                                            title="Add New Event"
                                            className="bg-primary text-white hover:shadow-lg hover:shadow-green-500/50 py-2 px-4 rounded-md mb-2"
                                        >
                                            Add New Event
                                        </button>
                                        <button
                                            onClick={() => deleteYearWithConfirmation(year)}
                                            title="Delete Year"
                                            className="bg-primary text-white hover:shadow-lg hover:shadow-red-500/50 py-2 px-4 rounded-md mb-2"
                                        >
                                            Delete Year
                                        </button>

                                    </div>
                                </div>


                                <div>
                                    {Object.values(events)
                                        .filter(event => !event.completed) // Filter events where 'completed' is false
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
                                                                console.log("tueere");
                                                                setEditEventForm(true); // Update the state to true for the edit form
                                                            }}
                                                            title="Edit Event"
                                                            className="flex flex-row py-2 px-4 text-2xl hover:text-primary rounded-md"
                                                        >
                                                            <Icon icon="iconamoon:edit-duotone" />
                                                        </button>


                                                        {/* complete button */}
                                                        <button
                                                            onClick={() => archiveEventWithConfirmation(year, event.uid)}
                                                            title="Mark Event as Completed"
                                                            className="py-2 px-4 rounded-md text-2xl hover:text-green-600"
                                                        >
                                                            <Icon icon="fluent-mdl2:completed-solid" />
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

                                                    {event.img && (
                                                        <div className="w-[50%]">
                                                            <p className="font-semibold">Image:</p>
                                                            <img
                                                                src={event.img}
                                                                alt={`Event ${index}`}
                                                                className="w-96 h-108 object-cover rounded-md mt-2"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Form to edit event details */}
                                                {editEventForm && selectedEvent && event.uid === selectedEvent.uid && (
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
                                                                    [e.target.name]: e.target.name === 'archivedImg'
                                                                        ? [...selectedEvent.archivedImg, e.target.value] // If it's for images, add to the array
                                                                        : e.target.value, // Otherwise, update normally
                                                                })
                                                            }
                                                            onClose={handleCloseForm}
                                                            title={`Edit Event - ${currentYearForEditEvent}`}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                </div>

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
                                    />
                                )}
                            </div>
                        )
                    ))}

                    <div className="border rounded-md p-4 mx-10">
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
                    </div>
                </div>
            )}


        </div >
    );
}
