import React from 'react';
import { getUser, removeUserSession } from './Utils/Common';

function Dashboard(props) {
  const user = getUser();

  // handle click event of logout button
  const handleLogout = () => {
    removeUserSession();
    props.history.push('/login');
  }
  if(!user.TE_id)
  {

   return (
     <div>
     Student Dashboard<br />
       Welcome {user.ST_Firstname}!<br /><br />
       <input type="button" onClick={handleLogout} value="Logout" />
     </div>
   );
   }

   if(!user.ST_id)
  {

   return (
     <div>
      Teacher Dashboard<br />
       Welcome {user.TE_FirstName}!<br /><br />
       <input type="button" onClick={handleLogout} value="Logout" />
     </div>
   );
   }
}
export default Dashboard;