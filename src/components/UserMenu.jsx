import React from 'react';

const UserMenu = ({ menu, setMenu, menuPos, users, handleModifyButton, handleOneuser, handleDelete }) => {
  if (!menu) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bg-white shadow-lg rounded-md w-40 z-[9999]"
      style={{
        top: menuPos.y-30,
        left: menuPos.x - 180,
      }}
    >
      <div
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => {
          handleModifyButton(users.find(u => u._id === menu));
          setMenu(null);
        }}
      >
        Edit
      </div>

      <div
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => {
          handleOneuser(users.find(u => u._id === menu));
          setMenu(null);
        }}
      >
        User Details
      </div>

      <div
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
        onClick={() => {
          handleDelete(users.find(u => u._id === menu));
          setMenu(null);
        }}
      >
        Remove
      </div>
    </div>
  );
};

export default UserMenu;