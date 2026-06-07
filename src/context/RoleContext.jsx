import { createContext, useContext, useState } from 'react';

const RoleContext = createContext(null);

export const ROLES = {
  command: { id:'command', label:'Command Controller', org:'MP Police Control Room',     icon:'🛡️', color:'saffron', img:'https://simhastha.org.in/uploads/images/202512/image_1600x900_how-ujjain-manages-crowd-control-during-simhastha-2028-44e030.webp' },
  health:  { id:'health',  label:'Health Desk',        org:'Ujjain District Hospital',   icon:'🏥', color:'green',   img:'https://simhastha.org.in/uploads/images/202603/image_simhastha-2028-latest-update-disaster-mitra-training-begins-in-ujjain-f716b6.webp' },
  transport:{ id:'transport',label:'Transport Desk',   org:'MP State Road Transport Corp',icon:'🚌', color:'blue',    img:'https://simhastha.org.in/uploads/images/202602/image_1200x675_transport-lessons-from-2016-used-in-ujjain-simhastha-2028-f38802.webp' },
};

export function RoleProvider({ children }) {
  const [role, setRole] = useState(null);
  return (
    <RoleContext.Provider value={{ role, setRole, ROLES }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
