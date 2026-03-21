import React, { useState,useContext,useEffect } from 'react'
import { CocirculerContext } from '../../../context/cocirculer';
import {useParams} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
// Tailwind CSS utility classes for input fields
const inputField = "border-4 border-blue-400 bg-gray-100 w-full mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-green-400 px-3 py-2";

const UpdateMentor = () => {
      const {MentorById ,handelMentorById,handelUpdateMentorById} = useContext(CocirculerContext)
      const {id} = useParams()
  const navigate = useNavigate();
      useEffect(()=>{
        handelMentorById(id)
      },[id])
     
      const [name,setName] = useState('');
      const [email, setEmail] = useState('');
      const [role, setRole] = useState('mentor');
      const [isTop, setIsTop] = useState(false);
      const [isActive, setIsActive] = useState(false);
      
      useEffect(()=>{
        if (!MentorById || !MentorById._id) return;

        setName(MentorById.name || '');
        setEmail(MentorById.email || '');
        setRole(MentorById.role || 'mentor');
        setIsTop(Boolean(MentorById.isTop));
        setIsActive(Boolean(MentorById.isActive));

      }, [MentorById])
      
      console.log(MentorById)
      
      
        const onsubmitHandler = async (e)=>{
          e.preventDefault();
          if (!MentorById?._id) return;
          const payload = {
            name,
            email,
            role,
            isTop,
            isActive
          };
          await handelUpdateMentorById(id ,payload)
          navigate(`/member/${id}`)
      }

      if (!MentorById || !MentorById._id) {
        return <div className="admin-card p-6">Loading edit form...</div>;
      }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold text-center mb-6">Update Member</h2>
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
          required
        >
          <option value="mentor">Mentor</option>
          <option value="alumni">Alumni</option>
          <option value="sponsor">Sponsor</option>
          <option value="collaborator">Collaborator</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isTop}
              onChange={(e) => setIsTop(e.target.checked)}
            />
            <span>Top Member</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <span>Active</span>
          </label>
        </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-300 hover:bg-green-700 hover:scale-105"
      >
        Update Member
      </button>
    </form>
  </div>
  )
}

export default UpdateMentor