import { useEffect, useState } from 'react';
import { onValue, ref, getDatabase } from 'firebase/database';
import { db } from '../../../firebase';
import { Icon } from '@iconify/react';
import CareerTypeSelection from './CareersComponents/CareerTypeSelection/CareerTypeSelection';

export default function Careers() {

    const [selectedStatus, setselectedStatus] = useState('applied');

    const statusOptions = [
        { value: 'applied', label: 'Applied' },
        { value: 'waiting', label: 'Waiting' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'selected', label: 'Selected' },
    ];

    const handleStatusChange = (e) => {
        setselectedStatus(e.target.value);
    };

    const [careersData, setCareersData] = useState([]);
    const [applied, setApplied] = useState([]);
    const [waiting, setWaiting] = useState([]);
    const [rejected, setRejected] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const dbRef = ref(getDatabase(), 'careers');

            try {
                onValue(dbRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const dataArray = Object.values(data).map((career) => {
                            // Convert timestamp to IST
                            const timestampIST = new Date(career.timestamp).toLocaleString('en-US', {
                                timeZone: 'Asia/Kolkata',
                            });

                            return {
                                ...career,
                                timestampIST, // Add timestamp in IST to the career object
                            };
                        });

                        setCareersData(dataArray);
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

    useEffect(() => {
        // Filter careersData array based on status and set separate state arrays
        const appliedData = careersData.filter((career) => career.status === 'applied');
        const waitingData = careersData.filter((career) => career.status === 'waiting');
        const rejectedData = careersData.filter((career) => career.status === 'rejected');
        const selectedData = careersData.filter((career) => career.status === 'selected');

        setApplied(appliedData);
        setWaiting(waitingData);
        setRejected(rejectedData);
        setSelected(selectedData);
    }, [careersData]);

    return (
        <div className="py-8">
            <div className="mb-4 flex justify-between">
                <h1 className="text-3xl font-bold mb-4 first-letter:capitalize">{selectedStatus} Applications ({selectedStatus === 'applied' ? applied.length : selectedStatus === 'waiting' ? waiting.length : selectedStatus === 'rejected' ? rejected.length : selected.length})</h1>
                <div className='mr-[100px]'>
                    <select
                        className="border-2 border-gray-300 p-2 font-bold rounded-md text-gray-700 focus:outline-none focus:border-blue-300"
                        value={selectedStatus}
                        onChange={handleStatusChange}
                    >
                        {/* <option value="">Select Status</option> */}
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className=''>
                <CareerTypeSelection option={selectedStatus} />
            </div>
        </div>
    );
}
