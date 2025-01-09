"use client"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import Link from "next/link"

import moment from "moment";

// import Navbar from "../navbar";
import { getCategoriesData } from "@/app/reduxPart/categorySlice";
import { addExpansesData } from "@/app/reduxPart/slice";

export default function AddExpense() {
    const dispatch = useDispatch();
    const [value, setValue] = useState("");
    const [purpose, setPurpose] = useState('')
    const [category, setCategory] = useState('');


    // const {isSuccess}=useSelector((state)=>state)
    
    //getting categories from server:-
    useEffect(() => {
        dispatch(getCategoriesData())
    }, [])
    const categories = useSelector((data) => data.category.categoryData)
    //add an expanse :
    const handleSubmit = (e) => {
        e.preventDefault();
        const expansesData = { value, purpose, category }
        dispatch(addExpansesData(expansesData))

    }


    return (<div className="add-expanse">
        {/* <Navbar /> */}
        <h4 className="hedder">Add Expanse Data </h4>
        {/* {isSuccess.length>0 && <h3>{isSuccess.success}</h3>} */}
        <form onSubmit={handleSubmit}>
            <label >Insert Your Expansese value</label>
            <input type="number" placeholder="Insert an amount" className="intp"
                onChange={(e) => setValue(e.target.value)} />
            <br />
            <label >Choose a category:</label>
            <select 

                onChange={(e) => setCategory(e.target.value)} >

                {categories &&
                    categories?.map((c, key) => <option key={c?._id} value={c.category}>{c.category}</option>)
                }


            </select>
            <br />
            <br />
            <label >write the purpose.</label>
            <input type="text" placeholder="write the purpose.." className="intp"
                onChange={(e) => setPurpose(e.target.value)} />
            <br />
            <button type="submit" className="btn">Add Expanse</button>

        </form>
        <br />


    </div>
    )
}