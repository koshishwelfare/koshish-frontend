import React, { useState,useContext } from 'react'
import { CocirculerContext } from '../../../context/cocirculer';
const inputField = "w-full mt-1 px-3 py-2 border-2 border-blue-400 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-green-400";

const AddMentor = () => {
      const {handelAddMentor} = useContext(CocirculerContext)
      const [name,setName] = useState('');
      const [email, setEmail] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [resdata, setResData] = useState(null);
  const [role, setRole] = useState('');

      const onsubmitHandler = async (e)=>{
          e.preventDefault();
          setIsLoading(true);
          const data = await handelAddMentor({
            name,
            email,
            role
          });
         
          if (data?.success) {
            setName('');
            setEmail('');
            setRole('mentor');
            setResData(data);
          }
          setIsLoading(false);
      }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold text-center mb-6">Add Member</h2>
    <form onSubmit={onsubmitHandler} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputField}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputField}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={inputField}
        >
          <option value={''} disabled>Select Role</option>
          <option value="mentor">Mentor</option>
          <option value="alumni">Alumni</option>
          <option value="sponsor">Sponsor</option>
          <option value="visionary">Visionary</option>
          <option value="cocurricular">Co-Curricular</option>
          <option value="collaborator">Collaborator</option>
        </select>
      </div>
      {
        isLoading ? <p className="text-sm text-blue-500">Adding member...</p>
        :<button
        type="submit"
        className={`${!name || !email || !role ? 'bg-gray-500' : 'bg-green-600'} text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105`}
        disabled={!name || !email || !role}
      >
        Add Member
      </button>
      }
      
      <p className="text-xs text-slate-500 text-center">
        Temporary password is auto-generated at account creation.
        {
          resdata?.email?.sent === false && resdata?.credentials ? (
            <span className="block mt-1 text-red-500">
              Email sending failed. Credentials: {`Username: ${resdata.credentials.username}, Password: ${resdata.credentials.password}`}
            </span>
          ) : null
        }
      </p>
    </form>
  </div>
  )
}

export default AddMentor

