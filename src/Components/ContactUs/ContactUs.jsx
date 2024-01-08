import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import ContactUsCard from './ContactUs/ContactUsCard';

export default function ContactUs() {
    const [contactData, setContactData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dbRef = ref(getDatabase(), 'contactUs');

                onValue(dbRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const contactArray = Object.values(data);
                        setContactData(contactArray);
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
        <div className='p-4'>
            <h1 className="text-2xl font-bold mb-4 px-4">Contact Us ({contactData.length})</h1>
            <div>
                <ContactUsCard contactData={contactData} />
            </div>
        </div>
    );
}
