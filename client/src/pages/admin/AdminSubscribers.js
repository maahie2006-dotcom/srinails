// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import './AdminSubscribers.css';

// const AdminSubscribers = () => {
//   const [subscribers, setSubscribers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchSubscribers();
//   }, []);

//   const fetchSubscribers = async () => {
//     try {
//       const { data } = await axios.get('/api/newsletter/subscribers');
//       setSubscribers(data);
//     } catch (err) {
//       toast.error("Failed to load subscribers 💅");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to remove this member from the SriNails family?")) {
//       try {
//         await axios.delete(`/api/newsletter/subscribers/${id}`);
//         toast.success("Subscriber removed successfully");
//         setSubscribers(subscribers.filter(s => s._id !== id));
//       } catch (err) {
//         toast.error("Delete failed. Please try again.");
//       }
//     }
//   };

//   // ✅ Feature: Search/Filter Logic
//   const filteredSubscribers = subscribers.filter(s => 
//     s.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // ✅ Feature: Export to CSV (Great for project reports!)
//   const exportToCSV = () => {
//     const headers = ["Email,Joined Date\n"];
//     const rows = subscribers.map(s => `${s.email},${new Date(s.subscribedAt).toLocaleDateString()}`).join("\n");
//     const blob = new Blob([headers + rows], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.setAttribute('href', url);
//     a.setAttribute('download', 'SriNails_Subscribers.csv');
//     a.click();
//   };

//   return (
//     <div className="admin-page container animate-in">
//       <div className="admin-header-flex">
//         <div>
//           <h2>Newsletter Family 💌</h2>
//           <p className="sub-text">Managing your {subscribers.length} loyal community members</p>
//         </div>
//         <button onClick={exportToCSV} className="btn-secondary">📥 Export List</button>
//       </div>

//       <div className="admin-controls">
//         <input 
//           type="text" 
//           placeholder="Search by email..." 
//           className="admin-search-input"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>
      
//       {loading ? (
//         <div className="luxe-loader">Fetching the mailing list... ✨</div>
//       ) : (
//         <div className="table-responsive">
//           <table className="luxe-table">
//             <thead>
//               <tr>
//                 <th>Email Address</th>
//                 <th>Joined Date</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredSubscribers.length > 0 ? (
//                 filteredSubscribers.map(s => (
//                   <tr key={s._id}>
//                     <td className="email-cell">{s.email}</td>
//                     <td>{new Date(s.subscribedAt).toLocaleDateString('en-IN', {
//                       day: 'numeric',
//                       month: 'short',
//                       year: 'numeric'
//                     })}</td>
//                     <td>
//                       <button 
//                         onClick={() => handleDelete(s._id)} 
//                         className="delete-btn-icon"
//                         title="Remove Subscriber"
//                       >
//                         Delete 🗑️
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="3" className="empty-table-msg">
//                     No subscribers found matching your search.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminSubscribers;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AdminSubscribers.css';

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data } = await axios.get('/api/newsletter/subscribers');
      setSubscribers(data);
    } catch (err) {
      toast.error("Failed to load subscribers 💅");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this member from the SriNails family?")) {
      try {
        await axios.delete(`/api/newsletter/subscribers/${id}`);
        toast.success("Subscriber removed successfully");
        setSubscribers(subscribers.filter(s => s._id !== id));
      } catch (err) {
        toast.error("Delete failed. Please try again.");
      }
    }
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ["Email,Joined Date\n"];
    const rows = subscribers.map(s => `${s.email},${new Date(s.subscribedAt).toLocaleDateString()}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'SriNails_Subscribers.csv');
    a.click();
  };

  return (
    /* ✅ FIX 1: Added page-wrapper to push content below the Navbar */
    <div className="page-wrapper container animate-in">
      <div className="admin-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Newsletter Family 💌</h2>
          <p className="sub-text">Managing your {subscribers.length} loyal community members</p>
        </div>
        {/* ✅ FIX 2: Used btn-primary for a more luxury look */}
        <button onClick={exportToCSV} className="btn-primary">📥 Export List</button>
      </div>

      <div className="admin-controls" style={{ marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Search by email..." 
          className="form-input" /* ✅ FIX 3: Used your global form-input class */
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {loading ? (
        /* ✅ FIX 4: Used your global loading-center class */
        <div className="loading-center">Fetching the mailing list... ✨</div>
      ) : (
        /* ✅ FIX 5: Wrapped table in luxe-card for that premium feel */
        <div className="luxe-card">
          <div className="table-responsive">
            <table className="luxe-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--blush)' }}>
                  <th style={{ padding: '20px', color: 'var(--plum)' }}>Email Address</th>
                  <th style={{ padding: '20px', color: 'var(--plum)' }}>Joined Date</th>
                  <th style={{ padding: '20px', color: 'var(--plum)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.length > 0 ? (
                  filteredSubscribers.map(s => (
                    <tr key={s._id} style={{ borderBottom: '1px solid var(--soft-gray)' }}>
                      <td className="email-cell" style={{ padding: '20px', color: 'var(--rose)', fontWeight: '500' }}>{s.email}</td>
                      <td style={{ padding: '20px' }}>{new Date(s.subscribedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}</td>
                      <td style={{ padding: '20px' }}>
                        <button 
                          onClick={() => handleDelete(s._id)} 
                          className="delete-btn-icon"
                          style={{ color: 'var(--deep-rose)', fontWeight: '600' }}
                        >
                          Remove 🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="empty-table-msg" style={{ padding: '40px', textAlign: 'center', opacity: '0.6' }}>
                      No subscribers found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscribers;