"use client"

import { addNewUser } from "./actions";

export default function AddNewUser() {
  return (
    <button onClick={() => addNewUser()} className="bg-blue-500 text-white py-2 px-4 rounded">Add New User</button>
  );
}


