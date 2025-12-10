"use client";
import { BASE_URL } from "../../config/apiConfig";

export default function CandidatesList({ candidates, setEditItem, reload }) {
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/candidates/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      reload();
    } catch (err) {
      console.error(err);
    }
  };
  const handleEdit = (candidate) => {
    if (setEditItem) {
      setEditItem(candidate);
      // Scroll to top so user sees the form
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#CCE9F2]">
          <tr>
            <th className="py-3 px-4">Sl No</th>
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Skills</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-3 text-center text-gray-500">
                No candidates found
              </td>
            </tr>
          ) : (
            candidates.map((candidate, index) => (
              <tr key={candidate._id} className="hover:bg-gray-100 border">
                <td className="py-3 px-4 text-sm">{index + 1}</td>
                <td className="p-3 border">{candidate.firstName} {candidate.lastName}</td>
                <td className="p-3 border">{candidate.email}</td>
                {/* <td className="p-3 border">{candidate.skills?.substring(0, 50)}...</td> */}
                <td className="p-3 border">{candidate.skills?.join(", ") || "—"}</td>
                <td className="p-3 border space-x-2">
                  {/* <button
                    onClick={() => setEditItem(candidate._id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button> */}
                  <button
                    onClick={() => handleEdit(candidate)}
                    className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(candidate._id)}
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
