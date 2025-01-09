
import Link from "next/link";
export default function Navbar(){
    return(
        <div className="navbar">
          <div className="navbarTitle">
            <Link href="/">Expanse Tracking App</Link>
          </div>
          <div className="navbarLinks">
          <Link href="/addExpense.js">Add Expanse</Link>
            <Link href="/expanseSummaries">Expanse Summaries</Link>
    
          </div>
        </div>
    )
}