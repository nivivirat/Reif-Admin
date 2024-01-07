import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

const EventForm = ({ event, onSubmit, onChange, onClose, title }) => {
    console.log(event);

    const handleFileChange = (e, field) => {
        const files = e.target.files;
        const maxFiles = field === 'archivedImg' ? 3 : 1;

        if (files.length <= maxFiles) {
            const fileArray = [];
            for (let i = 0; i < files.length; i++) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    fileArray.push(event.target.result);
                    if (fileArray.length === files.length) {
                        onChange({
                            target: {
                                name: field,
                                value: fileArray.length === 1 ? fileArray[0] : fileArray,
                            },
                        });
                    }
                };
                reader.readAsDataURL(files[i]);
            }
        } else {
            // Notify user about the file limit
            alert(`Maximum ${maxFiles} files allowed for ${field === 'archivedImg' ? 'Archived Image' : 'Image'}`);
            e.target.value = null; // Clear the input field
        }
    };

    return (
        <div className="fixed top-0 left-0 z-10 w-full h-full bg-gray-200 bg-opacity-50 flex justify-center items-center overflow-auto">
            <div className="bg-white p-10 rounded-md relative flex flex-col gap-4">
                <button className="absolute top-0 right-0 p-2" onClick={onClose}>
                    <Icon icon="mingcute:close-fill" />
                </button>
                <h2 className="text-2xl font-semibold text-center">{title}</h2>
                <form onSubmit={onSubmit} className="flex flex-col gap-3">
                    {/* Other input fields... */}
                    <label className="text-primary flex flex-col">
                        <span>Event Name:</span>
                        <input
                            type="text"
                            name="eventName"
                            value={event.eventName}
                            onChange={onChange}
                            className="bg-white text-black py-2 px-4 rounded-md border border-gray-300"
                        />
                    </label>
                    <label className="text-primary flex flex-col">
                        <span>Date:</span>
                        <input
                            type="text"
                            name="date"
                            value={event.date}
                            onChange={onChange}
                            className="bg-white text-black py-2 px-4 rounded-md border border-gray-300"
                        />
                    </label>
                    <label className="text-primary flex flex-col">
                        <span>Location:</span>
                        <input
                            type="text"
                            name="location"
                            value={event.location}
                            onChange={onChange}
                            className="bg-white text-black py-2 px-4 rounded-md border border-gray-300"
                        />
                    </label>
                    <label className="text-primary flex flex-col">
                        <span>Upload Image:</span>
                        <input
                            type="file"
                            accept=".jpg, .png, image/jpeg, image/png"
                            onChange={(e) => handleFileChange(e, 'img')}
                            className="bg-white text-black py-2 px-4 rounded-md border border-gray-300"
                        />
                    </label>
                    <label className="text-primary flex flex-col">
                        <span>Description:</span>
                        <textarea
                            name="description"
                            value={event.description}
                            onChange={onChange}
                            className="bg-white text-black py-2 px-4 rounded-md border border-gray-300"
                        />
                    </label>
                    <label className="text-primary flex flex-col">
                        <span>Upload Archived Image (1 to 3 files):</span>
                        <input
                            type="file"
                            accept=".jpg, .png, image/jpeg, image/png"
                            onChange={(e) => handleFileChange(e, 'archivedImg')}
                            className="bg-white text-black py-2 px-4 rounded-md border border-gray-300"
                            name="archivedImg"
                            multiple  // Enable multiple file selection
                        />
                    </label>
                    <button className="bg-primary text-base text-white py-2 px-4 rounded-md" type="submit">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

EventForm.propTypes = {
    event: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};

export default EventForm;
