// "use client"

// import React, { useState, useEffect } from "react";

// export default function CheakcategoryLimit(){
//   // Example category limit data
//   const categoryLimits = [
//     { _id: "677e980ed48dc98fc02b0619", limit: "1500", category: "marketing" },
//     { _id: "677e9830d48dc98fc02b061a", limit: "1500", category: "marketing" },
//     { _id: "677e9849d48dc98fc02b061b", limit: "2000", category: "shopping" },
//     { _id: "677e9867d48dc98fc02b061c", limit: "3000", category: "health" },
//   ];

//   // Example expenses data
//   const expensesData = {
//     "Fri Jan 03 2025": {
//       count: 2,
//       records: [
//         { value: "355", category: "Utility" },
//         { value: "500", category: "Transportation" },
//       ],
//     },
//     "Tue Jan 07 2025": {
//       count: 2,
//       records: [
//         { value: "500", category: "Charity" },
//         { value: "455", category: "Miscellaneous" },
//       ],
//     },
//     "Wed Jan 08 2025": {
//       count: 10,
//       records: [
//         { value: "200", category: "marketing" },
//         { value: "400", category: "Miscellaneous" },
//       ],
//     },
//   };

//   const [categoryTotals, setCategoryTotals] = useState({});
//   const [limitExceedStatus, setLimitExceedStatus] = useState({});

//   // Calculate totals by category
//   useEffect(() => {
//     const totals = {};
//     Object.values(expensesData).forEach((day) => {
//       day.records.forEach((record) => {
//         const category = record.category;
//         const value = parseFloat(record.value);
//         if (!totals[category]) {
//           totals[category] = 0;
//         }
//         totals[category] += value;
//       });
//     });
//     setCategoryTotals(totals);
//   }, [expensesData]);

//   // Check if limits are exceeded
//   useEffect(() => {
//     const status = {};
//     categoryLimits.forEach((limit) => {
//       const category = limit.category;
//       const limitValue = parseFloat(limit.limit);
//       const total = categoryTotals[category] || 0;

//       status[category] = total > limitValue
//         ? `Exceeded (Limit: ${limitValue}, Total: ${total})`
//         : `Within Limit (Limit: ${limitValue}, Total: ${total})`;
//     });
//     setLimitExceedStatus(status);
//   }, [categoryTotals, categoryLimits]);

//   return (
//     <div className="category">
//       <h1>Category Expense Tracker</h1>
//       <h2>Category Totals</h2>
//       <ul>
//         {Object.keys(categoryTotals).map((category) => (
//           <li key={category}>
//             {category}: {categoryTotals[category]}
//           </li>
//         ))}
//       </ul>
//       <h2>Limit Status</h2>
//       <ul>
//         {categoryLimits.map((limit) => (
//           <li key={limit._id}>
//             {limit.category}: {limitExceedStatus[limit.category] || "No Expenses"}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };


