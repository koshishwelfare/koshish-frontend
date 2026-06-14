import React, { useState,useContext,useEffect } from "react";
import { Helmet } from "react-helmet-async";
import MemberSection from "./MemberSection";
import CoCircular from "./CoCircular";
import Coordinator from "./Coordinator";
import ColabOrg from "./ColabOrg";
import { AppContext } from "../../../context/App";
import SectionTabs from "../../common/SectionTabs";

const tabItems = [
  { id: 0, label: "Member" },
  { id: 1, label: "Co-Curricular" },
  { id: 2, label: "Coordinator" },
  { id: 3, label: "Collaborator" },
];

const IndexFamiliy = () => {
  const [tab, setTab] = useState(0);
  const { setDocuTitle } = useContext(AppContext)

  useEffect(() => {
    setDocuTitle('family-Koshish')
  }, [setDocuTitle])

  return (
    <div className="relative top-20 mb-20 bg-green-50 md:top-32 md:mb-32">
      <div className="app-section">
        <SectionTabs tabs={tabItems} activeTab={tab} onTabChange={setTab} />
      </div>

      <Helmet>
        <title>family</title>
        <meta name="description" content="Explore the various facets of the Koshish family." />
        <meta name="keywords" content="Koshish, Family, Community" />
        <meta name="author" content="Koshish Team" />
      </Helmet>
      <div className="mt-4">
        {tab === 0 && <MemberSection />}
        {tab === 1 && <CoCircular />}
        {tab === 2 && <Coordinator />}
        {tab === 3 && <ColabOrg />}
      </div>
    </div>
  );
};

export default IndexFamiliy;
