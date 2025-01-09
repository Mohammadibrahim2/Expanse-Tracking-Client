
"use client"

import { useDispatch, useSelector } from "react-redux"
import { getExpansesData } from "../reduxPart/slice"
import { useEffect } from "react"
import moment from "moment"
import Navbar from "../components/navbar"
import { getCategoriesData } from "../reduxPart/categorySlice"


export default function Page(){

  
    const dispatch=useDispatch()

    const categories = useSelector((data) => data.category.categoryData)
    console.log(categories)
    useEffect(()=>{
      dispatch(getExpansesData())
    
  },[])
  const expansesData=useSelector((data)=>data.expanse.expanseData)
  
  console.log(categories)
const processData = (data) => {
  const rows = [];

  Object.keys(expansesData).forEach((orginalDate) => {
    const formattedDate = moment(orginalDate, "ddd MMM DD YYYY").isValid()
    ? moment(orginalDate).format("DD-MM-YYYY")
    :orginalDate;
    const row = { date:formattedDate, categories: {} };
 // Format date to "21-04-2025"

    // Initialize each category's total to "X"
    categories?.forEach((category) => (row.categories[category] = "X"));

    // Sum the values for each category
    data[orginalDate].records.forEach((record) => {
      const category = record.category;
      if (row.categories[category] === "X") {
        row.categories[category] = 0;
      }
      row.categories[category] += parseFloat(record.value);
    });

    rows.push(row);
  });
    // Sort rows by date in ascending order (use descending order by reversing `sort` logic)
    console.log(rows)
    rows.sort((p, q) => {
      const dateA = moment(p.orginalDate, "ddd MMM DD YYYY").isValid()
        ? moment(p.orginalDate, "ddd MMM DD YYYY").toDate()
        : new Date(p.orginalDate);
      const dateB = moment(q.orginalDate, "ddd MMM DD YYYY").isValid()
        ? moment(q.orginalDate, "ddd MMM DD YYYY").toDate()
        : new Date(q.orginalDate);

      return dateA - dateB; // For descending, use `dateB - dateA`
    });
    console.log(rows)
  return rows;
};

const rows = processData(expansesData);
return(<div className="display-task">
  <Navbar/>

<h4 className="hedder">Expanse summaries </h4>
<div>
  <main>
  <table
        
      >
        <thead>
          <tr>
            <th >Date</th>
            {categories.map((category) => (
              <th  key={category}>
                {category}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td >{row.date}</td>
              {categories.map((category) => (
                <td  key={category}>
                  {row.categories[category]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
  </main>

  
</div>
</div>
)
}
