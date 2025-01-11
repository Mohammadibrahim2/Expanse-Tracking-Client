"use client";

import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { getCategoriesData } from "../reduxPart/categorySlice";
import Navbar from "../components/navbar";
import { updateExpanseData, getExpansesData } from "../reduxPart/slice";

const RecordUpdateForm = () => {
  const searchParams = useSearchParams(); // Client-side hook
  const recordId = searchParams?.get("recordId");
  const dispatch = useDispatch();

  const [record, setRecord] = useState(null);
  const [value, setValue] = useState("");
  const [purpose, setPurpose] = useState("");
  const [category, setCategory] = useState("");

  const expansesData = useSelector((state) => state.expanse?.expanseData || {});
  const categories = useSelector((state) => state.category?.categoryData || []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([dispatch(getExpansesData()), dispatch(getCategoriesData())]);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data.");
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (recordId && expansesData) {
      let foundRecord = null;

      for (const day in expansesData) {
        const dayData = expansesData[day];
        if (dayData?.records) {
          foundRecord = dayData.records.find((record) => record._id === recordId);
          if (foundRecord) break;
        }
      }

      if (foundRecord) {
        setRecord(foundRecord);
        setValue(foundRecord.value || "");
        setPurpose(foundRecord.purpose || "");
        setCategory(foundRecord.category || "");
      }
    }
  }, [recordId, expansesData]);

  if (!expansesData || Object.keys(expansesData).length === 0 || categories.length === 0) {
    return <div>Loading...</div>;
  }

  if (!record) {
    return <div>Record not found!</div>;
  }

  const handleCategoryChange = (e) => setCategory(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCategory = categories.find((cat) => cat.category === category);
    if (selectedCategory && parseFloat(value) > selectedCategory.limit) {
      toast.error(
        `Value cannot exceed the limit of ${selectedCategory.limit} for category ${category}.`
      );
      return;
    }

    const updatedRecord = {
      _id: recordId,
      value: parseFloat(value),
      purpose,
      category,
    };

    try {
      await dispatch(updateExpanseData(updatedRecord));
      toast.success("Record updated successfully!");
    } catch (error) {
      console.error("Error updating record:", error);
      toast.error("Failed to update the record.");
    }
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

        <button type="submit" className="btn">
          Update Record
        </button>
      </form>
    </div>
  );
};

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecordUpdateForm />
    </Suspense>
  );
}
