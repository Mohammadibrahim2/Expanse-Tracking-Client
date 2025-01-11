# Expense Tracker Application

The Expense Tracker  Application allows  an user to  track his daily expenses based on different categories . It helps an user to better manage his finances by organizing his expenses, and enforcing limits on their spending.

The application gives an user the ability to set monthly limits, track expenses by category, and get real-time alerts when limits are exceeded.

## Features

### 1. **Expense Input**
- An User can input his daily expenses, specifying a category  and the purpose of the expense .
- The date and time of each expense are automatically recorded.
- Expenses are categorized and stored for easy reference.

### 2. **Expense Management**
- An user can input multiple expenses per day in different categories.
- All expenses are stored in a MongoDB database.
- The app provides an easy-to-use interface to add, view, and manage all the expenses.

### 3. **Summary Page**
- A daily categorized summary of expenses is displayed.
- Tooltips are shown when hovering over expense fields, revealing more detailed information.
- Total daily expenses are calculated and displayed under the specific category.

### 4. **Spending Limits**
- The application prompts users to set a monthly spending limit upon first use.
- an user can also set category specific limits .
- The app prevents user from adding expenses that exceed their set limits and alerts users when they reach their limit for a specific category.

## Technologies Used

### For Frontend:
- Next.js
- Redux Toolkit
- HTML & CSS

### For Backend:
- Node.js (Express.js).
- MongoDB.

 **Limitations**



1. **Limited Mobile Responsiveness**  
   The application is not fully optimized for mobile devices. Some user interface elements may not be displayed correctly on smaller screens, and improvements are needed for better responsiveness.

2. **No User Authentication**  
   The app does not have any user authentication or login system. All expenses are shared across the app for any user using the same instance, meaning data is not isolated per user.







