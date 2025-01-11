"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation"; // Correct hook for Next.js 15

import toast from "react-hot-toast";
import { getCategoriesData } from "../reduxPart/categorySlice";
import Navbar from "../components/navbar";
import  updateExpanseData, { getExpansesData } from "../reduxPart/slice"
const RecordUpdateForm = () => {
  const searchParams = useSearchParams(); // Get search params from the URL
  const recordId = searchParams.get("recordId"); // Extract the recordId from the query parameter
  const dispatch = useDispatch();

  // Initialize state variables
  const [record, setRecord] = useState(null);
  const [value, setValue] = useState("");
  const [purpose, setPurpose] = useState("");
  const [category, setCategory] = useState(""); // Added category state

  // Retrieve expansesData from Redux store
  const expansesData = useSelector((state) => state.expanse.expanseData);
  const categories = useSelector((state) => state.category.categoryData);

  // Fetch data on initial load
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getExpansesData());
    };
    fetchData();
  }, [dispatch]);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategory = async () => {
      await dispatch(getCategoriesData());
    };
    fetchCategory();
  }, [dispatch]);

  // Fetch and set the record when data or recordId changes
  useEffect(() => {
    if (recordId && expansesData) {
      let foundRecord = null;
      // Loop through the days in expansesData
      for (const day in expansesData) {
        const dayData = expansesData[day];

        // Find the record with the matching _id
        foundRecord = dayData.records.find((record) => record._id === recordId);

        if (foundRecord) {
          break; // Exit the loop once found
        }
      }

      // If record is found, set it to the state
      if (foundRecord) {
        setRecord(foundRecord);
        setValue(foundRecord.value); // Set initial value for the form
        setPurpose(foundRecord.purpose); // Set initial purpose for the form
        setCategory(foundRecord.category); // Set initial category for the form
      }
    }
  }, [recordId, expansesData]);

  // Show loading if data is still being fetched
  if (!expansesData || Object.keys(expansesData).length === 0 || categories.length === 0) {
    return <div>Loading...</div>;
  }

  // If record is not found, display an error message
  if (!record) {
    return <div>Record not found!</div>;
  }

  // Function to handle category change and reset error message
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // Handle form submission to update the record
  const handleSubmit = (e) => {
    e.preventDefault();

    // Find the selected category's limit
    const selectedCategory = categories.find((cat) => cat.category === category);
    if (selectedCategory && value > selectedCategory.limit) {
      toast.error(`Value cannot exceed the limit of ${selectedCategory.limit} for the category ${category}.`);
      return; // Prevent form submission if value exceeds category limit
    }

    const updatedRecord = {
      _id: recordId,
      value: parseFloat(value),
      purpose,
      category, // Include category in the update
    };

    // Dispatch update action
    dispatch(updateExpanseData(updatedRecord));

    // Show success toast
    toast.success("Record updated successfully!");
  };

  return (
    <div className="update-record-form">
      <Navbar />
      <h3 className="hedder">Update Record</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="value">Value</label>
          <input
            type="number"
            id="value"
            className="inpt"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="purpose">Purpose</label>
          <input
            type="text"
            id="purpose"
            className="inpt"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            className="inpt"
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.category}>
                {cat.category}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn">Update Record</button>
      </form>
    </div>
  );
};

export default RecordUpdateForm;
