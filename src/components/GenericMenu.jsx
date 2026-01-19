import React from 'react';

const GenericMenu = ({ menu, setMenu, menuPos, options }) => {
  if (!menu) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed  bg-white shadow-lg rounded-md w-40 z-[9999]"
      style={{
        top: menuPos.y + 5,
        left: menuPos.x - 160,
      }}
    >
      {options.map((option, index) => (
        <div
          key={index}
          className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${option.className || ''}`}
          onClick={() => {
            option.onClick();
            setMenu(null);
          }}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default GenericMenu;