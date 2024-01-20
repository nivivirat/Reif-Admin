// AdminPanel.jsx
import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, remove, set, push } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDiNLjf19bW0-5cvkOtdlqYI7YiDzt3WA0",
  authDomain: "reifenhauser-2d366.firebaseapp.com",
  projectId: "reifenhauser-2d366",
  storageBucket: "reifenhauser-2d366.appspot.com",
  messagingSenderId: "1000320736803",
  appId: "1:1000320736803:web:c9db2603f14597edf45b96",
  measurementId: "G-80E388KDKZ",
};

const initialTestimonialState = {
  buttonText: '',
  pos: '',
  kl: '',
  poss: '',
  description: '',
};

function TestAdmin() {
  const [testimonials, setTestimonials] = useState([]);
  const [testimonial, setTestimonial] = useState(initialTestimonialState);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const firebaseApp = initializeApp(firebaseConfig);
    const database = getDatabase(firebaseApp);
    const testimonialsRef = ref(database, 'testimonials');

    onValue(testimonialsRef, (snapshot) => {
      const data = snapshot.val();
      const testimonialsArray = [];

      for (const uid in data) {
        const testimonial = {
          uid,
          ...data[uid],
        };

        testimonialsArray.push(testimonial);
      }

      setTestimonials(testimonialsArray);
    });
  }, []);

  const handleDelete = (uid) => {
    const firebaseApp = initializeApp(firebaseConfig);
    const database = getDatabase(firebaseApp);
    const testimonialRef = ref(database, `testimonials/${uid}`);
    remove(testimonialRef);
  };

  const handleEdit = (uid) => {
    setEditingId(uid);
    const editedTestimonial = testimonials.find((test) => test.uid === uid);
    setTestimonial(editedTestimonial);
  };

  const handleUpdate = () => {
    const firebaseApp = initializeApp(firebaseConfig);
    const database = getDatabase(firebaseApp);
    const testimonialRef = ref(database, `testimonials/${editingId}`);
    set(testimonialRef, testimonial);
    setEditingId(null);
    setTestimonial(initialTestimonialState);
  };

  const handleAdd = () => {
    const firebaseApp = initializeApp(firebaseConfig);
    const database = getDatabase(firebaseApp);
    const testimonialsRef = ref(database, 'testimonials');
    const newTestimonialRef = push(testimonialsRef);
    set(newTestimonialRef, testimonial);
    setTestimonial(initialTestimonialState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Define limits for each field
    const maxLength = {
      buttonText: 15,
      pos: 20,
      kl: 20,
      poss: 20,
      description: 500,
    };
  
    // Check if the value exceeds the maximum length
    if (value.length > maxLength[name]) {
      // Display a warning pop-up
      alert(`${name} should not exceed ${maxLength[name]} characters.`);
      
      // Truncate the value to the maximum length
      const truncatedValue = value.slice(0, maxLength[name]);
  
      setTestimonial((prevTestimonial) => ({
        ...prevTestimonial,
        [name]: truncatedValue,
      }));
    } else {
      // If the value is within the limit, update the state directly
      setTestimonial((prevTestimonial) => ({
        ...prevTestimonial,
        [name]: value,
      }));
    }
  };
  
  

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-4xl font-bold mb-6"></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((test) => (
          <div key={test.uid} className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2">Edit Testimonial</h3>
            <h6 className="text-xs mb-2">Do not fill both company with position as well as company without position, company with position signifies that the position of the individual is mentioned.</h6>

            <label className="block mb-2">
              Name:
              <input
                type="text"
                name="buttonText"
                value={editingId === test.uid ? testimonial.buttonText : test.buttonText}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                disabled={editingId !== test.uid}
              />
            </label>
            <label className="block mb-2">
              Position:
              <input
                type="text"
                name="pos"
                value={editingId === test.uid ? testimonial.pos : test.pos}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                disabled={editingId !== test.uid}
              />
            </label>
            <label className="block mb-2">
              Company with position:
              <input
                type="text"
                name="kl"
                value={editingId === test.uid ? testimonial.kl : test.kl}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                disabled={editingId !== test.uid}
              />
            </label>
            <label className="block mb-2">
              Company without position:
              <input
                type="text"
                name="poss"
                value={editingId === test.uid ? testimonial.poss : test.poss}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                disabled={editingId !== test.uid}
              />
            </label>
            <label className="block mb-2">
              Description:
              <input
                type="text"
                name="description"
                value={editingId === test.uid ? testimonial.description : test.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                disabled={editingId !== test.uid}
              />
            </label>
            {editingId === test.uid ? (
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
              >
                Update Testimonial
              </button>
            ) : (
              <button
                onClick={() => handleEdit(test.uid)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => handleDelete(test.uid)}
              className="bg-red-500 text-white px-4 py-2 rounded-md mt-2 ml-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Add New Testimonial</h3>
        <label className="block mb-2">
          Name
          <input
            type="text"
            name="buttonText"
            value={testimonial.buttonText}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label className="block mb-2">
          Position:
          <input
            type="text"
            name="pos"
            value={testimonial.pos}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label className="block mb-2">
        Company with position:
          <input
            type="text"
            name="kl"
            value={testimonial.kl}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label className="block mb-2">
        Company without position:
          <input
            type="text"
            name="poss"
            value={testimonial.poss}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label className="block mb-2">
          Description:
          <input
            type="text"
            name="description"
            value={testimonial.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
        >
          Add Testimonial
        </button>
      </div>
    </div>
  );
}

export default TestAdmin;
