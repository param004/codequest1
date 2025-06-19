import './Userprofile.css';
import React, { useState, useEffect } from 'react';
import Leftsidebar from '../../Comnponent/Leftsidebar/Leftsidebar';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from '../../Comnponent/Avatar/Avatar';
import Editprofileform from './Edirprofileform';
import Profilebio from './Profilebio';
import LoginHistory from './LoginHistory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBirthdayCake, faPen } from '@fortawesome/free-solid-svg-icons';
import { fetchallusers } from '../../action/users';

// Add these imports
import TransferPoints from './TransferPoints';
import LocationWidget from './LocationWidget';

const Userprofile = ({ slidein }) => {
  const { id } = useParams();
  const [Switch, setswitch] = useState(false);
  const dispatch = useDispatch();

  const users = useSelector((state) => state.usersreducer);
  const currentprofile = users.filter((user) => user._id === id)[0];
  const currentuser = useSelector((state) => state.currentuserreducer);

  useEffect(() => {
    if (!Switch) {
      dispatch(fetchallusers());
    }
  }, [Switch, dispatch]);

  if (!currentprofile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="home-container-1">
      <Leftsidebar slidein={slidein} />
      <div className="home-container-2">
        <section>
          {/* Hide user details and edit button when editing */}
          {!Switch && (
            <div className="user-details-container">
              <div className="user-details">
                {currentprofile?.avatar ? (
                  <img
                    src={
                      currentprofile.avatar.startsWith('http')
                        ? currentprofile.avatar
                        : `http://localhost:5000${currentprofile.avatar}`
                    }
                    alt="avatar"
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #ccc'
                    }}
                  />
                ) : (
                  <Avatar
                    backgroundColor="purple"
                    color="white"
                    fontSize="50px"
                    px="40px"
                    py="30px"
                  >
                    {currentprofile?.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                )}
                <div className="user-name">
                  <h1>{currentprofile?.name}</h1>
                  <p>
                    <FontAwesomeIcon icon={faBirthdayCake} /> Joined{' '}
                    {moment(currentprofile?.joinedon).fromNow()}
                  </p>
                  {/* Show points and badges */}
                  <p>
                    <strong>Points:</strong> {currentprofile.points || 0}
                  </p>
                  {currentprofile.badges && currentprofile.badges.length > 0 && (
                    <div>
                      <strong>Badges:</strong>{" "}
                      {currentprofile.badges.map((badge, idx) => (
                        <span key={idx} className="badge">{badge}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {currentuser?.result?._id === id && (
                <button
                  className="edit-profile-btn"
                  type="button"
                  onClick={() => setswitch(true)}
                >
                  <FontAwesomeIcon icon={faPen} /> Edit Profile
                </button>
              )}
            </div>
          )}
          <>
            {Switch ? (
              <Editprofileform
                currentuser={currentuser}
                setswitch={setswitch}
              />
            ) : (
              <>
                <Profilebio currentprofile={currentprofile} />
                {currentuser?.result?._id === id && (
                  <>
                    <LoginHistory userId={id} />
                    <div className="profile-info-card">
                      <TransferPoints currentUser={currentuser.result} />
                    </div>
                    <div className="profile-info-card">
                      <LocationWidget userId={id} location={currentprofile.location} />
                    </div>
                  </>
                )}
              </>
            )}
          </>
        </section>
      </div>
    </div>
  );
};

export default Userprofile;