import React, { useState, useEffect, lazy } from 'react';
import { database, storageFunctions, ref, getDatabase, } from './firebase';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const [mediaData, setMediaData] = useState([]);
  const [mediaData1, setMediaData1] = useState([]);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    img: '',
    heading: '',
    description: '',
    routerlink: '',
    date: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingUid, setEditingUid] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [mediaCardData, setMediaCardData] = useState([]);
  const [formData1, setFormData1] = useState({
    img: '',
    title: '',
  });
  const [imageFile1, setImageFile1] = useState(null);
  const [editingUid1, setEditingUid1] = useState(null);
  const [showAddForm1, setShowAddForm1] = useState(false);
  const [showEditForm1, setShowEditForm1] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mediaSnapshot = await database.get('media');
        const mediaData = mediaSnapshot.val();

        if (mediaData) {
          const dataArray = Object.entries(mediaData).map(([uid, data]) => ({ uid, ...data }));
          setMediaData(dataArray);
        }
      } catch (error) {
        console.error('Error fetching media data from Firebase:', error);
      }
    };

    const fetchMediaCardData = async () => {
      try {
        const mediaCardSnapshot = await database.get('mediacard');
        const mediaCardData = mediaCardSnapshot.val();

        if (mediaCardData) {
          const dataArray = Object.entries(mediaCardData).map(([uid, data]) => ({ uid, ...data }));
          setMediaCardData(dataArray);
        }
      } catch (error) {
        console.error('Error fetching media card data from Firebase:', error);
      }
    };

    fetchData();
    fetchMediaCardData();
  }, []);

  const handleAddNew = () => {
    setFormData({ img: '', heading: '', description: '', routerlink: '', date: '' });
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
      heading: '',
      description: '',
      routerlink: '',
      date: '',
    });
    setImageFile(null);
    setShowAddForm(false);
    setShowEditForm(false);
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
      // Check if heading is empty or contains only whitespace
      if (!formData.heading.trim()) {
        alert('Please enter a heading.'); // You can replace this with a more user-friendly UI feedback
        return;
      }
  
      let imgURL = formData.img;
  
      if (imageFile) {
        const storageRef = storageFunctions.ref(`images/${imageFile.name}`);
        await storageFunctions.uploadBytes(storageRef, imageFile);
        imgURL = await storageFunctions.getDownloadURL(storageRef);
      }
  
      // ... existing code ...
  
      if (editingUid) {
        await database.set(`media/${editingUid}`, {
          img: imgURL,
          heading: formData.heading,
          description: formData.description,
          routerlink: formData.routerlink,
          date: formData.date,
        });
      } else {
        await database.push('media', {
          img: imgURL,
          heading: formData.heading,
          description: formData.description,
          routerlink: formData.routerlink,
          date: formData.date,
        });
      }
  
      alert('Media updated successfully! Please Refresh the page');
      setFormData({
        img: '',
        heading: '',
        description: '',
        routerlink: '',
        date: '',
      });
      setImageFile(null);
      setEditingUid(null);
      setShowAddForm(false);
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating media:', error);
    }
  };
  


  const handleAddNew1 = () => {
    setFormData1({ img: '', title: '' });
    setShowAddForm1(true);
    setShowEditForm1(false);
    navigate('/mediacard');
  };

  const handleEdit1 = (uid) => {
    const selectedMediaCard = mediaCardData.find((media) => media.uid === uid);
    setFormData1(selectedMediaCard);
    setEditingUid1(uid);
    setShowEditForm1(true);
    setShowAddForm1(false);
  };

  const handleCancelEdit1 = () => {
    setEditingUid1(null);
    setFormData1({
      img: '',
      title: '',
    });
    setImageFile1(null);
    setShowAddForm1(false);
    setShowEditForm1(false);
  };

  const handleDelete = async (uid) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this media?');
    if (!confirmDelete) {
      return;
    }

    try {
      await database.remove(`media/${uid}`);
      alert('Media deleted successfully! Please Refresh the page');
      setMediaData((prevData) => prevData.filter((media) => media.uid !== uid));
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };
  const generateRoute = (media) => {
    if (media && media.uid) {
      const sanitizedHeading = media.heading.replace(/\s+/g, '-');
      return `/media/${media.uid}/${sanitizedHeading}`;
    } else {
      // Handle the case where uid is undefined
      console.error('Invalid media object:', media);
      return '/error'; // or any other fallback route
    }
  };
  
  
  
  const handleImageChange1 = (e) => {
    const file = e.target.files[0];
    setImageFile1(file);
  };

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setFormData1((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit1 = async (e) => {
    e.preventDefault();

    try {
      let imgURL1 = formData1.img;

      if (imageFile1) {
        const storageRef1 = storageFunctions.ref(`images/${imageFile1.name}`);
        await storageFunctions.uploadBytes(storageRef1, imageFile1);
        imgURL1 = await storageFunctions.getDownloadURL(storageRef1);
      }

      if (editingUid1) {
        await database.set(`mediacard/${editingUid1}`, {
          img: imgURL1,
          title: formData1.title,
        });
      } else {
        await database.push('mediacard', {
          img: imgURL1,
          title: formData1.title,
        });
      }

      alert('Media card updated successfully! Please Refresh the page');
      setFormData1({
        img: '',
        title: '',
      });
      setImageFile1(null);
      setEditingUid1(null);
      setShowAddForm1(false);
      setShowEditForm1(false);
    } catch (error) {
      console.error('Error updating media card:', error);
    }
  };

  return (
    <>

      <div style={{ textAlign: 'center', margin: 'auto', width: '80%', padding: '20px' }} className='relative'>
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
          Add New Media
        </button>

        {showAddForm && (
          <div className='fixed top-0 left-0 z-40 w-full h-full bg-gray-200 bg-opacity-50 flex justify-center items-center overflow-auto'>
            <form onSubmit={handleFormSubmit} className="mt-8 p-8 bg-white rounded-lg shadow-md w-96 mx-auto">
              <div className="mb-4">
                <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
                  Image
                </label>
                <br></br>
                <h6>Please provide same dimension of all images in this section preferrably (500 * 500)</h6>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="heading" className="block text-gray-700 text-sm font-bold mb-2">
                  Heading:
                </label>
                <input
                  type="text"
                  id="heading"
                  name="heading"
                  value={formData.heading}
                  onChange={handleInputChange}
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                  Description:
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="routerlink" className="block text-gray-700 text-sm font-bold mb-2">
                  Router Link:
                </label>
                <input
                  type="text"
                  id="routerlink"
                  name="routerlink"
                  value={formData.routerlink}
                  onChange={handleInputChange}
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="routerlink" className="block text-gray-700 text-sm font-bold mb-2">
                  Date:
                </label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                  Save New Event
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
                </label><br></br>
                <h6>Please provide same dimension of all images in this section preferrably (500 * 500)</h6>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="heading" className="block text-gray-700 text-sm font-bold mb-2">
                  Heading:
                </label>
                <input
                  type="text"
                  id="heading"
                  name="heading"
                  value={formData.heading}
                  onChange={handleInputChange}
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                  Description:
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="routerlink" className="block text-gray-700 text-sm font-bold mb-2">
                  Router Link:
                </label>
                <input
                  type="text"
                  id="routerlink"
                  name="routerlink"
                  value={formData.routerlink}
                  onChange={handleInputChange}
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="routerlink" className="block text-gray-700 text-sm font-bold mb-2">
                  Date:
                </label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={formData.date}
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
              <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Media {media.uid}</p>
              <img src={media.img} alt={`Media ${media.uid}`} style={{ maxWidth: '100%', marginBottom: '10px', borderRadius: '5px' }} />
              <p style={{ fontSize: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Heading: {media.heading}</p>
              <p style={{ fontSize: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Description: {media.description}</p>
              <p style={{ fontSize: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Router Link: {media.routerlink}</p>
              <p style={{ fontSize: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Date: {media.date}</p>
              <button style={{ fontSize: '18px', backgroundColor: '#013A98', color: 'white', padding: '5px', borderRadius: '5px', marginRight: '5px' }} onClick={() => handleEdit(media.uid)}>
                Edit
              </button>
              <button style={{ fontSize: '18px', backgroundColor: 'red', color: 'white', padding: '5px', borderRadius: '5px' }} onClick={() => handleDelete(media.uid)}>
                Delete
              </button>
              {/* Gulshan Start */}
              <div>
                <button
                  style={{
                    fontSize: '18px',
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '5px',
                    borderRadius: '5px',
                  }}
                >
                <Link to={generateRoute(media)}>Go to Your Route</Link>


                </button>
              </div>
              <div>
                <button
                  style={{
                    fontSize: '18px',
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '5px',
                    borderRadius: '5px',
                  }}
                >
                  <a
                    href={`https://reifenhauser.onrender.com${generateRoute(media)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preview
                  </a>

                </button>
              </div>

              {/* Gulshan End */}

            </div>
          ))}
        </div>
      </div>
      <div style={{ textAlign: 'center', margin: 'auto', width: '80%', padding: '20px' }}>
        {/* <h2 style={{ fontSize: '32px', color: '#013A98' }}>Admin Panel</h2> */}

        <button
          style={{
            fontSize: '20px',
            padding: '10px',
            backgroundColor: '#013A98',
            color: 'white',
            borderRadius: '5px',
            marginBottom: '20px',
          }}
          onClick={handleAddNew1}
        >
          Add New Media Card
        </button>

        {showAddForm1 && (
          <div className='fixed top-0 left-0 z-40 w-full h-full bg-gray-200 bg-opacity-50 flex justify-center items-center overflow-auto'>

            <form onSubmit={handleFormSubmit1} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <label>
                Image  (please provide same dimension of all images in this section preferrably (500 * 500)):
                <input type="file" accept="image/*" onChange={handleImageChange1} />
              </label>
              <label>
                Title:
                <input type="text" name="title" value={formData1.title} onChange={handleInputChange1} />
              </label>

              <button type="submit" style={{ fontSize: '20px', padding: '10px', backgroundColor: '#013A98', color: 'white', borderRadius: '5px', marginTop: '10px' }}>
                Save New Media Card
              </button>
              <button
                type="button"
                onClick={handleCancelEdit1}
                style={{ fontSize: '20px', padding: '10px', backgroundColor: 'red', color: 'white', borderRadius: '5px', marginTop: '10px', marginLeft: '10px' }}
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {showEditForm1 && (
          <div className='fixed top-0 left-0 z-40 w-full h-full bg-gray-200 bg-opacity-50 flex justify-center items-center overflow-auto'>

            <form onSubmit={handleFormSubmit1} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <label>
                Image (please provide same dimension of all images in this section preferrably (500 * 500)):
                <input type="file" accept="image/*" onChange={handleImageChange1} />
              </label>
              <label>
                Title:
                <input type="text" name="title" value={formData1.title} onChange={handleInputChange1} />
              </label>

              <button type="submit" style={{ fontSize: '20px', padding: '10px', backgroundColor: '#013A98', color: 'white', borderRadius: '5px', marginTop: '10px' }}>
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancelEdit1}
                style={{ fontSize: '20px', padding: '10px', backgroundColor: 'red', color: 'white', borderRadius: '5px', marginTop: '10px', marginLeft: '10px' }}
              >
                Cancel Edit
              </button>
            </form>
          </div>
        )}

        <div>
          {/* {mediaData1.map((media) => (
          <div key={media.uid} style={{ border: '1px solid #013A98', padding: '20px', marginBottom: '20px', borderRadius: '10px', textAlign: 'left' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Media Card {media.uid}</p>
            <img src={media.img} alt={`Media Card ${media.uid}`} style={{ maxWidth: '100%', marginBottom: '10px', borderRadius: '5px' }} />
            <p style={{ fontSize: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Title: {media.title}</p>

            <button style={{ fontSize: '18px', backgroundColor: '#013A98', color: 'white', padding: '5px', borderRadius: '5px', marginRight: '5px' }} onClick={() => handleEdit1(media.uid)}>
              Edit
            </button>
            <button style={{ fontSize: '18px', backgroundColor: 'red', color: 'white', padding: '5px', borderRadius: '5px' }} onClick={() => handleDelete1(media.uid)}>
              Delete
            </button>
          </div>
        ))} */}
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
