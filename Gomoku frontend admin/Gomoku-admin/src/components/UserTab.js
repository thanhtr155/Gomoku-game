import React from "react";

const UserTab = ({ users }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User List</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">First Name</th>
            <th className="border p-2">Last Name</th>
            <th className="border p-2">Birthday</th>
            <th className="border p-2">Active</th>
            <th className="border p-2">Address</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.firstName}</td>
              <td className="border p-2">{user.lastName}</td>
              <td className="border p-2">{user.birthDay}</td>
              <td className="border p-2">{user.active ? "Yes" : "No"}</td>
              <td className="border p-2">{user.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTab;