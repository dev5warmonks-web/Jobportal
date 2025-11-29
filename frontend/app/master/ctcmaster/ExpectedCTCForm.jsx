'use client';

import { useState, useEffect, useRef } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export default function ExpectedCTCForm({ editItem, setEditItem, reload }) {
  const [form, setForm] = useState({
    minCTC: '0',
    maxCTC: '200',
    is_active: true,
  });

  const containerRef = useRef(null);

  useEffect(() => {
    if (editItem) {
      setForm({
        minCTC: editItem.minCTC.replace('K', '') || '0',
        maxCTC: editItem.maxCTC.replace('K', '') || '200',
        is_active: editItem.is_active ?? true,
      });
      // Focus & scroll wrapper div
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      setForm({ minCTC: '0', maxCTC: '200', is_active: true });
    }
  }, [editItem]);

  const handleSliderChange = (value) => {
    setForm({ ...form, minCTC: value[0].toString(), maxCTC: value[1].toString() });
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editItem ? 'PUT' : 'POST';
    const url = editItem
      ? `https://api.mindssparsh.com/api/expected-ctc/${editItem._id}`
      : `https://api.mindssparsh.com/api/expected-ctc`;

    const payload = {
      ...form,
      minCTC: `${form.minCTC}K`,
      maxCTC: `${form.maxCTC}K`,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Something went wrong');
      setForm({ minCTC: '0', maxCTC: '200', is_active: true });
      setEditItem(null);
      reload();
      alert(editItem ? 'Updated Successfully' : 'Added Successfully');
    } catch (err) {
      // alert(err.message);
      alert("CTC Range Exist");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mx-auto">
      <h2 className="text-xl font-bold mb-4">{editItem ? 'Edit' : 'Add'} CTC Range</h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1" ref={containerRef}>
          <label className="block mb-1 font-medium">CTC Range</label>
          <Slider
            range
            min={0}
            max={200}
            value={[parseInt(form.minCTC), parseInt(form.maxCTC)]}
            onChange={handleSliderChange}
          />
          <div className="flex justify-between mt-2">
            <span>{form.minCTC}K</span>
            <span>{form.maxCTC}K</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 md:mt-7">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <label className="font-medium">Active</label>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
      >
        {editItem ? 'Update' : 'Save'}
      </button>
    </form>
  );
}
