import React, { useState,useEffect,useContext } from "react";
import { Helmet } from "react-helmet-async";
import NewEvent from "./NewEvent";
import PastEvent from "./PastEvent";
import { AppContext } from "../../../context/App";
import SectionTabs from "../../common/SectionTabs";

const IndexEvent = () => {
  const [tab, setTab] = useState(0);
  const { setDocuTitle } = useContext(AppContext)

  useEffect(()=>{
    setDocuTitle('Events-Koshish')
  }, [setDocuTitle])

  const tabs = [
    { id: 0, label: "Latest" },
    { id: 1, label: "Past" },
  ];

  return (
    <div className="relative top-20 mb-24 md:top-32 md:mb-32">
      <Helmet>
        <title>Events</title>
        <meta name="description" />
      </Helmet>
      <div className="app-section">
        <SectionTabs tabs={tabs} activeTab={tab} onTabChange={setTab} />
      </div>

      {tab == 0 && <NewEvent />}
      {tab == 1 && <PastEvent />}
    </div>
  );
};

export default IndexEvent;
