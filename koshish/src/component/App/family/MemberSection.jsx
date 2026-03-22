import React, { useState } from "react";
import SectionTabs from "../../common/SectionTabs";
import IndexMentor from "./Mentor";
import IndexAlumni from "./alumni";
import Visionary from "./Visionary";
import Sponsor from "./Sponsor";

const memberTabs = [
  { id: 0, label: "Mentor" },
  { id: 1, label: "Alumni" },
  { id: 2, label: "Visionary" },
  { id: 3, label: "Sponsor" }
];

const MemberSection = () => {
  const [memberTab, setMemberTab] = useState(0);

  return (
    <div className="space-y-4">
      <div className="app-section">
        <SectionTabs tabs={memberTabs} activeTab={memberTab} onTabChange={setMemberTab} />
      </div>

      <div>
        {memberTab === 0 && <IndexMentor />}
        {memberTab === 1 && <IndexAlumni />}
        {memberTab === 2 && <Visionary />}
        {memberTab === 3 && <Sponsor />}
      </div>
    </div>
  );
};

export default MemberSection;