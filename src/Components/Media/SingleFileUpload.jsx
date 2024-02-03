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
    'sans-serif',   
    'monospace',    
    'cursive',      
    'fantasy',      
  ];

  function formatText(command, value = null) {
    const hasSelection = document.getSelection().toString() !== '';
  
    switch (command) {
      case 'fontSize':
        value = prompt(`Enter the font size`);
        break;
      case 'foreColor':
        if (hasSelection) {
          const colorName = prompt('Enter a color name (e.g., red, blue):');
          value = getColorHexByName(colorName);
          if (value) {
            document.execCommand(command, false, value);
          } else {
            alert('Invalid color name.');
          }
        } else {
          alert('Please select text to apply color.');
        }
        return;
      case 'fontFamily':
        value = prompt(`Select a font family:\n${fontFamilyOptions.join('\n')}`);
        break;
      default:
        document.execCommand(command, false, value);
        return;
    }
  
    if (hasSelection) {
      const span = document.createElement('span');
      span.style[command] = value;
  
      const selection = window.getSelection();
      const range = selection.getRangeAt(0).cloneRange();
      range.surroundContents(span);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  
  function getColorHexByName(colorName) {
    // You can extend this function with additional color names and hex values
    const colorMap = {
      red: '#ff0000',
      blue: '#0000ff',
      green: '#008000',
      // Add more color names and hex values as needed
    };
  
    return colorMap[colorName.toLowerCase()] || null;
  }
  
  

  function inputColor(defaultColor) {
    const input = document.createElement('input');
    input.type = 'color';
    input.style.display = 'none';
    document.body.appendChild(input);
    input.value = defaultColor || '#000000';

    return new Promise((resolve) => {
      input.addEventListener('input', () => {
        resolve(input.value);
        document.body.removeChild(input);
      });

      input.click();
    });
  }

  function createLink() {
    const url = prompt('Enter the URL:');
    if (url) {
      document.execCommand('createLink', false, url);
      const linkElements = document.querySelectorAll('a');
      linkElements.forEach((link) => {
        link.style.color = '#3366cc'; // Set the color to dark blue
      });
    }
  }

  function updateHTMLContent() {
    const editorContent = document.getElementById('editor').innerHTML;
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
        </div>
        <div
          className="editor"
          contentEditable="true"
          id="editor"
          onInput={updateHTMLContent}
        ></div>
        <p id="innercontent"></p>
      </div>
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
  
    </div>
  );
};

export default SingleFileUpload;
