"use client";
import { BASE_URL } from "../../config/apiConfig";

export default function ExpectedCTCList({ ctcs, setEditItem, reload }) {
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;

    const res = await fetch(`${BASE_URL}/api/expected-ctc/${id}`, {
      method: "DELETE",
    });
    if (res.ok) reload();
  };

  return (
    <div className="mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Expected CTC</h2>
      <table className="w-full border">
        <thead className="bg-[#CCE9F2]">
          <tr>
            <th className="p-2 border">CTC Range</th>
            <th className="p-2 border">Active</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ctcs.map((ctc) => (
            <tr key={ctc._id}>
              <td className="p-2 border">
                {ctc.minCTC === ctc.maxCTC ? ctc.minCTC : `${ctc.minCTC}-${ctc.maxCTC}`}
              </td>
              <td className="p-2 border">{ctc.is_active ? "Yes" : "No"}</td>
              <td className="p-2 border flex gap-3">
                {/* Edit Icon */}
                <button onClick={() => setEditItem(ctc)}
                  className="p-1.5 bg-black hover:bg-gray-900 text-white rounded-full shadow"
                  title="Edit"
                >
                  ✏️
                </button>

                {/* Delete Icon */}
                <button
                  onClick={() => handleDelete(ctc._id)}
                  className="p-2 rounded hover:bg-gray-100 transition"
                  title="Delete"
                >
                  🗑️
                </button>

              </td>
            </tr>
          ))}
          {ctcs.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center p-4">No data found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
