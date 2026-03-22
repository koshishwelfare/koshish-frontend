import React, { useState,useContext,useEffect } from "react"
import Memories from "./memories"
import { Helmet } from "react-helmet-async"
import Newspaper from "./newpaper"
import { AppContext } from "../../../context/App"
import SectionTabs from "../../common/SectionTabs"

const IndexGallery = () => {
   const [tab, setTab]= useState(0)
   const { setDocuTitle } = useContext(AppContext)

   useEffect(() => {
     setDocuTitle('Gallery-Koshish')
   }, [setDocuTitle])

   const tabs = [
     { id: 0, label: 'Memories' },
     { id: 1, label: 'NewsPaper' },
   ]

  return (
    <div className="relative top-20 mb-20 md:top-32 md:mb-32">
      <Helmet>
        <title>Gallery - Koshish</title>
        <meta name="description" content="Explore the beautiful moments captured by Koshish." />
        <meta name="keywords" content="Koshish, Gallery, Memories, NewsPaper" />
        <meta name="author" content="Koshish Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <div className="app-section">
        <SectionTabs tabs={tabs} activeTab={tab} onTabChange={setTab} />
      </div>

      {tab == 0 ? <Memories /> : <Newspaper />}
      
    
</div>
  )
}
export default IndexGallery