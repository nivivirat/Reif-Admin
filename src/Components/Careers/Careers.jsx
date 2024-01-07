import { useEffect, useState } from 'react';
import { onValue, ref, getDatabase } from 'firebase/database';
import { db } from '../../../firebase';

export default function Careers() {
    const [careersData, setCareersData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const dbRef = ref(getDatabase(), 'careers');

            try {
                onValue(dbRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const dataArray = Object.values(data);
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

    return (
        <div className="py-8">
            <h1 className="text-3xl font-bold mb-4">Careers</h1>
            <div className="grid grid-cols-1 gap-4">
                {careersData.map((career) => (
                    <div key={career.timestamp} className="bg-white p-4 shadow rounded">
                        <p className="text-black font-poppins mb-2">
                            <span className="font-bold">Name:</span> {career.name}
                        </p>
                        <p className="text-black font-poppins mb-2">
                            <span className="font-bold">Email:</span> {career.email}
                        </p>
                        <p className="text-black font-poppins mb-2">
                            <span className="font-bold">Message:</span> {career.message}
                        </p>
                        <p className="text-black font-poppins mb-2">
                            <span className="font-bold">Number:</span> {career.number}
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
        </div>
    );
}
