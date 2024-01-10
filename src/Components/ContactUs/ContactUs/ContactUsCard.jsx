import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { onValue, ref, getDatabase, update, remove } from 'firebase/database';
import { CSVLink } from "react-csv";

const ContactUsCard = ({ contactData }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Number of items per page
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);

    const convertToIST = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
        });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1); // Reset to the first page when changing items per page
    };

    const handleDeleteClick = (contactId) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            const db = getDatabase();
            const contactRef = ref(db, `contactUs/${contactId}`);
            remove(contactRef)
                .then(() => {
                    console.log('Contact deleted successfully');
                    // Optionally perform any other actions after deletion
                })
                .catch((error) => {
                    console.error('Error deleting contact:', error);
                    // Handle errors or show error messages
                });
        }
    };

    useEffect(() => {
        // Filter and sort the contact data whenever searchTerm changes
        const filtered = contactData
            .filter((contact) => {
                return (
                    contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    contact.phoneNumber.includes(searchTerm) ||
                    contact.message.toLowerCase().includes(searchTerm)
                );
            })
            .sort((a, b) => {
                const timestampA = new Date(a.timestamp);
                const timestampB = new Date(b.timestamp);
                return timestampB - timestampA; // Sort in descending order
            });

        setFilteredContacts(filtered);
    }, [searchTerm, contactData]);


    const currentItems = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);

    const csvData = filteredContacts.map((contact) => ({
        'First Name': contact.firstName,
        'Email': contact.email,
        'Phone Number': contact.phoneNumber,
        'Message': contact.message,
        'Timestamp': convertToIST(contact.timestamp),
    }));

    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

    return (
        <div className='max-w-full mr-10 mt-10'>

            <div className="mb-4 flex justify-between items-center">
                <div>
                    <input
                        type="text"
                        className="px-3 py-1 w-[300px] border border-gray-300 rounded-md"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        className="cursor-pointer bg-primary text-white px-3 py-1 rounded-md ml-2"
                    >
                        Search
                    </button>
                </div>
                <div>
                    <div>
                        <CSVLink data={csvData} filename={`Contact-Us-${formattedDate}.csv`} className="cursor-pointer px-3 py-1 bg-green-500 text-white rounded-md ml-2">
                            Export as excel
                        </CSVLink>
                    </div>
                </div>
            </div>

            <table className="w-full divide-y divide-gray-200 border border-black">
                <thead className="bg-gray-200 border border-black">
                    <tr>
                        <th className="border border-black px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.NO</th>
                        <th className="border border-black px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                        <th className="border border-black px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="border border-black px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                        <th className="border border-black px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                        <th className="border border-black px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                        <th className="border border-black px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-gray-200">
                    {currentItems.map((contact, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-black px-6 py-4 whitespace-nowrap">{indexOfFirstItem + index + 1}</td>
                            <td className="border border-black px-6 py-4 ">{contact.firstName}</td>
                            <td className="border border-black px-6 py-4 cursor-pointer select-none" onClick={() => copyToClipboard(contact.email)}>{contact.email}</td>
                            <td className="border border-black px-6 py-4 whitespace-nowrap">{contact.phoneNumber}</td>
                            <td className="border border-black px-6 py-4 w-[300px]">{contact.message}</td>
                            <td className="border border-black px-6 py-4 ">{convertToIST(contact.timestamp)}</td>
                            <td className='border border-black px-6 py-4 cursor-pointer' onClick={() => handleDeleteClick(contact.id)}>
                                <Icon icon="mdi:delete" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Pagination */}
            <div className="flex justify-between items-center mt-10">
                <div>
                    <select
                        className="cursor-pointer px-3 py-1 bg-gray-200 rounded-md"
                        onChange={handleItemsPerPageChange}
                        value={itemsPerPage}
                    >
                        <option value="2">2</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                    <span className="ml-2">Items per page</span>
                </div>
                <div>
                    <nav className="flex items-center">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="cursor-pointer bg-primary text-white px-3 py-1 rounded-md mr-2"
                        >
                            Previous
                        </button>
                        <div className="px-3 py-1">
                            Page {currentPage} of {Math.ceil(contactData.length / itemsPerPage)}
                        </div>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={indexOfLastItem >= contactData.length}
                            className="cursor-pointer px-3 py-1 bg-primary text-white rounded-md ml-2"
                        >
                            Next
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default ContactUsCard;

ContactUsCard.propTypes = {
    contactData: PropTypes.array.isRequired,
};
