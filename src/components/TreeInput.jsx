import React, { useState } from "react";

function parseInput(str) {
  return str
    .split(",")
    .map((x) => x.trim())
    .map((x) => (x.toLowerCase() === "null" || x === "" ? null : Number(x)));
}

export default function TreeInput({ onSubmit }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => setInput(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    let arr = parseInput(input);
    if (!arr.length || arr.every((x) => x == null)) {
      setError("Please enter at least one valid node value.");
      return;
    }
    setError("");
    onSubmit(arr);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-col md:flex-row items-center gap-2">
      <input
        className="border rounded px-2 py-1 w-72"
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="e.g. 1,2,3,null,4"
        autoComplete="off"
      />
      <button
        className="bg-blue-200 text-white px-4 py-1 rounded hover:bg-blue-300 transition"
        type="submit"
      >
        Build Tree
      </button>
      {error && <div className="text-red-300 ml-2">{error}</div>}
    </form>
  );
}
