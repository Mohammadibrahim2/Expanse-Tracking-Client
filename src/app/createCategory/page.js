"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCategoryData, getCategoriesData } from "../reduxPart/categorySlice";
import { getMonthlyLimit } from "../reduxPart/monthlyLimitSlice";
import Navbar from "../components/navbar";
import AddExpense from "../components/addExpense";
import toast from "react-hot-toast";

export default function CreateCategory() {
  const [limit, setLimit] = useState("");
  const [category, setCategory] = useState("");
  const dispatch = useDispatch();

  // Fetch categories and monthly limit data
  useEffect(() => {
    dispatch(getCategoriesData());
    dispatch(getMonthlyLimit());
  }, [dispatch]);

  const totalMonthlyLimit = useSelector(
    (data) => data?.monthlyLimitedData?.monthlyLimitedData?.monthlyLimit
  );
  const categories = useSelector((data) => data.category.categoryData);

  // Calculate total category limits
  const calculateTotalCategoriesLimit = () => {
    return categories.reduce((acc, cat) => acc + parseFloat(cat.limit || 0), 0);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const newCategoryLimit = parseFloat(limit.trim());
    const categoryName = category.trim().toLowerCase(); // Normalize category name

    // Validate inputs
    if (!categoryName || isNaN(newCategoryLimit) || newCategoryLimit <= 0) {
      toast.error("Please provide a valid category name and limit.");
      return;
    }

    // Check if category already exists
    const isDuplicateCategory = categories.some(
      (cat) => cat.category.toLowerCase() === categoryName
    );
    if (isDuplicateCategory) {
      toast.error(`Category "${category}" already exists!`);
      return;
    }

    // Check if total category limits exceed the monthly limit
    const totalCategoriesLimit = calculateTotalCategoriesLimit();
    if (totalCategoriesLimit + newCategoryLimit > totalMonthlyLimit) {
      toast.error(
        `Adding this category limit would exceed the total 
        monthly limit of ${totalMonthlyLimit} TK.
         Please Add the total monthly limit before adding category`
      );
      return;
    }

    // Dispatch action to create the new category
    const categoryData = { limit: newCategoryLimit, category: category.trim() };
    dispatch(createCategoryData(categoryData))
      .then(() => {
        toast.success(`Category "${category}" added successfully!`);
        setLimit(""); // Clear input fields after success
        setCategory("");
        dispatch(getCategoriesData()); // Refresh the category list to reflect changes
      })
      .catch((error) => {
        toast.error("Error adding category. Please try again.");
        console.error(error);
      });
  };

  return (
    <div className="add-expanse">
      <Navbar />
      <h4 className="hedder">Create a Category and Set its Limit.</h4>

      <form onSubmit={handleSubmit}>
        <label>Category Name</label>
        <input
          type="text"
          value={category}
          placeholder="Write category name"
          className="intp"
          onChange={(e) => setCategory(e.target.value)}
        />
        <br />
        <label>Set The Category Limit</label>
        <input
          type="number"
          value={limit}
          placeholder="Insert a limit"
          className="intp"
          onChange={(e) => setLimit(e.target.value)}
        />
        <br />
        <br />
        <button type="submit" className="btn">
          Create Category
        </button>
      </form>

      <br />
      <AddExpense />
    </div>
  );
}
