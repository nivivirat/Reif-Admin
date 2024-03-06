import { useState, useEffect } from 'react';
import { storageFunctions } from './firebase';
import { get, ref, set } from 'firebase/database';
import { db } from '../../../firebase';

export default function CareersImage() {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imgURL, setImgURL] = useState(null);

    useEffect(() => {
        // Fetch the current image URL from the database
        const databaseRef = ref(db, 'CareerImg/img');
        get(databaseRef).then((snapshot) => {
            if (snapshot.exists()) {
                setImgURL(snapshot.val());
            }
        });
    }, []);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        setImageFile(file);

        // Check if a file is selected
        if (!file) {
            return;
        }

        // Show loading screen
        setLoading(true);

        try {
            const storageRef = storageFunctions.ref(`images/${file.name}`);
            await storageFunctions.uploadBytes(storageRef, file);
            const newImgURL = await storageFunctions.getDownloadURL(storageRef);

            // Update the data in the database
            const databaseRef = ref(db, 'CareerImg/img');
            await set(databaseRef, newImgURL);

            // Update the state with the new image URL
            setImgURL(newImgURL);

            console.log('Data successfully saved to the database');
            alert(
                'The image is updated successfully! Please refresh the page to see the changes.'
            );
        } catch (error) {
            console.error('Error saving data to the database:', error);
            alert('Error uploading image');
        } finally {
            // Hide loading screen
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto px-4">
            <h1 className="text-3xl font-bold mb-4">Career Page image:</h1>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                    Upload Image (1400w * 700h px)
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {loading && <p className="mt-2 text-sm text-gray-500">Loading...</p>}
            </div>
            {imgURL && (
                <div>
                    <p className="text-lg font-semibold mb-2">Current Image</p>
                    <img
                        src={imgURL}
                        alt="Current Career Image"
                        className="md:w-[1417px] md:h-[729px] md:px-[10%] object-contain"
                    />
                </div>
            )}
        </div>
    );
}
