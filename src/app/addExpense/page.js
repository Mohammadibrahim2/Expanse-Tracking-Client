"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesData } from "@/app/reduxPart/categorySlice";
import { addExpansesData, getExpansesData } from "@/app/reduxPart/slice";
import toast from "react-hot-toast";
import Navbar from "../components/navbar";
import { useRouter } from "next/navigation";

const AddExpense = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  
  const [value, setValue] = useState("");
  const [purpose, setPurpose] = useState("");
  const [category, setCategory] = useState("");

  // Redux selectors
  const categories = useSelector((state) => state.category?.categoryData || []);
  const expenses = useSelector((state) => state.expanse?.expanseData || {});
  const totalMonthlyLimit = useSelector(
    (state) => state.monthlyLimitedData?.monthlyLimitedData?.monthlyLimit || 0
  );

  // Fetch categories and expenses data on component mount
  useEffect(() => {
    dispatch(getCategoriesData());
    dispatch(getExpansesData());
  }, [dispatch]);

  // Helper function to calculate total expenses for a category on a specific day
  const calculateCategoryTotalForDate = (categoryName, date) => {
    const expensesForDate = expenses[date]?.records || [];
    return expensesForDate
      .filter((record) => record.category === categoryName)
      .reduce((sum, record) => sum + parseFloat(record.value), 0);
  };

  // Helper function to calculate the total monthly expenses
  const calculateMonthlyTotal = () => {
    return Object.values(expenses).reduce((total, dailyExpenses) => {
      return (
        total +
        dailyExpenses.records.reduce(
          (sum, record) => sum + parseFloat(record.value),
          0
        )
      );
    }, 0);
  };

  // Handle expense form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const newExpenseValue = parseFloat(value);

    // Find the selected category's data
    const categoryData = categories.find((cat) => cat.category === category);
    if (!categoryData) {
      toast.error("Category not found! Please select a valid category.");
      return;
    }

    // Check if the new expense exceeds the daily limit for the selected category
    for (const [date, data] of Object.entries(expenses)) {
      const totalForDate = calculateCategoryTotalForDate(category, date);
      const newTotalForDate = totalForDate + newExpenseValue;

      if (newTotalForDate > parseFloat(categoryData.limit)) {
        toast.error(
          `Cannot add expense. Daily limit of ${categoryData.limit} TK for ${category} exceeded on ${date}!`
        );
        return;
      }
    }

    // Check if the new expense exceeds the monthly limit
    const currentMonthlyTotal = calculateMonthlyTotal();
    const newMonthlyTotal = currentMonthlyTotal + newExpenseValue;

    if (newMonthlyTotal > totalMonthlyLimit) {
      toast.error(
        `Cannot add expense. Monthly limit of ${totalMonthlyLimit} TK exceeded! Current total: ${currentMonthlyTotal} TK`
      );
      return;
    }

    // Add the expense if all checks pass
    const expansesData = { value, purpose, category };
    dispatch(addExpansesData(expansesData));
    
    // After successfully adding, reload expense data to reflect it immediately
    dispatch(getExpansesData());

    toast.success(`Successfully added expense for category ${category}`);
    router.push("/expanseSummaries");

    // Reset form fields
    setValue("");
    setPurpose("");
    setCategory("");
  };

  return (
    <div className="add-expense">
      <Navbar />
      <h4 className="hedder">Add Expense Data</h4>
      <form onSubmit={handleSubmit}>
        <label>Insert Your Expense Value</label>
        <input
          type="number"
          placeholder="Insert an amount"
          className="intp"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
        <br />
        <label>Choose a Category:</label>
        <select
          value={category}
          className="intp"
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c._id} value={c.category}>
              {c.category}
            </option>
          ))}
        </select>
        <br />
        <label>Write the Purpose</label>
        <input
          type="text"
          placeholder="Write the purpose.."
          className="intp"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          required
        />
        <br />
        <button type="submit" className="btn">
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
