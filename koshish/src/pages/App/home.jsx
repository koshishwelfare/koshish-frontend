import React from 'react'

import Education from '../../component/App/home/Education'
import IndexHeader from '../../component/App/home/header'
import Culture from '../../component/App/home/aim'
import Event from '../../component/App/home/event'
import Mentor from '../../component/App/home/mentor'
import Testimorals from '../../component/App/home/testimorals'
import Achievement from '../../component/App/home/Achievement'
import About from '../../component/App/home/about'
import Top from '../../component/App/home/top'

const HomeApp = () => {
  return (
    <div className='app-shell md:pr-16 md:pl-16'>
      <Top />
      <IndexHeader />
      <Culture />
      <About />
      <Event />
      <Education />
      <Mentor />
      <Achievement />
      <Testimorals />
    </div>
  )
}

export default HomeApp