import React from 'react'
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
const AlbumCard = ({item}) => {
    const navigate = useNavigate();
  return (
    <div
    key={item._id}
    className="app-card cursor-pointer overflow-hidden border border-emerald-100 transition hover:-translate-y-1 hover:shadow-xl"
    onClick={() => navigate(`/gallery/${item._id}`)}
  >
    <Helmet>
      <title>Koshish-Gallery</title>
      <meta name="description" content={item.description} />
      <meta name="keywords" content={item.keywords} />
      <link rel="canonical" href={`https://www.koshishwelfare.in/gallery/${item._id}`} />
      <meta property="og:title" content={item.galleryTitle} />
      <meta property="og:description" content={item.description} />
      <meta property="og:image" content={item.thumbnail} />
      <meta property="og:url" content={`https://www.koshishwelfare.in/gallery/${item._id}`} />
      <meta property="og:type" content="website" />
    </Helmet>
    <img
      src={item.thumbnail}
      alt="thumbnail"
      className="h-48 w-full object-cover"
    />
    <div className="p-3">
      <h3 className="text-lg font-semibold text-blue10">{item.galleryTitle}</h3>
      <p className="text-sm text-slate-700">
        {new Date(item.date).toLocaleDateString()}
      </p>
    </div>
  </div>
  )
}

export default AlbumCard