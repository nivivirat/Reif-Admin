import { useEffect, useState } from "react";
import { onValue, ref, getDatabase, remove, child, } from 'firebase/database';
import { Icon } from "@iconify/react";
import { CSVLink } from "react-csv";

export default function Newsletter() {
    const [newsletterData, setNewsletterData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        const fetchData = async () => {
            const dbRef = ref(getDatabase(), 'newsletter-subscription');

            try {
                onValue(dbRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const dataArray = Object.values(data);

                        setNewsletterData(dataArray);
                    }
                });
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();

        // Cleanup function to detach listeners if needed
        return () => {
            // Remove listeners or perform cleanup (if applicable)
        };
    }, []);

    // Function to copy email to clipboard
    const copyToClipboard = (email) => {
        navigator.clipboard.writeText(email);
        // Optionally show a message or perform any other action after copying
    };

    // Function to handle pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = newsletterData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to the first page when changing items per page
    };


    const convertToIST = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
        });
    };
    
    const csvData = newsletterData.map(({ email, timestamp }) => ({
        Email: email,
        Timestamp: convertToIST(timestamp),
    }));

    const handleDeleteClick = (contactId) => {
        if (window.confirm('Are you sure you want to delete this ?')) {
            const db = getDatabase();
            const contactRef = ref(db, `newsletter-subscription/${contactId}`);
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


    return (
        <div className="py-8">
            <div className="flex flex-row justify-between w-[70%]">
                <h1 className="text-3xl font-bold mb-4 first-letter:capitalize">Newsletter Subsription</h1>
                <div>
                    <CSVLink data={csvData} filename={"newsletter-subscriptions.csv"} className="cursor-pointer px-3 py-1 bg-green-500 text-white rounded-md ml-2">
                        Export as excel
                    </CSVLink>
                </div>
            </div>

            <table className="w-[70%] divide-y divide-gray-200 border border-black">
                {/* Table headers */}
                <thead className="bg-gray-200 border border-black">
                    <tr>
                        <th className="w-[70px] border text-center border-black px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">S.NO</th>
                        <th className="w-[500px] text-center border border-black px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="text-center border border-black px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                        <th className="text-center border border-black px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-gray-200">
                    {/* Table rows */}
                    {currentItems.map((nl, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-black px-6 py-4">{indexOfFirstItem + index + 1}</td>
                            <td className="border border-black px-6 py-4 cursor-pointer" onClick={() => copyToClipboard(nl.email)}>{nl.email}</td>
                            <td className="border border-black px-6 py-4">{convertToIST(nl.timestamp)}</td>
                            <td className='border border-black px-6 py-4 cursor-pointer' onClick={() => handleDeleteClick(nl.id)}>
                                <Icon icon="mdi:delete" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-10 w-[70%]">
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
                            Page {currentPage} of {Math.ceil(newsletterData.length / itemsPerPage)}
                        </div>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={indexOfLastItem >= newsletterData.length}
                            className="cursor-pointer px-3 py-1 bg-primary text-white rounded-md ml-2"
                        >
                            Next
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
