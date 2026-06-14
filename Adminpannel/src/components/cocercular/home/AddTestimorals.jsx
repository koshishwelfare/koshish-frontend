import React, { useState, useContext } from 'react'
import { CocirculerContext } from '../../../context/cocirculer'
const AddTestimorals = () => {
    const {handelTestimorals} = useContext(CocirculerContext)
     const [name,setName] = useState('')
     const [headline, setHeadline] = useState('')
     const [quote, setQuote] = useState('')
     const [linkedin, setLinkedin] = useState('')
     const [image, setImage] = useState(null);
     const [submitting, setSubmitting] = useState(false);

  const onsubmitHandler = async (e)=>{
            e.preventDefault()
            setSubmitting(true);

            const formData = new FormData();
            formData.append('image', image)
            formData.append('name', name)
            formData.append('headline', headline)
            formData.append('linkedin', linkedin)
            formData.append('quote', quote)

            try {
              await handelTestimorals(formData);
            } finally {
              setSubmitting(false);
            }
   }

  return (
    <div className='admin-card mx-auto max-w-2xl p-8'>
        <h2 className='admin-heading mb-6'>Add Testimonial</h2>
        <form onSubmit={onsubmitHandler} className='space-y-6'>
            <div>
                <label htmlFor="testimonial-name" className="mb-2 block text-sm font-semibold text-slate-700">Name <span className="text-rose-600">*</span></label>
                <input 
                id="testimonial-name"
                value={name}
                className='admin-input'
                onChange={(e)=> setName(e.target.value)}
                type="text"
                required />
            </div>
            <div>
                <label htmlFor="testimonial-image" className='mb-2 block text-sm font-semibold text-slate-700' >Upload Image <span className="text-rose-600">*</span></label>
                <input 
                id="testimonial-image"
                className='admin-input'
                onChange={(e)=> setImage(e.target.files[0])}
                type="file"
                accept="image/*"
                required />
            </div>
            <div>
                <label htmlFor="testimonial-headline" className="mb-2 block text-sm font-semibold text-slate-700">Headline <span className="text-rose-600">*</span></label>
                <input 
                id="testimonial-headline"
                value={headline}
                className='admin-input'
                onChange={(e)=> setHeadline(e.target.value)}
                type="text"
                required />
            </div>
            <div>
                <label htmlFor="testimonial-linkedin" className='mb-2 block text-sm font-semibold text-slate-700'>LinkedIn</label>
                <input 
                id="testimonial-linkedin"
                value={linkedin}
                className='admin-input'
                onChange={(e)=> setLinkedin(e.target.value)}
                type="text" />
            </div>
            <div>
                <label htmlFor="testimonial-quote" className='mb-2 block text-sm font-semibold text-slate-700' >Quote <span className="text-rose-600">*</span></label>
                <textarea 
                id="testimonial-quote"
                value={quote}
                className='admin-input'
                onChange={(e)=> setQuote(e.target.value)}
                required
                ></textarea>
            </div>

            <button className='admin-btn admin-btn-primary w-full' disabled={submitting}>{submitting ? 'Saving...' : 'Add Testimonial'}</button>


        </form>

    </div>
  )
}

export default AddTestimorals