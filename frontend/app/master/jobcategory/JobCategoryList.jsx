"use client";
import { BASE_URL } from "../../config/apiConfig";

export default function JobCategoryList({ categories, setEditItem, reload }) {
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;

    const res = await fetch(`${BASE_URL}/api/job-categories/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Deleted");
      reload();
    }
  };

  return (
    <div className="mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Job Categories</h2>

      <table className="w-full border border-collapse">
        <thead className="bg-[#CCE9F2]">
          <tr>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Active</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td className="p-2 border">{cat.jobCategory}</td>
              <td className="p-2 border">{cat.is_active ? "Yes" : "No"}</td>
              <td className="p-2 border-t flex gap-3 justify-center">

                {/* Edit Icon */}
                <button onClick={() => setEditItem(cat)}
                  className="p-1.5 bg-black hover:bg-gray-900 text-white rounded-full shadow"
                  title="Edit"
                >
                  ✏️
                </button>

                {/* Delete Icon */}
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="p-2 rounded hover:bg-gray-100 transition"
                  title="Delete"
                >
                  🗑️
                </button>

              </td>
            </tr>
          ))}

          {categories.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center p-4">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
