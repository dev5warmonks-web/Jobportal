"use client";

export default function ApplicationsList({ applications, setEditItem, reload }) {
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`https://api.mindssparsh.com/api/applications/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#CCE9F2]">
          <tr>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Notes</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-3 text-center text-gray-500">
                No applications found
              </td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr key={app._id} className="hover:bg-gray-100 border">
                <td className="p-3 border">{app.status}</td>
                <td className="p-3 border">{app.notes?.substring(0, 50)}...</td>
                <td className="p-3 border space-x-2">
                  <button
                    onClick={() => setEditItem(app)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(app._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
