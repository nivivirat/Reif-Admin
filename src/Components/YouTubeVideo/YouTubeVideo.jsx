import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, push, update, remove, child } from 'firebase/database';
import { Icon } from '@iconify/react';

export default function YouTubeVideo() {
    const [videos, setVideos] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [newLink, setNewLink] = useState('');
    const [newOrder, setNewOrder] = useState('');
    const [editedLink, setEditedLink] = useState('');

    useEffect(() => {
        // Initialize Firebase database
        const db = getDatabase();

        // Reference to 'ytlinks' node in the database
        const ytLinksRef = ref(db, 'ytlinks');

        // Listen for changes to the data
        onValue(ytLinksRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Convert data object to array and sort by order value
                const sortedVideos = Object.entries(data).map(([id, value]) => ({ ...value, id })).sort((a, b) => a.order - b.order);
                setVideos(sortedVideos);
            }
        });
    }, []);

    // Function to extract video ID from YouTube URL
    const extractVideoId = (url) => {
        let videoId = '';
        if (url.includes('youtube.com')) {
            const urlParams = new URLSearchParams(new URL(url).search);
            videoId = urlParams.get('v');
        } else if (url.includes('youtu.be')) {
            videoId = url.split('/').pop();
        }
        return videoId;
    };

    const goToNextVideo = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
    };

    const goToPreviousVideo = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
    };

    const addNewLink = () => {
        if (newLink && newOrder) {
            const db = getDatabase();
            const ytLinksRef = ref(db, 'ytlinks');
            const newLinkData = {
                link: newLink,
                order: parseInt(newOrder)
            };
            push(ytLinksRef, newLinkData);
            setNewLink('');
            setNewOrder('');
        }
    };

    const editLink = (linkId, newLinkValue) => {
        const db = getDatabase();
        const ytLinksRef = ref(db, 'ytlinks');
        update(ytLinksRef, {
            [`${linkId}/link`]: newLinkValue
        });
    };


    const editLinkOrder = (linkId, newOrderValue) => {
        const db = getDatabase();
        const ytLinksRef = ref(db, 'ytlinks');
        update(ytLinksRef, {
            [`${linkId}/order`]: parseInt(newOrderValue) // Update only the order property
        });
    };

    const deleteLink = (linkId) => {
        try {
            const db = getDatabase();
            const ytLinksRef = ref(db, 'ytlinks');
            const linkToDeleteRef = child(ytLinksRef, linkId);
            remove(linkToDeleteRef)
                .then(() => {
                    // Successfully deleted the link
                    console.log(`Link with ID ${linkId} deleted successfully.`);
                })
                .catch((error) => {
                    // Failed to delete the link
                    console.error(`Error deleting link with ID ${linkId}: ${error.message}`);
                });
        } catch (error) {
            console.error('Error occurred while attempting to delete link:', error);
        }
    };

    return (
        <div className='flex justify-center flex-row md:pb-10'>
            <div className='flex flex-col items-center'>
                {videos.length > 0 && (
                    <div className='flex flex-row items-center'>
                        <button className='text-primary px-4 py-2 rounded-l' onClick={goToPreviousVideo}>
                            <Icon icon="grommet-icons:form-previous" />
                        </button>
                        <iframe
                            width="700"
                            height="415"
                            src={`https://www.youtube.com/embed/${extractVideoId(videos[currentIndex].link)}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        <button className='text-primary px-4 py-2 rounded-r' onClick={goToNextVideo}>
                            <Icon icon="grommet-icons:form-next" />
                        </button>
                    </div>
                )}
                <div className='mt-4'>
                    <input
                        type="text"
                        placeholder="Enter YouTube link"
                        value={newLink}
                        onChange={(e) => setNewLink(e.target.value)}
                        className="border border-gray-300 rounded-md py-2 px-4 mr-2"
                    />
                    <input
                        type="number"
                        placeholder="Enter order"
                        value={newOrder}
                        onChange={(e) => setNewOrder(e.target.value)}
                        className="border border-gray-300 rounded-md py-2 px-4 mr-2"
                    />
                    <button className='bg-primary text-white px-4 py-2 rounded-md mt-2' onClick={addNewLink}>Add New Link</button>
                </div>
                <div className='mt-4'>
                    <table className="border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border-b border-gray-300 py-2 px-4">Link</th>
                                <th className="border-b border-gray-300 py-2 px-4">Edit Order</th>
                                <th className="border-b border-gray-300 py-2 px-4">Edit Link</th>
                                <th className="border-b border-gray-300 py-2 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos.map((video, index) => (
                                <tr key={index} className={(index % 2 === 0 ? 'bg-gray-100' : '')}>
                                    <td className="border-b border-gray-300 py-2 px-4">{video.link}</td>
                                    <td className="border-b border-gray-300 py-2 px-4">
                                        <input
                                            type="number"
                                            placeholder="New order"
                                            value={video.order}
                                            onChange={(e) => editLinkOrder(video.id, e.target.value)}
                                            className="border border-gray-300 rounded-md py-1 px-2"
                                        />
                                    </td>
                                    <td className="border-b border-gray-300 py-2 px-4">
                                        <input
                                            type="text"
                                            placeholder="New link"
                                            value={editedLink}
                                            onChange={(e) => setEditedLink(e.target.value)}
                                            className="border border-gray-300 rounded-md py-1 px-2"
                                        />
                                    </td>
                                    <td className="border-b border-gray-300 py-2 px-4">
                                        <button className="text-primary mr-2" onClick={() => editLink(video.id, editedLink)}>
                                            Edit Link
                                        </button>
                                        <button className="text-primary" onClick={() => deleteLink(video.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
