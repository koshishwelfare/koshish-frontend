import React, { useContext, useState } from "react";
import { CocirculerContext } from "../../../context/cocirculer";
import Editor from "../../App/MarkdownEditor/Editor";
import Preview from "../../App/MarkdownEditor/preview";

const AddEvent = () => {
  const { EventHandler } = useContext(CocirculerContext);

  const [eventName, setEventName] = useState("");
  const [thumbnail, setThumbnail] = useState();
  const [startdate, setStartdate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [isPrize, setIsPrize] = useState(false);
  const [PrizeHeading, setPrizeHeading] = useState("");
  const [PrizePara, setPrizePara] = useState("");
  const [IIIrdPrize, setIIIrdPrize] = useState("");
  const [IIndPrize, setIIndPrize] = useState("");
  const [IstPrize, setIstPrize] = useState("");
  const [isCertification, setIsCertification] = useState(false);
  const [desp, setDesp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleonsubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formdata = new FormData();
    formdata.append("image", thumbnail);
    formdata.append("eventName", eventName);
    formdata.append("startdate", startdate);
    formdata.append("endDate", endDate);
    formdata.append("registrationOpen", registrationOpen);
    formdata.append("desp", desp);
    formdata.append("isPrize", isPrize);
    formdata.append("PrizeHeading", PrizeHeading);
    formdata.append("PrizePara", PrizePara);
    formdata.append("IIIrdPrize", IIIrdPrize);
    formdata.append("IIndPrize", IIndPrize);
    formdata.append("IstPrize", IstPrize);
    formdata.append("isCertification", isCertification);

    try {
      await EventHandler(formdata);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-card mx-auto max-w-3xl p-8">
      <h2 className="admin-heading mb-6">Add Home Event</h2>
      <form onSubmit={handleonsubmit} className="space-y-6">
        <div>
          <label htmlFor="event-name" className="mb-2 block text-sm font-semibold text-slate-700">Event Name <span className="text-rose-600">*</span></label>
          <input
            id="event-name"
            onChange={(e) => setEventName(e.target.value)}
            value={eventName}
            className="admin-input"
            type="text"
            required
          />
        </div>

        <div>
          <label htmlFor="event-thumbnail" className="mb-2 block text-sm font-semibold text-slate-700">Upload Thumbnail <span className="text-rose-600">*</span></label>
          <input
            id="event-thumbnail"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="admin-input"
            type="file"
            accept="image/*"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="event-startdate" className="mb-2 block text-sm font-semibold text-slate-700">Start Date <span className="text-rose-600">*</span></label>
            <input
              id="event-startdate"
              onChange={(e) => setStartdate(e.target.value)}
              value={startdate}
              className="admin-input"
              type="date"
              required
            />
          </div>
          <div>
            <label htmlFor="event-enddate" className="mb-2 block text-sm font-semibold text-slate-700">End Date <span className="text-rose-600">*</span></label>
            <input
              id="event-enddate"
              onChange={(e) => setEndDate(e.target.value)}
              value={endDate}
              className="admin-input"
              type="date"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-3">
          <label htmlFor="is-prize" className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input id="is-prize" type="checkbox" checked={isPrize} onChange={(e) => setIsPrize(e.target.checked)} />
            <span>Prize</span>
          </label>
          <label htmlFor="registration-open" className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input id="registration-open" type="checkbox" checked={registrationOpen} onChange={(e) => setRegistrationOpen(e.target.checked)} />
            <span>Registration Open</span>
          </label>
          <label htmlFor="is-certification" className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input id="is-certification" type="checkbox" checked={isCertification} onChange={(e) => setIsCertification(e.target.checked)} />
            <span>Certification</span>
          </label>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-slate-700">Event Description <span className="text-rose-600">*</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
            <Editor markdown={desp} setMarkdown={setDesp} />
            <Preview markdown={desp} />
          </div>
        </div>

        {isPrize && (
          <div className="space-y-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div>
              <label htmlFor="prize-heading" className="mb-2 block text-sm font-semibold text-slate-700">Prize Heading</label>
              <input
                id="prize-heading"
                value={PrizeHeading}
                onChange={(e) => setPrizeHeading(e.target.value)}
                className="admin-input"
                type="text"
              />
            </div>

            
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Prize Criteria</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                <Editor markdown={PrizePara} setMarkdown={setPrizePara} />
                <Preview markdown={PrizePara} />
              </div>
            

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="first-prize" className="mb-2 block text-sm font-semibold text-slate-700">First Prize</label>
                <input
                  id="first-prize"
                  value={IstPrize}
                  onChange={(e) => setIstPrize(e.target.value)}
                  className="admin-input"
                  type="text"
                />
              </div>
              <div>
                <label htmlFor="second-prize" className="mb-2 block text-sm font-semibold text-slate-700">Second Prize</label>
                <input
                  id="second-prize"
                  value={IIndPrize}
                  onChange={(e) => setIIndPrize(e.target.value)}
                  className="admin-input"
                  type="text"
                />
              </div>
              <div>
                <label htmlFor="third-prize" className="mb-2 block text-sm font-semibold text-slate-700">Third Prize</label>
                <input
                  id="third-prize"
                  value={IIIrdPrize}
                  onChange={(e) => setIIIrdPrize(e.target.value)}
                  className="admin-input"
                  type="text"
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="admin-btn admin-btn-primary w-full"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Add Event"}
        </button>
      </form>
    </div>
  );
};

export default AddEvent;
