"use client"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from 'next/navigation'
import Link from "next/link"


import { setMonthlyLimit } from "../reduxPart/monthlyLimitSlice";



export default function SetMonthlyLimit() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [value, setValue] = useState("");
    
  //set monthly limits:
    const handleSubmit = (e) => {
        e.preventDefault();
        const monthlyLimit = { value }
        dispatch(setMonthlyLimit(monthlyLimit))
        router.push('/createCategory');
        
    }
    

    return (<div className="add-expanse">

        <h4 className="hedder">Set Monthly Limits of Expanse </h4>
    
        <form onSubmit={handleSubmit}> 
        <label >Insert Your Expansese value</label>
            <input type="number" placeholder="Insert an amount" className="intp"
                onChange={(e) => setValue(e.target.value)} />
           
            <button type="submit" className="btn">Set Monthly Limit</button>
            
        </form>
        <br />
       

    </div>
    )
}