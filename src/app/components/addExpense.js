"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesData } from "@/app/reduxPart/categorySlice";
import { addExpansesData, getExpansesData } from "@/app/reduxPart/slice";
import toast from "react-hot-toast" 

export default function AddExpense() {
    const dispatch = useDispatch();
    const [value, setValue] = useState("");
    const [purpose, setPurpose] = useState("");
    const [category, setCategory] = useState("");

   // Fetching expenses data
     useEffect(() => {
       
          dispatch(getExpansesData());
      
     }, [dispatch]);
    // Fetch categories expenses and monthly limit from the Redux store
    const categories = useSelector((state) => state.category.categoryData);
    const expenses = useSelector((state) => state.expanse.expanseData);
    const totalMonthlyLimit = useSelector((data) => data.monthlyLimitedData.monthlyLimitedData.monthlyLimit);

    useEffect(() => {
        dispatch(getCategoriesData());
    }, [dispatch]);

    // Function to calculate total expenses for a category on a specific day
    const calculateCategoryTotalForDate = (categoryName, date) => {
        const expensesForDate = expenses[date]?.records || [];
        return expensesForDate
            .filter((record) => record.category === categoryName)
            .reduce((sum, record) => sum + parseFloat(record.value), 0);
    };

    // Function to calculate the total expenses for the current month
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

    // Handle expense submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const newExpenseValue = parseFloat(value);

        // Find the selected category's data
        const categoryData = categories.find((cat) => cat.category === category);
        if (!categoryData) {
            toast.error("Category not found!");
            return;
        }

        // Check if the new expense exceeds the category's limit for any single day
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

        // If all checks pass, add the expense
        const expansesData = { value, purpose, category };
        dispatch(addExpansesData(expansesData));
        toast.success(`Successfully added expense for category ${category}`);
    };

    return (
        <div className="add-expanse">
            <h4 className="hedder">Add Expense Data</h4>
            <form onSubmit={handleSubmit}>
                <label>Insert Your Expense Value</label>
                <input
                    type="number"
                    placeholder="Insert an amount"
                    className="intp"
                    onChange={(e) => setValue(e.target.value)}
                />
                <br />
                <label>Choose a Category:</label>
                <select onChange={(e) => setCategory(e.target.value)}>
                    {categories &&
                        categories.map((c) => (
                            <option key={c?._id} value={c.category}>
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
                    onChange={(e) => setPurpose(e.target.value)}
                />
                <br />
                <button type="submit" className="btn">
                    Add Expense
                </button>
            </form>
        </div>
    );
}
