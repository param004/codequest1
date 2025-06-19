import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { transferPoints } from "../../action/users";

const TransferPoints = ({ currentUser }) => {
  const [search, setSearch] = useState("");
  const [amount, setAmount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const users = useSelector((state) => state.usersreducer);
  const dispatch = useDispatch();

  const handleSearch = () => {
    const user = users.find(
      (u) =>
        u.name.toLowerCase() === search.toLowerCase() &&
        u._id !== currentUser._id
    );
    setSelectedUser(user || null);
  };

  const handleTransfer = () => {
    if (currentUser.points < 10) {
      alert("You need at least 10 points to transfer.");
      return;
    }
    if (!selectedUser) {
      alert("Please select a user to transfer points to.");
      return;
    }
    if (amount < 1) {
      alert("Amount must be at least 1.");
      return;
    }
    if (amount > currentUser.points) {
      alert("You do not have enough points.");
      return;
    }
    dispatch(
      transferPoints(currentUser._id, selectedUser._id, amount)
    );
    setAmount(0);
    setSelectedUser(null);
    setSearch("");
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Transfer Points</h3>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search user by name"
        style={{ marginRight: "8px" }}
      />
      <button onClick={handleSearch}>Search</button>
      {selectedUser && (
        <div style={{ marginTop: "10px" }}>
          <p>
            Transfer to: <strong>{selectedUser.name}</strong>
          </p>
          <input
            type="number"
            value={amount}
            min={1}
            max={currentUser.points}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Points"
            style={{ marginRight: "8px" }}
          />
          <button onClick={handleTransfer}>Transfer</button>
        </div>
      )}
    </div>
  );
};

export default TransferPoints;