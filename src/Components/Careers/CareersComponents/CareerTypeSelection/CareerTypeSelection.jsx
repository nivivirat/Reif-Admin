import { useEffect, useState } from 'react';
import { onValue, ref, getDatabase } from 'firebase/database';  
import { db } from '../../../../../firebase';
import { Icon } from '@iconify/react';
import CareerCard from '../CareerCard/CareerCard'
import PropTypes from 'prop-types';

export default function CareerTypeSelection({ option }) {
    const [careersData, setCareersData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    console.log(option);

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

        console.log(careersData);

        // Cleanup function to detach listeners if needed
        return () => {
            // Remove listeners or perform cleanup (if applicable)
        };
    }, []);

    useEffect(() => {
        // Filter careersData array based on the option prop
        const filteredCareers = careersData.filter((career) => career.status === option);
        setFilteredData(filteredCareers);
        console.log(filteredCareers);
    }, [option, careersData]);

    return (
        <div className="py-8">
            <div className="grid grid-cols-1 gap-4 mr-[6%]">
                <CareerCard  data={filteredData} option={option}/>
            </div>
        </div>
    );
}

CareerTypeSelection.propTypes = {
    option: PropTypes.string.isRequired, // Validate data prop as an array and required
};