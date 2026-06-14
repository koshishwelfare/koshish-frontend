import React, { useState,useContext,useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import PastAnouncement from './PastAnouncement'
import NewAnouncement from './newAnouncement'
import { AppContext } from '../../../context/App'
import SectionTabs from '../../common/SectionTabs'

const Anouncement = () => {
  const [tab, setTab] = useState(0)
  const { setDocuTitle } = useContext(AppContext)

  useEffect(() => {
    setDocuTitle('News-Koshish')
  }, [setDocuTitle])

  const tabs = [
    { id: 0, label: 'Latest' },
    { id: 1, label: 'Past' },
  ]

  return (
    <div className='relative top-20 mb-20 md:top-32 md:mb-32'> 
       <Helmet>
          <title>News - Koshish</title>
          <meta name="description" content="Stay updated with the latest news and announcements from Koshish." />
          <meta name="keywords" content="Koshish, News, Announcements, Updates" />
          <meta name="author" content="Koshish Team" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="index, follow" />
       </Helmet>
      <div className="app-section">
        <SectionTabs tabs={tabs} activeTab={tab} onTabChange={setTab} />
      </div>

       {tab ==0 &&  <NewAnouncement/>}
       { tab ==1 &&  <PastAnouncement/>}
    </div>
  )
}

export default Anouncement