// import React, { useEffect, useState } from 'react';
// import Card from './goalcard/card'; // Import the Card component
// import './goals.css'; // Import the CSS file for styling
// import { useNavigate } from 'react-router-dom';  // Import the useNavigate hoo
// const Goals = () => {
//   const [goals, setGoals] = useState([]); // State to store fetched goals
//   const [processedGoals, setProcessedGoals] = useState([]); // State to store processed goals
//   const [pnlData, setPnlData] = useState([]); // State to store PnL data

//   // Fetch data from the backend
//   const fetchGoals = async () => {
//     try {
//       const response = await fetch('http://localhost:4000/api/goal/goals'); // Replace with your backend API endpoint
//       const data = await response.json();
//       setGoals(data.goals || []); // Use only the "goals" array
//     } catch (error) {
//       console.error('Error fetching goals:', error);
//     }
//   };

//   // Fetch PnL data from the backend
//   const fetchPnLData = async () => {
//     try {
//       const pnlResponse = await fetch('http://localhost:4000/api/order/closed-pnl');
//       const pnlResult = await pnlResponse.json();
//       setPnlData(pnlResult.trades || []); // Set PnL data
//     } catch (error) {
//       console.error('Error fetching PnL data:', error);
//     }
//   };

//   // Function to calculate total profit for each goal type (Daily, Weekly, etc.)
//   const calculateTotalProfit = (goal, pnlData) => {
//     let totalProfit = 0;
//     const goalCreationDate = new Date(goal.setAt); // Goal creation time from the API
    
//     // Calculate total profit or loss, excluding trades made before the goal was created
//     pnlData.forEach((trade) => {
//       const tradeDate = new Date(parseInt(trade.updatedTime));
//       const pnl = parseFloat(trade.closedPnl) || 0;

//       // Only consider PnL data after the goal creation time
//       if (tradeDate >= goalCreationDate) {
//         // Filter PnL data based on goal type and time period
//         if (goal.goalType === 'Daily' && isSameDay(new Date(), tradeDate)) {
//           totalProfit += pnl;
//         } else if (goal.goalType === 'Weekly' && isSameWeek(new Date(), tradeDate)) {
//           totalProfit += pnl;
//         } else if (goal.goalType === 'Monthly' && isSameMonth(new Date(), tradeDate)) {
//           totalProfit += pnl;
//         } else if (goal.goalType === 'Quarterly' && isSameQuarter(new Date(), tradeDate)) {
//           totalProfit += pnl;
//         } else if (goal.goalType === 'Yearly' && isSameYear(new Date(), tradeDate)) {
//           totalProfit += pnl;
//         }
//       }
//     });
  
//     return totalProfit;
//   };

//   // Helper functions to check if two dates are the same (Day, Week, Month, Year)
//   const isSameDay = (date1, date2) => date1.toDateString() === date2.toDateString();
//   const isSameWeek = (date1, date2) => {
//     const startOfWeek = date1.getDate() - date1.getDay();
//     const endOfWeek = startOfWeek + 6;
//     const startOfDate2 = date2.getDate() - date2.getDay();
//     return startOfWeek <= startOfDate2 && endOfWeek >= startOfDate2;
//   };
//   const isSameMonth = (date1, date2) => date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
//   const isSameQuarter = (date1, date2) => {
//     const quarter1 = Math.floor(date1.getMonth() / 3);
//     const quarter2 = Math.floor(date2.getMonth() / 3);
//     return quarter1 === quarter2 && date1.getFullYear() === date2.getFullYear();
//   };
//   const isSameYear = (date1, date2) => date1.getFullYear() === date2.getFullYear();
//   const processGoals = () => {
//     const processed = goals.flatMap((goal) => {
//       const smallerGoals = [];
      
//       // Add the original goal
//       smallerGoals.push({ ...goal, setAt: goal.setAt }); // Ensure setAt is added to the original goal
  
//       // Dividing the goal into smaller types based on goalType
//       if (goal.goalType === 'Yearly') {
//         smallerGoals.push(
//           { goalType: 'Quarterly', goalAmount: goal.goalAmount / 4, setAt: goal.setAt },
//           { goalType: 'Monthly', goalAmount: goal.goalAmount / 12, setAt: goal.setAt },
//           { goalType: 'Weekly', goalAmount: goal.goalAmount / 52, setAt: goal.setAt },
//           { goalType: 'Daily', goalAmount: goal.goalAmount / 365, setAt: goal.setAt }
//         );
//       } else if (goal.goalType === 'Quarterly') {
//         smallerGoals.push(
//           { goalType: 'Monthly', goalAmount: goal.goalAmount / 3, setAt: goal.setAt },
//           { goalType: 'Weekly', goalAmount: goal.goalAmount / 13, setAt: goal.setAt },
//           { goalType: 'Daily', goalAmount: goal.goalAmount / 91, setAt: goal.setAt }
//         );
//       } else if (goal.goalType === 'Monthly') {
//         smallerGoals.push(
//           { goalType: 'Weekly', goalAmount: goal.goalAmount / 4, setAt: goal.setAt },
//           { goalType: 'Daily', goalAmount: goal.goalAmount / 30, setAt: goal.setAt }
//         );
//       } else if (goal.goalType === 'Weekly') {
//         smallerGoals.push(
//           { goalType: 'Daily', goalAmount: goal.goalAmount / 7, setAt: goal.setAt }
//         );
//       }
  
//       // Now adjust the progress based on the current cumulative profit or loss
//       return smallerGoals.map((smallerGoal) => {
//         const totalProfit = calculateTotalProfit(smallerGoal, pnlData);
  
//         // Subtract profit from goal amount or add loss to goal amount
//         const adjustedGoalAmount = smallerGoal.goalAmount - totalProfit; // Adjust goal amount based on profit/loss
        
//         // Update the goal percentage dynamically, considering the cumulative result
//         const goalPercentage = (totalProfit / smallerGoal.goalAmount) * 100;
  
//         return { ...smallerGoal, totalProfit, goalPercentage, adjustedGoalAmount };
//       });
//     });
  
//     setProcessedGoals(processed);
//   };
  

//   // Fetch goals and PnL data on component mount
//   useEffect(() => {
//     fetchGoals();
//     fetchPnLData();
//   }, []);

//   // Recalculate processed goals when either goals or PnL data changes
//   useEffect(() => {
//     if (goals.length > 0 && pnlData.length > 0) {
//       processGoals();
//     }
//   }, [goals, pnlData]);
//   const navigate = useNavigate();

// // Handle navigation to setgoals page
// const navigateToSetGoals = () => {
//   navigate('/setgoals'); // Navigate to the 'setgoals' page
// };

//   return (
//     <div>
//       {processedGoals.length > 0 ? (
//         <div>
//           <div className="goals-container">
//             {processedGoals.map((data, index) => (
//               <Card key={index} {...data} /> // Render Card for each goal
//             ))}
//           </div>
//           <div className="goal-actions">
            
            
//             <button className="form-button">
//               Delete Goal
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="no-goals-message">
//           <p>Set your goals to track your progress</p>
//           <button className="form-button" onClick={navigateToSetGoals}>Set Goal</button> {/* Set Goal button with navigation */}
//           </div>
//       )}
//     </div>
//   );
// };

// export default Goals;
import React, { useEffect, useState } from 'react';
import Card from './goalcard/card'; // Import the Card component
import './goals.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook

const Goals = () => {
  const [goals, setGoals] = useState([]); // State to store fetched goals
  const [processedGoals, setProcessedGoals] = useState([]); // State to store processed goals
  const [pnlData, setPnlData] = useState([]); // State to store PnL data
  const navigate = useNavigate(); // Get the navigate function

  // Fetch data from the backend
  const fetchGoals = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/goal/goals'); // Replace with your backend API endpoint
      const data = await response.json();
      setGoals(data.goals || []); // Use only the "goals" array
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  // Fetch PnL data from the backend
  const fetchPnLData = async () => {
    try {
      const pnlResponse = await fetch('http://localhost:4000/api/order/closed-pnl');
      const pnlResult = await pnlResponse.json();
      setPnlData(pnlResult.trades || []); // Set PnL data
    } catch (error) {
      console.error('Error fetching PnL data:', error);
    }
  };

  // Function to delete a goal
  const deleteGoal = async (goalId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/goal/goals/${goalId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted goal from the local state
        setGoals(goals.filter(goal => goal._id !== goalId));
        alert('Goal deleted successfully');
      } else {
        alert('Error deleting goal');
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('Error deleting goal');
    }
  };

  // Function to calculate total profit for each goal type (Daily, Weekly, etc.)
  const calculateTotalProfit = (goal, pnlData) => {
    let totalProfit = 0;
    const goalCreationDate = new Date(goal.setAt); // Goal creation time from the API
    
    pnlData.forEach((trade) => {
      const tradeDate = new Date(parseInt(trade.updatedTime));
      const pnl = parseFloat(trade.closedPnl) || 0;

      if (tradeDate >= goalCreationDate) {
        if (goal.goalType === 'Daily' && isSameDay(new Date(), tradeDate)) {
          totalProfit += pnl;
        } else if (goal.goalType === 'Weekly' && isSameWeek(new Date(), tradeDate)) {
          totalProfit += pnl;
        } else if (goal.goalType === 'Monthly' && isSameMonth(new Date(), tradeDate)) {
          totalProfit += pnl;
        } else if (goal.goalType === 'Quarterly' && isSameQuarter(new Date(), tradeDate)) {
          totalProfit += pnl;
        } else if (goal.goalType === 'Yearly' && isSameYear(new Date(), tradeDate)) {
          totalProfit += pnl;
        }
      }
    });

    return totalProfit;
  };

  // Helper functions to check if two dates are the same (Day, Week, Month, Year)
  const isSameDay = (date1, date2) => date1.toDateString() === date2.toDateString();
  const isSameWeek = (date1, date2) => {
    const startOfWeek = date1.getDate() - date1.getDay();
    const endOfWeek = startOfWeek + 6;
    const startOfDate2 = date2.getDate() - date2.getDay();
    return startOfWeek <= startOfDate2 && endOfWeek >= startOfDate2;
  };
  const isSameMonth = (date1, date2) => date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
  const isSameQuarter = (date1, date2) => {
    const quarter1 = Math.floor(date1.getMonth() / 3);
    const quarter2 = Math.floor(date2.getMonth() / 3);
    return quarter1 === quarter2 && date1.getFullYear() === date2.getFullYear();
  };
  const isSameYear = (date1, date2) => date1.getFullYear() === date2.getFullYear();

  // Process the goals to adjust for profit/loss
  const processGoals = () => {
    const processed = goals.flatMap((goal) => {
      const smallerGoals = [];
      
      smallerGoals.push({ ...goal, setAt: goal.setAt });

      if (goal.goalType === 'Yearly') {
        smallerGoals.push(
          { goalType: 'Quarterly', goalAmount: goal.goalAmount / 4, setAt: goal.setAt },
          { goalType: 'Monthly', goalAmount: goal.goalAmount / 12, setAt: goal.setAt },
          { goalType: 'Weekly', goalAmount: goal.goalAmount / 52, setAt: goal.setAt },
          { goalType: 'Daily', goalAmount: goal.goalAmount / 365, setAt: goal.setAt }
        );
      } else if (goal.goalType === 'Quarterly') {
        smallerGoals.push(
          { goalType: 'Monthly', goalAmount: goal.goalAmount / 3, setAt: goal.setAt },
          { goalType: 'Weekly', goalAmount: goal.goalAmount / 13, setAt: goal.setAt },
          { goalType: 'Daily', goalAmount: goal.goalAmount / 91, setAt: goal.setAt }
        );
      } else if (goal.goalType === 'Monthly') {
        smallerGoals.push(
          { goalType: 'Weekly', goalAmount: goal.goalAmount / 4, setAt: goal.setAt },
          { goalType: 'Daily', goalAmount: goal.goalAmount / 30, setAt: goal.setAt }
        );
      } else if (goal.goalType === 'Weekly') {
        smallerGoals.push(
          { goalType: 'Daily', goalAmount: goal.goalAmount / 7, setAt: goal.setAt }
        );
      }

      return smallerGoals.map((smallerGoal) => {
        const totalProfit = calculateTotalProfit(smallerGoal, pnlData);
        const adjustedGoalAmount = smallerGoal.goalAmount - totalProfit;
        const goalPercentage = (totalProfit / smallerGoal.goalAmount) * 100;
        
        return { ...smallerGoal, totalProfit, goalPercentage, adjustedGoalAmount };
      });
    });

    setProcessedGoals(processed);
  };

  // Fetch goals and PnL data on component mount
  useEffect(() => {
    fetchGoals();
    fetchPnLData();
  }, []);

  // Recalculate processed goals when either goals or PnL data changes
  useEffect(() => {
    if (goals.length > 0 && pnlData.length > 0) {
      processGoals();
    }
  }, [goals, pnlData]);

  // Navigate to 'setgoals' page
  const navigateToSetGoals = () => {
    navigate('/setgoals');
  };

  return (
    <div>
      {processedGoals.length > 0 ? (
        <div>
          <div className="goals-container">
            {processedGoals.map((data, index) => (
              <Card key={index} {...data} />
            ))}
          </div>
          <div className="goal-actions">
            <button className="form-button" onClick={() => deleteGoal(processedGoals[0]._id)}>
              Delete Goal
            </button>
          </div>
        </div>
      ) : (
        <div className="no-goals-message">
          <p>Set your goals to track your progress</p>
          <button className="form-button" onClick={navigateToSetGoals}>Set Goal</button>
        </div>
      )}
    </div>
  );
};

export default Goals;
