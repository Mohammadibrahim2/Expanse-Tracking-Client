"use client";

import { useDispatch, useSelector } from "react-redux";
import { getExpansesData, updateExpanseData } from "../reduxPart/slice";

import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import Navbar from "../components/navbar";
import { getCategoriesData } from "../reduxPart/categorySlice";
import { useRouter } from "next/navigation"; // Import useRouter
import toast from "react-hot-toast";
import deleteExpanseData from "../reduxPart/slice"
export default function Page() {
  const dispatch = useDispatch();
  const [progressData, setProgressData] = useState([]);
  const [updatedRecord, setUpdatedRecord] = useState({});

  const router = useRouter(); // Initialize the useRouter hook

  // Fetching expenses data
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getExpansesData());
    };
    fetchData();
  }, [dispatch]);

  // Fetching categories data
  useEffect(() => {
    const fetchCategory = async () => {
      await dispatch(getCategoriesData());
    };
    fetchCategory();
  }, [dispatch]);

  const categories = useSelector((state) => state.category.categoryData);
  const expansesData = useSelector((state) => state.expanse.expanseData);

  // Generate the next 30 days starting from today
  const next30Days = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) =>
      moment().add(i, "days").format("DD-MM-YYYY")
    );
  }, []);

  // Map data to the next 30 days
  const rows = useMemo(() => {
    if (!expansesData || !categories) return [];

    return next30Days.map((date) => {
      const originalDate = Object.keys(expansesData).find((d) =>
        moment(d).isSame(moment(date, "DD-MM-YYYY"), "day")
      );

      const row = { date, dailyTotal: 0, categories: {} };

      categories.forEach((category) => {
        const records =
          originalDate && expansesData[originalDate]
            ? expansesData[originalDate].records.filter(
                (record) => record.category === category.category
              )
            : [];

        const categoryTotal = records.reduce(
          (sum, record) => sum + parseFloat(record.value),
          0
        );

        row.categories[category.category] = records;
        row.dailyTotal += categoryTotal;
      });

      return row;
    });
  }, [expansesData, categories, next30Days]);

  // Calculate spending progress for progress bars
  useEffect(() => {
    if (!categories || rows.length === 0) return;

    const progress = categories.map((category) => {
      const totalSpent = rows.reduce((sum, row) => {
        const categoryTotal = row.categories[category.category]?.reduce(
          (subtotal, record) => subtotal + parseFloat(record.value),
          0
        );
        return sum + (categoryTotal || 0);
      }, 0);

      return {
        category: category.category,
        limit: parseFloat(category.limit),
        spent: totalSpent,
        percentage: (totalSpent / category.limit) * 100,
      };
    });

    setProgressData(progress);
  }, [categories, rows]);

  // Update record
  const handleUpdateClick = (recordId) => {
    // Redirect to the update form with the recordId as a query parameter
    router.push(`/updateRecord?recordId=${recordId}`);
  };

  // Delete record
  const handleDeleteRecord = (recordId, date) => {
    console.log("Deleting record with ID:", recordId); 
  
    if (!recordId || !date) {
      console.error("Error: Missing recordId or date.");
      return; // Early return if required data is missing
    }
  
    dispatch(deleteExpanseData({ recordId, date })); 
    toast.success("Successfully deleted the record.");
  };
  

  return (
    <div className="display-task">
      <Navbar />

      <h4 className="hedder">Expense Summaries</h4>

      {/* Progress Bars */}
      <div className="progress-bars">
        {progressData.map((item, index) => {
          let color = "green"; // Default: green
          if (item.percentage >= 75 && item.percentage < 100) color = "yellow";
          else if (item.percentage >= 100) color = "red";

          return (
            <div key={index} className="progress-bar">
              <span>{item.category}</span>
              <div
                className="progress"
                style={{
                  width: "100%",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "5px",
                  overflow: "hidden",
                }}
              >
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(item.percentage, 100)}%`,
                    backgroundColor: color,
                    height: "10px",
                  }}
                ></div>
              </div>
              <span>
                {item.spent} / {item.limit} ({Math.min(item.percentage, 100).toFixed(2)}%)
              </span>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div>
        <main>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                {categories?.map((category) => (
                  <th key={category._id}>{category.category}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    {row.date} <br />
                    <strong>Total:</strong> {row.dailyTotal.toFixed(2)}
                  </td>
                  {categories?.map((category) => (
                    <td key={category._id}>
                      <div className="tooltip-container">
                        {row.categories[category.category]?.reduce(
                          (sum, record) => sum + parseFloat(record.value),
                          0
                        ) || <span style={{ color: "black", fontWeight: "bold" }}>×</span>}
                        {row.categories[category.category]?.length > 0 && (
                          <span className="tooltip">
                            {row.categories[category.category].map((record, idx) => (
                              <div key={idx}>
                                <strong>Value:</strong> {record.value}
                                <br />
                                <strong>Purpose:</strong> {record.purpose}
                                <div>
                                  <button onClick={() => handleUpdateClick(record._id)}>
                                    Update
                                  </button>
                                  <button onClick={() => handleDeleteRecord(record._id)}>
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
