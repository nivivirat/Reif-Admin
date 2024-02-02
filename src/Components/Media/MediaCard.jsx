import React, { useState, useEffect } from 'react';
import { database, storageFunctions, ref } from './firebase';

const AdminPanel = () => {
  const [mediaData, setMediaData] = useState([]);
  const [formData, setFormData] = useState({
    img: '',
    title: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingUid, setEditingUid] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const mediaSnapshot = await database.get('mediacard');
        const mediaData = mediaSnapshot.val();

        if (mediaData) {
          const dataArray = Object.entries(mediaData).map(([uid, data]) => ({ uid, ...data }));

          // Sort the array based on the date in ascending order
          dataArray.sort((a, b) => new Date(a.date) - new Date(b.date));

          setMediaData(dataArray);
        }
      } catch (error) {
        console.error('Error fetching data from Firebase:', error);
      }
    };

    fetchData();
  }, []);
  

  const handleAddNew = () => {
    setFormData({ img: '', title: '' });
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const handleEdit = (uid) => {
    const selectedMedia = mediaData.find((media) => media.uid === uid);
    setFormData(selectedMedia);
    setEditingUid(uid);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    setEditingUid(null);
    setFormData({
      img: '',
      title: '',
      date:'',
    });
    setImageFile(null);
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const handleDelete = async (uid) => {
    try {
      await database.remove(`mediacard/${uid}`);
      console.log('Media card deleted successfully!');
    } catch (error) {
      console.error('Error deleting media card:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      let imgURL = formData.img;

      if (imageFile) {
        const storageRef = storageFunctions.ref(`images/${imageFile.name}`);
        await storageFunctions.uploadBytes(storageRef, imageFile);
        imgURL = await storageFunctions.getDownloadURL(storageRef);
      }

      if (editingUid) {
        await database.set(`mediacard/${editingUid}`, {
          img: imgURL,
          title: formData.title,
        });
      } else {
        await database.push('mediacard', {
          img: imgURL,
          title: formData.title,
        });
      }

      console.log('Media card updated successfully!');
      setFormData({
        img: '',
        title: '',
        date:'',
      });
      setImageFile(null);
      setEditingUid(null);
      setShowAddForm(false);
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating media card:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: 'auto', width: '80%', padding: '20px' }}>
      <h2 style={{ fontSize: '32px', color: '#013A98' }}>Admin Panel</h2>

      <button
        style={{
          fontSize: '20px',
          padding: '10px',
          backgroundColor: '#013A98',
          color: 'white',
          borderRadius: '5px',
          marginBottom: '20px',
        }}
        onClick={handleAddNew}
      >
        Add New Media Card
      </button>

      {showAddForm && (
        <div className='fixed top-0 left-0 z-40 w-full h-full bg-gray-200 bg-opacity-50 flex justify-center items-center overflow-auto'>

          <form onSubmit={handleFormSubmit} className="mt-8 p-8 bg-white rounded-lg shadow-md w-96 mx-auto">
            <div className="mb-4">
              <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
                Image:
              </label>
              <br></br>
              <h6>Please provide same dimension of all images in this section preferably (550 * 550)</h6>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                Title:
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              >
                Save New Media Card
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}


      {showEditForm && (
        <div className='fixed top-0 left-0 z-40 w-full h-full bg-gray-200 bg-opacity-50 flex justify-center items-center overflow-auto'>

          <form onSubmit={handleFormSubmit} className="mt-8 p-8 bg-white rounded-lg shadow-md w-96 mx-auto">
            <div className="mb-4">

              <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
                Image:
              </label>
              <br></br>
              <h6>Please provide same dimension of all images in this section preferably (550 * 550)</h6>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                Title:
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel Edit
              </button>
            </div>
          </form>
        </div>
      )}
      <div>
      {mediaData.slice().reverse().map((media) => (
  <div key={media.uid} style={{ border: '1px solid #013A98', padding: '20px', marginBottom: '20px', borderRadius: '10px', textAlign: 'left' }}>
    <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Media Card {media.uid}</p>
    <img src={media.img} alt={`Media Card ${media.uid}`} style={{ maxWidth: '100%', marginBottom: '10px', borderRadius: '5px' }} />
    <p style={{ fontSize: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Title: {media.title}</p>

    <button style={{ fontSize: '18px', backgroundColor: '#013A98', color: 'white', padding: '5px', borderRadius: '5px', marginRight: '5px' }} onClick={() => handleEdit(media.uid)}>
      Edit
    </button>
    <button style={{ fontSize: '18px', backgroundColor: 'red', color: 'white', padding: '5px', borderRadius: '5px' }} onClick={() => handleDelete(media.uid)}>
      Delete
    </button>
  </div>
))}

      </div>
    </div>
  );
};

export default AdminPanel;
