'use client';

export default function DateList({ datelist, setEditItem, reload }) {
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;

    const res = await fetch(`http://localhost:5000/api/sort-by-dates/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Deleted");
      reload();
    }
  };

  return (
    <div className="mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Sort By Date</h2>

      <table className="w-full border">
        <thead className="bg-[#CCE9F2]">
          <tr>
            <th className="p-2 border">Sort By Date</th>
            <th className="p-2 border">Active</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {datelist.map((date) => (
            <tr key={date._id}>
              <td className="p-2 border">{date.sortByDate}</td>
              <td className="p-2 border">
                {date.is_active ? "Yes" : "No"}
              </td>
              <td className="p-2 border flex gap-3">
                {/* Edit Icon */}
                <button onClick={() => setEditItem(date)}
                  className="p-1.5 bg-black hover:bg-gray-900 text-white rounded-full shadow"
                  title="Edit"
                >
                   ✏️
                </button>

                {/* Delete Icon */}
                <button
                  onClick={() => handleDelete(date._id)}
                  className="p-2 rounded hover:bg-gray-100 transition"
                  title="Delete"
                >
                   🗑️
                </button>
              </td>
            </tr>
          ))}

          {datelist.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center p-4">
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
