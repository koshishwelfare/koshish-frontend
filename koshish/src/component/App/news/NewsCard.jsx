import React from 'react'
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
const NewsCard = ({announcement}) => {
    const navigate = useNavigate();

  return (
    <div 
              key={announcement._id} 
              className="app-card overflow-hidden border border-emerald-100 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <Helmet>
                <title>News - Koshish</title>
                <meta name='description' content={announcement.description} />
                <meta name='keywords' content={announcement.keywords} />
                <meta name='author' content={announcement.author} />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <meta name='robots' content='index, follow' />
              </Helmet>
              <img
                className="w-full h-52 object-cover cursor-pointer"
                onClick={() => navigate(`/news/${announcement._id}`)}
                src={announcement.image}
                alt={announcement.heading}
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-slate-900">{announcement.heading}</h2>
                <p className="mt-2 text-slate-700 line-clamp-2">{announcement.announcement}</p>
                <p className="mt-2 text-slate-500 text-sm">Date: {new Date(announcement.date).toDateString()}</p>
                {announcement.isAtive && (
                  <span className="mt-3 inline-block rounded bg-emerald-500 px-2 py-1 text-xs font-semibold text-white">
                    Active
                  </span>
                )}
              </div>
            </div>
  )
}

export default NewsCard