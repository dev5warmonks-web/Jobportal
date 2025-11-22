"use client";

export default function JobLocationList({ locations, setEditItem, reload }) {
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;

    const res = await fetch(`http://localhost:5000/api/joblocation/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Deleted");
      reload();
    }
  };

  return (
    <div className="mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Job Location</h2>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Location</th>
            <th className="p-2 border">Active</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {locations.map((cat) => (
            <tr key={cat._id}>
              <td className="p-2 border">{cat.jobCategory}</td>
              <td className="p-2 border">
                {cat.is_active ? "Yes" : "No"}
              </td>
              <td className="p-2 border flex gap-3">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                  onClick={() => setEditItem(cat)}
                >
                  Edit
                </button>

                <button
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => handleDelete(cat._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {locations.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center p-4">
                No location found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
