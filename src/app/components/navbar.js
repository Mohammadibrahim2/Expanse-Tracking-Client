"use client"
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMonthlyLimit } from "../reduxPart/monthlyLimitSlice";
export default function Navbar() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMonthlyLimit())
  }, []);
  const totalMonthlyLimit = useSelector((data) => data.monthlyLimitedData.monthlyLimitedData.monthlyLimit);
  console.log(totalMonthlyLimit)
  return (
    <div>


      <div className="navbar">
        <div className="navbarTitle">
          <Link href="/">Expanse Tracking App</Link>
        </div>
        <span></span>
        <div className="navbarLinks">

          <Link href="/addExpense">Add Expanse</Link>
          <Link href="/expanseSummaries">Expanse Summaries</Link>

        </div>

      </div>
      <div className="center-container">
        <span>Total Monthly Limit ={totalMonthlyLimit?totalMonthlyLimit:"00.00"}tk</span>
      </div>
    </div>
  )
}