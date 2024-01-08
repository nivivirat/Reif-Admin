import { Icon } from "@iconify/react"
import PropTypes from 'prop-types';
import { onValue, ref, getDatabase, update, remove } from 'firebase/database';


export default function CareerCard({ data, option }) {

    const handleWaitingClick = (careerId) => {
        if (window.confirm('Are you sure you want to change the status to Waiting?')) {
            const db = getDatabase();
            const careerRef = ref(db, `careers/${careerId}`);
            update(careerRef, { status: 'waiting' });
        }
    };

    const handleSelectedClick = (careerId) => {
        if (window.confirm('Are you sure you want to change the status to Selected?')) {
            const db = getDatabase();
            const careerRef = ref(db, `careers/${careerId}`);
            update(careerRef, { status: 'selected' });
        }
    };

    const handleRejectedClick = (careerId) => {
        if (window.confirm('Are you sure you want to change the status to Rejected?')) {
            const db = getDatabase();
            const careerRef = ref(db, `careers/${careerId}`);
            update(careerRef, { status: 'rejected' });
        }
    };

    const handleDeleteClick = (careerId) => {
        if (window.confirm('Are you sure you want to delete this career entry?')) {
            const db = getDatabase();
            const careerRef = ref(db, `careers/${careerId}`);
            remove(careerRef)
                .then(() => {
                    console.log('Career entry deleted successfully');
                    // Optionally perform any other actions after deletion
                })
                .catch((error) => {
                    console.error('Error deleting career entry:', error);
                    // Handle errors or show error messages
                });
        }
    };

    return (
        <div>
            {data.map((career) => (
                <div key={career.timestamp} className="bg-white gap-4 flex flex-col p-4 shadow rounded">
                    <div className='bg-base opacity-90 shadow-lg -p-4 rounded flex place-items-center justify-between p-4'>
                        <p className="text-primary uppercase text-3xl font-poppins mb-2">
                            <span className="font-bold"></span> {career.name}
                        </p>
                        {option !== "applied" ?
                            <div>
                                <button
                                    onClick={() => handleDeleteClick(career.id)}
                                    title="Rejected"
                                    className="text-black hover:text-red-600 bg-base text-3xl py-2 px-4 rounded-md mb-2"
                                >
                                    <Icon icon="mdi:delete" />
                                </button>
                            </div>
                            :
                            <div>
                                <button
                                    onClick={() => handleWaitingClick(career.id)}
                                    title="Waiting List"
                                    className="text-black hover:text-primary bg-base text-3xl py-2 px-4 rounded-md mb-2"
                                >
                                    <Icon icon="icon-park-twotone:mail-review" />
                                </button>
                                <button
                                    onClick={() => handleSelectedClick(career.id)}
                                    title="Selected"
                                    className="text-black hover:text-green-600 bg-base text-3xl py-2 px-4 rounded-md mb-2"
                                >
                                    <Icon icon="ep:select" />
                                </button>
                                <button
                                    onClick={() => handleRejectedClick(career.id)}
                                    title="Rejected"
                                    className="text-black hover:text-red-600 bg-base text-3xl py-2 px-4 rounded-md mb-2"
                                >
                                    <Icon icon="icon-park-outline:reject" />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(career.id)}
                                    title="Rejected"
                                    className="text-black hover:text-red-600 bg-base text-3xl py-2 px-4 rounded-md mb-2"
                                >
                                    <Icon icon="mdi:delete" />
                                </button>
                            </div>
                        }
                    </div>
                    <p className="text-black font-poppins mb-2">
                        <span className="font-bold">Email:</span> {career.email}
                    </p>
                    <p className="text-black font-poppins mb-2">
                        <span className="font-bold">Message:</span> {career.message}
                    </p>
                    <p className="text-black font-poppins mb-2">
                        <span className="font-bold">Number:</span> {career.number}
                    </p>
                    <p className="text-black font-poppins mb-2">
                        <span className="font-bold">Timestamp (IST):</span> {career.timestampIST}
                    </p>
                    <a
                        href={career.fileDownloadURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-poppins text-base block mb-2 hover:underline"
                    >
                        Resume Link
                    </a>
                </div>
            ))}
        </div>
    )
}

CareerCard.propTypes = {
    data: PropTypes.array.isRequired, // Validate data prop as an array and required
    option: PropTypes.string.isRequired, // Validate data prop as an array and required
};