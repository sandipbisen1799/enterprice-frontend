import { Trash } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";

function ConformationBox({ onClose, onConfirm, message = "Are you sure you want to delete this item?" }) {
  const submitHandler = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete!");
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => onClose()}
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 flex flex-col gap-2.5" >
      <div className="flex justify-center items-center w-full h-full">
            <div className="w-16 h-16 bg-red-100 flex items-center text-center  justify-center rounded-2xl place-content-center">  <Trash  color="#FF0000" /></div>

      </div>

        <p className="text-lg font-normal text-gray-800 mb-4">
          {message}
        </p>
      
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => onClose()}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={submitHandler}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

export default ConformationBox;
