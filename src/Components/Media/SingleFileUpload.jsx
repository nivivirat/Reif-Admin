import React, { useState } from 'react';
import { database, storageFunctions } from './firebase';
import './style.css';
import { useParams } from 'react-router-dom';

const SingleFileUpload = () => {
  const [image, setImage] = useState(null);
  const [downloadURL, setDownloadURL] = useState('');
  const [innerHTML, setHTML] = useState([]);
  const { id } = useParams();

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  function formatText(command, value = null) {
    switch (command) {
      case 'fontSize':
      case 'foreColor':
        value = prompt(`Enter the ${command === 'fontSize' ? 'font size' : 'text color'}`);
        break;
      case 'fontFamily':
        value = prompt(`Select a font family:\n${fontFamilyOptions.join('\n')}`);
        break;
      default:
        document.execCommand(command, false, value);
        return;
    }
  
    // Create a span element with the selected style
    const span = document.createElement('span');
    span.style[command] = value;
  
    // Surround the selected text with the span element
    const selection = window.getSelection();
    const range = selection.getRangeAt(0).cloneRange();
    range.surroundContents(span);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  const fontFamilyOptions = [
    'Arial, sans-serif',
    'Times New Roman, serif',
    'Courier New, monospace',
    'Georgia, serif',
    'Verdana, sans-serif',
    'Tahoma, sans-serif',
    'Helvetica, sans-serif',
    'Calibri, sans-serif',
    'Palatino, serif',
    'Garamond, serif',
    'Times, serif', 
    'sans-serif',   // Fallback for generic sans-serif
    'monospace',    // Fallback for generic monospace
    'cursive',      // Fallback for generic cursive
    'fantasy',      // Fallback for generic fantasy
  ];
  

  function createLink() {
    var url = prompt('Enter the URL:');
    if (url) {
      document.execCommand('createLink', false, url);
    }
  }

  function updateHTMLContent() {
    var editorContent = document.getElementById('editor').innerHTML;
    document.getElementById('innercontent').innerHTML = editorContent;
    setHTML(editorContent);
  }

  const handleUpload = async () => {
    if (!image) {
      console.error('Please select an image');
      alert("Please select an image");
      return;
    }

    try {
      const storageRef = storageFunctions.ref(`images/${image.name}`);
      await storageFunctions.uploadBytes(storageRef, image);

      const downloadURL = await storageFunctions.getDownloadURL(storageRef);
      const data = {
        Image: downloadURL,
        HTMLContent: innerHTML,
      };
      await database.set(`Media/${id}/innerContent`, data);
      setDownloadURL(downloadURL);
      console.log('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <>
        {downloadURL && (
          <div className="image-preview">
            <img
              src={downloadURL}
              alt="Uploaded"
              style={{ maxWidth: '100%', margin: '0 auto' }}
            />
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <input
            style={{
              margin: '0 5px',
              backgroundColor: '#3498db',
              color: '#fff',
              padding: '12px',
            }}
            type="file"
            onChange={handleImageChange}
          />
        </div>
        <div className="editor-container">
          <div className="toolbar">
            <button
              style={{
                margin: '0 5px',
                backgroundColor: '#3498db',
                color: '#fff',
                padding: '2px',
                paddingLeft: '10px',
                paddingRight: '10px',
              }}
              onClick={() => formatText('bold')}
            >
              Bold
            </button>
            <button
              style={{
                margin: '0 5px',
                backgroundColor: '#3498db',
                color: '#fff',
                padding: '2px',
                paddingLeft: '10px',
                paddingRight: '10px',
              }}
              onClick={() => formatText('italic')}
            >
              Italic
            </button>
            <button
              style={{
                margin: '0 5px',
                backgroundColor: '#3498db',
                color: '#fff',
                padding: '2px',
                paddingLeft: '10px',
                paddingRight: '10px',
              }}
              onClick={() => formatText('underline')}
            >
              Underline
            </button>
            <button
              style={{
                margin: '0 5px',
                backgroundColor: '#3498db',
                color: '#fff',
                padding: '2px',
                paddingLeft: '10px',
                paddingRight: '10px',
              }}
              onClick={createLink}
            >
              Add Link
            </button>
            <button
              style={{
                margin: '0 5px',
                backgroundColor: '#3498db',
                color: '#fff',
                padding: '2px',
                paddingLeft: '10px',
                paddingRight: '10px',
              }}
              onClick={() => formatText('fontSize')}
            >
              Font Size
            </button>
            <button
              style={{
                margin: '0 5px',
                backgroundColor: '#3498db',
                color: '#fff',
                padding: '2px',
                paddingLeft: '10px',
                paddingRight: '10px',
              }}
              onClick={() => formatText('foreColor')}
            >
              Text Color
            </button>
            <button
              style={{
                margin: '0 5px',
                backgroundColor: '#3498db',
                color: '#fff',
                padding: '2px',
                paddingLeft: '10px',
                paddingRight: '10px',
              }}
              onClick={() => formatText('fontFamily')}
            >
              Font Family
            </button>
            {/* Remove the ordered and unordered list buttons */}
          </div>
          <div
            className="editor"
            contentEditable="true"
            id="editor"
            onInput={updateHTMLContent}
          ></div>
          <p id="innercontent"></p>
        </div>
      </>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          style={{
            margin: '0 auto',
            backgroundColor: '#3498db',
            color: '#fff',
            padding: '12px',
            display: 'block',
          }}
          onClick={handleUpload}
        >
          UPLOAD
        </button>
      </div>
      <>{innerHTML}</>
    </div>
  );
};

export default SingleFileUpload;
