import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

const NewCardForm = ({ topic, isOpen, onClose, onAddCard, section, newCardForm, handleFormChange, handleFileChange }) => {
    return (
        isOpen && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-md">
                <h3 className="text-xl font-bold mb-4">Add New Card  - {section}</h3>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-0 right-0 p-2"
                    >
                        <Icon icon="ph:x-bold" />
                    </button>
                    <label className="mb-4">
                        Company Name:
                        <input
                            type="text"
                            name="company_name"
                            value={newCardForm.company_name}
                            onChange={handleFormChange}
                            className="border p-2 rounded-md w-full"
                        />
                    </label>
                    <label className="mb-4">
                        Image File:
                        <input
                            type="file"
                            accept="image/*"
                            name="img"
                            onChange={handleFileChange}
                            className="border p-2 rounded-md w-full"
                        />
                    </label>
                    <label className="mb-4">
                        Back Content:
                        <input
                            type="text"
                            name="backContent"
                            value={newCardForm.backContent}
                            onChange={handleFormChange}
                            className="border p-2 rounded-md w-full"
                        />
                    </label>
                    <label className="mb-4">
                        Back Link:
                        <input
                            type="text"
                            name="backLink"
                            value={newCardForm.backLink}
                            onChange={handleFormChange}
                            className="border p-2 rounded-md w-full"
                        />
                    </label>
                    <button
                        type="button"
                        onClick={() => onAddCard(section)}
                        className="bg-primary text-white py-2 px-4 rounded-md"
                    >
                        Add Card
                    </button>
                </form>
            </div>
        )
    );
};

export default NewCardForm;

NewCardForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddCard: PropTypes.func.isRequired,
    section: PropTypes.string.isRequired,
    topic: PropTypes.string.isRequired,
    newCardForm: PropTypes.shape({
        company_name: PropTypes.string,
        img: PropTypes.any, // You may want to refine this based on the actual type
        backContent: PropTypes.string,
        backLink: PropTypes.string,
    }).isRequired,
    handleFormChange: PropTypes.func.isRequired,
    handleFileChange: PropTypes.func.isRequired,
};
