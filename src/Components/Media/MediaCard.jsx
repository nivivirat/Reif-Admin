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
        <form onSubmit={handleFormSubmit} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label>
            Image:
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
          <label>
            Title:
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} />
          </label>

          <button type="submit" style={{ fontSize: '20px', padding: '10px', backgroundColor: '#013A98', color: 'white', borderRadius: '5px', marginTop: '10px' }}>
            Save New Media Card
          </button>
          <button
            type="button"
            onClick={handleCancelEdit}
            style={{ fontSize: '20px', padding: '10px', backgroundColor: 'red', color: 'white', borderRadius: '5px', marginTop: '10px', marginLeft: '10px' }}
          >
            Cancel
          </button>
        </form>
      )}

      {showEditForm && (
        <form onSubmit={handleFormSubmit} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label>
            Image:
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
          <label>
            Title:
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} />
          </label>

          <button type="submit" style={{ fontSize: '20px', padding: '10px', backgroundColor: '#013A98', color: 'white', borderRadius: '5px', marginTop: '10px' }}>
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleCancelEdit}
            style={{ fontSize: '20px', padding: '10px', backgroundColor: 'red', color: 'white', borderRadius: '5px', marginTop: '10px', marginLeft: '10px' }}
          >
            Cancel Edit
          </button>
        </form>
      )}

      <div>
        {mediaData.map((media) => (
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
