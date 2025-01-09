"use client"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import Link from "next/link"

import moment from "moment";
import Navbar from "../components/navbar";
import { createCategoryData } from "../reduxPart/categorySlice";
import { getMonthlyLimit } from "../reduxPart/monthlyLimitSlice";
import AddExpense from "../components/addexpense";

export default function CreateCategory() {

    const [limit, setLimit] = useState("");
 
    const [category, setCategory] = useState('')
    const dispatch = useDispatch();
// const {isSuccess}=useSelector((state)=>state)

    const handleSubmit = (e) => {
        e.preventDefault();
        const categoryData = { limit,category }
        dispatch(createCategoryData(categoryData))
        
        
    }
   useEffect(()=>{
    dispatch(getMonthlyLimit())
   },[])

    return (<div className="add-expanse">
        <Navbar/>

        <h4 className="hedder">Create a Ctegory and Set it's Limit. </h4>
            {/* {isSuccess.length>0 && <h3>{isSuccess.success}</h3>} */}
        <form onSubmit={handleSubmit}> 
        <label >Categoy Name</label> 
            <input type="text" placeholder="write category name" className="intp"
                onChange={(e) => setCategory(e.target.value)} />
         
            <br />
            <label >Set The Category Limit</label> 
            <input type="number" placeholder="Insert an limit" className="intp"
                onChange={(e) => setLimit(e.target.value)} />
            <br />
            <br />
            <button type="submit" className="btn">Create Category</button>
            
        </form>
        <br />
       
<AddExpense/>
    </div>
    )
}
