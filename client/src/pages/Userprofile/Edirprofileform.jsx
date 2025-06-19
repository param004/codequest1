import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateprofile } from '../../action/users';
import { setcurrentuser } from '../../action/currentuser';
import { requestNotificationPermission } from '../../utils/notify';

const Editprofileform = ({ currentuser, setswitch }) => {
  const dispatch = useDispatch();

  const [name, setname] = useState(currentuser?.result?.name || '');
  const [about, setabout] = useState(currentuser?.result?.about || '');
  const [tags, settags] = useState((currentuser?.result?.tags || []).join(', '));
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(
    currentuser?.result?.notificationEnabled !== false
  );

  useEffect(() => {
    setname(currentuser?.result?.name || '');
    setabout(currentuser?.result?.about || '');
    settags((currentuser?.result?.tags || []).join(', '));
    setNotificationEnabled(currentuser?.result?.notificationEnabled !== false);
    setAvatarFile(null);
  }, [currentuser]);

  useEffect(() => {
    if (avatarFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(avatarFile);
    } else {
      setAvatarPreview(
        currentuser?.result?.avatar
          ? (currentuser.result.avatar.startsWith('http')
              ? currentuser.result.avatar
              : `http://localhost:5000${currentuser.result.avatar}`)
          : '/default-avatar.png'
      );
    }
  }, [avatarFile, currentuser]);

  if (!currentuser || !currentuser.result) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('about', about);
      formData.append('tags', tags);
      formData.append('notificationEnabled', notificationEnabled);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const updatedUser = await dispatch(updateprofile(currentuser.result._id, formData));

      if (updatedUser && updatedUser.result) {
        localStorage.setItem("Profile", JSON.stringify(updatedUser));
        dispatch(setcurrentuser(updatedUser));
      }

      if (notificationEnabled) {
        requestNotificationPermission();
      }
      setswitch(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Profile update failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="edit-profile-form-modern">
      <div className="profile-header-modern" style={{ flexDirection: "column", alignItems: "center", gap: 0, marginBottom: 24 }}>
        <img
          src={avatarPreview}
          alt="avatar"
          className="profile-avatar-modern"
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '4px solid #0a95ff',
            background: '#f7fafd',
            boxShadow: '0 4px 18px rgba(10,149,255,0.13), 0 1.5px 8px rgba(0,0,0,0.07)',
            marginBottom: 14
          }}
        />
        <div className="profile-header-info" style={{ textAlign: 'center', width: "100%" }}>
          <h2>Edit Your Profile</h2>
        </div>
      </div>
      <form className="profile-form-modern" onSubmit={handleSubmit}>
        <div className="profile-form-columns" style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          <div className="profile-form-col" style={{ flex: 1, minWidth: 220 }}>
            <label>
              <span>Display name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setname(e.target.value)}
                required
                autoComplete="off"
              />
            </label>
            <label>
              <span>About me</span>
              <textarea
                value={about}
                onChange={(e) => setabout(e.target.value)}
                rows={3}
              />
            </label>
            <label>
              <span>Watched tags</span>
              <input
                type="text"
                value={tags}
                onChange={(e) => settags(e.target.value)}
                placeholder="e.g. javascript, react, css"
              />
            </label>
          </div>
          <div className="profile-form-col" style={{ flex: 1, minWidth: 180 }}>
            <label>
              <span>Upload avatar</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files[0])}
              />
            </label>
            <div className="checkbox-row-modern" style={{ marginTop: 18 }}>
              <input
                type="checkbox"
                checked={notificationEnabled}
                onChange={() => setNotificationEnabled(!notificationEnabled)}
                id="notify"
              />
              <label htmlFor="notify" style={{ marginLeft: 8 }}>Enable browser notifications</label>
            </div>
          </div>
        </div>
        <div className="form-actions-modern" style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24 }}>
          <button type="submit" className="user-submit-btn-modern" disabled={uploading}>
            {uploading ? "Saving..." : "Save Profile"}
          </button>
          <button type="button" className="user-cancel-btn-modern" onClick={() => setswitch(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Editprofileform;