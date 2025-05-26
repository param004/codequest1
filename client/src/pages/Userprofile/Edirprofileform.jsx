import React, { useState } from 'react';
import axios from 'axios';
import Edirprofileform from './Edirprofileform';

const Editprofile = ({ currentuser, setswitch }) => {
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!avatar) return alert("Please select an image first.");
    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
      const res = await axios.post('http://localhost:5000/upload-avatar', formData);
      setUploadedUrl(res.data.imageUrl);
      alert("Avatar uploaded successfully!");
      // TODO: send `res.data.imageUrl` to backend to update user's avatar in DB
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Avatar</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && (
        <>
          <p>Preview:</p>
          <img src={preview} alt="Avatar Preview" width="100" style={{ borderRadius: '50%' }} />
        </>
      )}
      <br />
      <button onClick={handleUpload}>Upload Avatar</button>

      <hr style={{ margin: '2rem 0' }} />

      {/* Render the existing form */}
      <Edirprofileform currentuser={currentuser} setswitch={setswitch} />
    </div>
  );
};

export default Editprofile;
