import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CocirculerContext } from "../../../context/cocirculer";
import { useContext } from "react";
const Announcement = () => {
  // State for managing announcement

  const { handelAnnouncement } = useContext(CocirculerContext);
  const [announcement, setAnnouncement] = useState("");
  const [date, setDate] = useState("");
  const [heading, setHeading] = useState("");
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formdata = new FormData();
    formdata.append('date', date);
    formdata.append('heading', heading);
    formdata.append('image', image);
    formdata.append('announcement', announcement);

    try {
      await handelAnnouncement(formdata);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-card mx-auto max-w-3xl p-6 sm:p-8">
      <h2 className="admin-heading mb-6">Add Announcement</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date & Thumbnail - Flex Container */}
        <div className="flex flex-col md:flex-row md:gap-6">
          <div className="flex-1">
            <label htmlFor="news-date" className="mb-2 block text-sm font-semibold text-slate-700">
              Date <span className="text-rose-600">*</span>
            </label>
            <input
              id="news-date"
              type="date"
              value={date}
              onChange={(e)=>setDate(e.target.value)}
              className="admin-input"
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="news-image" className="mb-2 block text-sm font-semibold text-slate-700">
              Announcement Thumbnail <span className="text-rose-600">*</span>
            </label>
            <input
              id="news-image"
              type="file"
              onChange={(e)=>setImage(e.target.files[0])}
              className="admin-input"
              accept="image/*"
              required
            />
          </div>
        </div>

        {/* Heading Input */}
        <div>
          <label htmlFor="news-heading" className="mb-2 block text-sm font-semibold text-slate-700">
            Heading <span className="text-rose-600">*</span>

          </label>
          <input
            id="news-heading"
            type="text"
            value={heading}
            onChange={(e)=> setHeading(e.target.value)}
            className="admin-input"
            required
          />
        </div>

        {/* Announcement & Markdown Preview - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="news-announcement" className="mb-2 block text-sm font-semibold text-slate-700">
              Announcement <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="news-announcement"
              className="admin-input min-h-48"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              rows="8"
              required
            />
          </div>
          <div>
            <div className="mb-1 text-sm font-semibold text-slate-700">
              Markdown Preview
            </div>
            <div className="h-full overflow-auto rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]} >{announcement}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Add Announcement"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Announcement;
