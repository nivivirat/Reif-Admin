import { Icon } from '@iconify/react';
import { ref as dbRef, onValue, push, ref, set, update } from 'firebase/database'; // Update imports for v9 syntax
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { db } from '../../../../firebase';
import EventForm from './EventForm/EventForm';

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
    const [changeOrderSectionVisible, setChangeOrderSectionVisible] = useState(false);
    const [orderChanges, setOrderChanges] = useState({});

    const handleInputChange = (imgKey, newOrder) => {
        setOrderChanges((prevChanges) => ({
            ...prevChanges,
            [imgKey]: newOrder,
        }));
    };

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

    const deleteImage = (year, eventUid, imgKey) => {
        // Ask for confirmation before deleting the image
        const shouldDelete = window.confirm('Are you sure you want to delete this image?');

        if (!shouldDelete) {
            return; // If the user cancels, do nothing
        }

        const eventsRef = ref(db, `events/${year}/${eventUid}/archivedImg/${imgKey}`);

        // Remove the image data from the database
        set(eventsRef, null)
            .then(() => {
                console.log('Image deleted successfully');

                // Remove the image from the local state
                const updatedEventsData = { ...eventsData };
                delete updatedEventsData[year][eventUid].archivedImg[imgKey];
                setEventsData(updatedEventsData);
            })
            .catch((error) => {
                console.error('Error deleting image: ', error);
            });
    };

    const changeImageOrder = (year, eventUid, imgKey, newOrder) => {
        const eventsRef = ref(db, `events/${year}/${eventUid}/archivedImg/${imgKey}`);

        // Update the image order
        update(eventsRef, { order: newOrder })
            .then(() => {
                console.log('Image order changed successfully');

                // Update the local state to reflect the changes
                const updatedEventsData = { ...eventsData };
                updatedEventsData[year][eventUid].archivedImg[imgKey].order = newOrder;
                setEventsData(updatedEventsData);
            })
            .catch((error) => {
                console.error('Error changing image order: ', error);
            });
    };

    const uploadImage = async (year, eventUid, imgKey, file) => {
        try {
            // Create a storage reference for the image
            const storage = storageRef(getStorage(), `events/${year}/${eventUid}/archivedImg/${imgKey}`);

            // Upload the file to the storage reference
            const snapshot = await uploadBytes(storage, file);

            // Get the download URL of the uploaded image
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Update the image data in the database with the download URL
            const eventsRef = dbRef(db, `events/${year}/${eventUid}/archivedImg/${imgKey}`);
            update(eventsRef, { img: downloadURL })
                .then(() => {
                    console.log('Image data updated successfully');

                    // Update the local state to reflect the changes
                    const updatedEventsData = { ...eventsData };
                    updatedEventsData[year][eventUid].archivedImg[imgKey].img = downloadURL;
                    setEventsData(updatedEventsData);
                    alert('Image added successfully!');
                })
                .catch((error) => {
                    console.error('Error updating image data in the database: ', error);
                });
        } catch (error) {
            console.error('Error uploading image: ', error);
        }
    };

    const addNewImage = async (year, eventUid) => {
        const eventRef = ref(db, `events/${year}/${eventUid}`);

        try {
            // Check if the maximum limit of three images is not exceeded
            const archivedImgCount = eventsData[year][eventUid]?.archivedImg
                ? Object.keys(eventsData[year][eventUid].archivedImg).length
                : 0;

            if (archivedImgCount < 3) {
                // Create a unique key for the new image
                const newImgKey = `imgKey_${Date.now()}`;

                // Calculate the order value
                const orderValue = archivedImgCount + 1;

                // Set initial data for the new image
                const newImgData = {
                    img: '',  // You can set an initial value or leave it empty
                    order: orderValue,
                };

                // Create an input element to trigger file selection
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.addEventListener('change', async (e) => {
                    const file = e.target.files[0];

                    if (file) {
                        // Upload the file to storage and get the download URL
                        const downloadURL = await uploadImage(year, eventUid, newImgKey, file);

                        // Update the image data in the database with the download URL and order value
                        const imageRef = ref(db, `events/${year}/${eventUid}/archivedImg/${newImgKey}`);
                        set(imageRef, { ...newImgData, img: downloadURL })
                            .then(() => {
                                console.log('New image added successfully');

                                // Update the local state to reflect the changes
                                const updatedEventsData = { ...eventsData };
                                if (!updatedEventsData[year][eventUid].archivedImg) {
                                    updatedEventsData[year][eventUid].archivedImg = {};
                                }
                                updatedEventsData[year][eventUid].archivedImg[newImgKey] = { ...newImgData, img: downloadURL };
                                setEventsData(updatedEventsData);

                                // Alert for successful image addition
                                alert('Image added successfully!');
                            })
                            .catch((error) => {
                                console.error('Error adding new image: ', error);
                            });
                    }
                });

                // Trigger the file input dialog
                input.click();
            } else {
                console.error('Maximum limit of three images reached');
                alert("Maximum limit of three images reached!")
                // You can show a message to the user indicating that the maximum limit has been reached
            }
        } catch (error) {
            console.error('Error checking archivedImg: ', error);
        }
    };



    const [editFormVisible, setEditFormVisible] = useState(false);

    const handleSaveChanges = () => {
        Object.entries(orderChanges).forEach(([imgKey, newOrder]) => {
            const imgRef = ref(
                db,
                `events/${currentYearForEditEvent}/${selectedEvent.uid}/archivedImg/${imgKey}`
            );
            update(imgRef, { order: newOrder });
        });

        setOrderChanges({});
        setChangeOrderSectionVisible(false);
        setSelectedEvent(null);
    };

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
                                                        setEditFormVisible(true);
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
                                                <div className='flex flex-row place-items-center my-4'>
                                                    <p className="font-semibold">Archived Images:</p>
                                                    <button
                                                        onClick={() => {
                                                            setChangeOrderSectionVisible(true);
                                                            // Optionally, you can also set the current event and year for more context
                                                            setSelectedEvent(event);
                                                            setCurrentYearForEditEvent(year);
                                                        }}
                                                        className="text-black text-2xl py-1 px-2 rounded hover:text-blue-600"
                                                        title='change order'
                                                    >
                                                        <Icon icon="tdesign:order-ascending" />
                                                    </button>
                                                    <button
                                                        onClick={() => addNewImage(year, event.uid)}
                                                        className="text-black text-2xl py-1 px-2 rounded hover:text-green-600"
                                                        title='add image'
                                                    >
                                                        <Icon icon="icon-park-outline:add-pic" />
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap gap-5">
                                                    {event.archivedImg && Object.entries(event.archivedImg)
                                                        .sort(([, a], [, b]) => a.order - b.order)
                                                        .map(([imgKey, imgData], imgIndex) => (
                                                            <div className='flex flex-col' key={imgKey}>
                                                                <img
                                                                    src={imgData.img}
                                                                    alt={`Archived Image ${imgIndex}`}
                                                                    className="h-[150px] w-[200px] object-cover rounded-md mt-2"
                                                                />
                                                                <div>
                                                                    {/* Edit button */}
                                                                    <button
                                                                        onClick={() => {
                                                                            const input = document.createElement('input');
                                                                            input.type = 'file';
                                                                            input.accept = 'image/*';
                                                                            input.addEventListener('change', (e) => {
                                                                                const file = e.target.files[0];
                                                                                if (file) {
                                                                                    uploadImage(year, event.uid, imgKey, file);
                                                                                }
                                                                            });
                                                                            input.click();
                                                                        }}
                                                                        className="text-black text-3xl py-1 px-2 rounded mb-2"
                                                                        title='replace image'
                                                                    >
                                                                        <Icon icon="tabler:edit" />
                                                                    </button>

                                                                    {/* Delete button */}
                                                                    <button
                                                                        onClick={() => deleteImage(year, event.uid, imgKey)}
                                                                        className="text-black text-3xl py-1 px-2 rounded"
                                                                        title='delete image'
                                                                    >
                                                                        <Icon icon="ic:twotone-delete" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Form to edit event details */}
                                        {editFormVisible && selectedEvent && !changeOrderSectionVisible && event.uid === selectedEvent.uid && (
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
                                                    onClose={() => {
                                                        setEditFormVisible(false);
                                                        setSelectedEvent(null);
                                                    }}
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

            {changeOrderSectionVisible && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-md">
                    <div className="flex justify-between place-items-start mb-4">
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold mb-2">
                                Change Cards Order in Event: {selectedEvent?.eventName || 'Unknown Event'}
                            </h2>
                        </div>
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => setChangeOrderSectionVisible(false)}
                        >
                            <Icon icon="ph:x-bold" />
                        </button>
                    </div>
                    <div className='h-[300px] overflow-y-scroll py-5'>
                        {Object.entries(selectedEvent?.archivedImg || {})
                            .sort(([, a], [, b]) => a.order - b.order)
                            .map(([imgKey, imgData], imgIndex) => (
                                <div key={imgKey} className="flex items-center mb-4">
                                    <img
                                        src={imgData.img}
                                        alt={`Archived Image ${imgIndex}`}
                                        className="h-[50px] w-[50px] object-cover rounded-md mr-4"
                                    />
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            className="px-3 py-1 border border-gray-300 rounded-md"
                                            value={orderChanges[imgKey] || imgData.order}
                                            onChange={(e) => {
                                                const newOrder = parseInt(e.target.value, 10);
                                                if (!isNaN(newOrder)) {
                                                    handleInputChange(imgKey, newOrder);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>
                    <button
                        className="bg-primary text-white py-2 px-4 rounded-md mt-3"
                        onClick={handleSaveChanges}
                    >
                        Save Changes
                    </button>
                </div>
            )}




        </div >
    );
}
