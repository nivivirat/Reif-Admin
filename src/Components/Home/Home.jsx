import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, set } from 'firebase/database';

const Home = () => {
    const [bannerData, setBannerData] = useState([]);
    const [editedData, setEditedData] = useState({});
    const [editedIndex, setEditedIndex] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // Get a reference to the Firebase Realtime Database
        const db = getDatabase();

        // Reference to the 'HomeBanner' node in the database
        const homeDataRef = ref(db, 'HomeBanner');

        // Fetch data from Firebase and listen for changes
        onValue(homeDataRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setBannerData(data); // Set the fetched data to the state
            } else {
                setBannerData([]); // If no data exists, set an empty array
            }
        });
    }, []);

    const handleInputChange = (key, value) => {
        setEditedData({ ...editedData, [key]: value });
    };

    const handleEdit = (index) => {
        // Set the data to edit and its index
        setEditedData(bannerData[index]);
        setEditedIndex(index);
        setIsEditing(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setEditedData({
                ...editedData,
                image: reader.result,
            });
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };


    const handleSaveChanges = () => {
        if (editedData.subtext && (editedData.image || editedData.text)) {
            // Only allow saving if subtext is present and either image or text is present
            const newData = [...bannerData];
            newData[editedIndex] = editedData;
            setBannerData(newData);

            // Update the edited data in Firebase Realtime Database
            const db = getDatabase();
            const homeDataRef = ref(db, 'HomeBanner');
            set(homeDataRef, newData)
                .then(() => {
                    console.log('Data updated successfully');
                    setEditedData({}); // Clear the edited data after saving changes
                    setEditedIndex(null);
                })
                .catch((error) => {
                    console.error('Error updating data: ', error);
                });
        } else {
            alert('Subtext is mandatory, and either image or text must be provided.');
        }
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-4">Home Banner Data:</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Display the fetched data */}
                {bannerData.map((item, index) => (

                    <div key={index} className="bg-white p-4 shadow rounded-lg hover:bg-gray-300">
                        <p className="text-black py-4 font-bold">Slide {index + 1}</p>
                        {item.image && (
                            <img
                                src={item.image}
                                alt="Banner Image"
                                className="mb-2 rounded-lg lg:h-[180px] md:w-auto object-left md:h-[80px] sm:h-[120px] sm:w-[55%]"
                            />
                        )}
                        {item.text && (
                            <h2 className="text-xl font-bold mb-2">{item.text}</h2>
                        )}
                        <p className="text-gray-700">{item.subtext}</p>
                        <button
                            type="button"
                            onClick={() => handleEdit(index)}
                            className="bg-primary text-white px-4 py-2 mt-2 rounded-md hover:bg-blue-700"
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>

            {isEditing && (
                <form className="mt-8">
                    <p className='text-[20px] font-bold py-5'>Slide {editedIndex + 1}</p>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Choose Type:</label>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="image"
                                name="type"
                                value="image"
                                checked={!!editedData.image}
                                onChange={() => {
                                    setEditedData({
                                        ...editedData,
                                        image: editedData.text ? '' : 'default image URL',
                                        text: ''
                                    });
                                }}
                                className="mr-2"
                            />
                            <label htmlFor="image" className="mr-4">Image</label>
                            <input
                                type="radio"
                                id="text"
                                name="type"
                                value="text"
                                checked={!!editedData.text}
                                onChange={() => {
                                    setEditedData({
                                        ...editedData,
                                        text: editedData.image ? '' : 'default text',
                                        image: ''
                                    });
                                }}
                                className="mr-2"
                            />
                            <label htmlFor="text">Text (max 15 words)</label>
                        </div>
                    </div>
                    {/* Input fields */}
                    {editedData.text && (
                        <textarea
                            type="text"
                            placeholder="Text"
                            onChange={(e) => handleInputChange('text', e.target.value)}
                            value={editedData.text || ''}
                            rows="2"
                            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                        />
                    )}
                    {editedData.image && (
                        <div className="mt-2">
                            <label htmlFor="imageFile" className="block text-gray-700 font-bold mb-2">
                                Choose Image:
                            </label>
                            <input
                                type="file"
                                id="imageFile"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e)}
                                className="p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                    )}
                    <textarea
                        type="text"
                        placeholder="Subtext (Mandatory)"
                        onChange={(e) => handleInputChange('subtext', e.target.value)}
                        value={editedData.subtext || ''}
                        required
                        rows="2"
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                    />
                    <button
                        type="button"
                        onClick={handleSaveChanges}
                        className="mt-4 bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </form>
            )}
        </div>
    );
};

export default Home;
