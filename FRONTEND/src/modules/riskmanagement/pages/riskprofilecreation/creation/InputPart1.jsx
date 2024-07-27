// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './InputPart1.css';

// const Inputpart1 = () => {
//   const navigate = useNavigate();
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     // Store data locally
//     localStorage.setItem('riskProfileData', JSON.stringify({
//       title: name,
//       description: description
//     }));

//     navigate('/inputpart2');
//   };

//   return (
//     <div className='app__wrapper'>
//       <div className="form-container">
//         <form className="form" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="name">Name</label>
//             <input
//               required
//               name="name"
//               id="name"
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="description">Description</label>
//             <textarea
//               required
//               cols="50"
//               rows="10"
//               id="description"
//               name="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             ></textarea>
//           </div>
//           <button type="submit" className="form-submit-btn">Next</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Inputpart1;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './InputPart1.css';

const Inputpart1 = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    SLallowedperday: '',
    initialRiskPerTrade: '',
    increaseOnWin: '',
    decreaseOnLoss: '',
    maxRisk: '',
    minRisk: '',
    reset: '',
    growthThreshold: '',
    payoutPercentage: ''
  });

  useEffect(() => {
    if (id) {
      const fetchRiskProfile = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/riskprofiles/${id}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setFormData(data);
        } catch (error) {
          console.error('Error fetching risk profile:', error);
        }
      };

      fetchRiskProfile();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      try {
        const response = await fetch(`http://localhost:4000/api/riskprofiles/${id}`, {
          method: 'PATCH', // Use PATCH for partial updates
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        navigate(`/edit2/${id}`);
      } catch (error) {
        console.error('Error saving risk profile:', error);
      }
    } else {
      // Store data locally
      localStorage.setItem('riskProfileData', JSON.stringify({
        title: formData.title,
        description: formData.description
      }));

      navigate('/inputpart2');
    }
  };

  return (
    <div className='app__wrapper'>
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              cols="50"
              rows="10"
              required
            ></textarea>
          </div>
          {/* Add other form fields similarly */}
          <button type="submit" className="form-submit-btn">Next</button>
        </form>
      </div>
    </div>
  );
};

export default Inputpart1;
