import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../context/App';
import { FaLinkedin } from "react-icons/fa";
import { StudentContext } from '../../../context/StudentContext';
import { TeacherContext } from '../../../context/TeacherContext';
import {
  followTeacherProfile,
  getMemberProfileDashboard,
  unfollowTeacherProfile
} from '../../../utils/App/mentor/profileDashboard';
import Pagination from '../../common/Pagination';
import SearchFilterSort from '../../common/SearchFilterSort';
import SectionTabs from '../../common/SectionTabs';
import { toast } from 'react-toastify';

const MyMentor = () => {
  const { id } = useParams();
  const { setDocuTitle, myMentor, handelgetmyMentor } = useContext(AppContext);
  const { stuToken } = useContext(StudentContext);
  const { teaToken } = useContext(TeacherContext);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('daily_activity');
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterValue, setFilterValue] = useState('all');

  const fetchDashboard = async (targetPage = page, targetLimit = limit) => {
    const response = await getMemberProfileDashboard(
      import.meta.env.VITE_BACKEND_URL,
      id,
      {
        page: targetPage,
        limit: targetLimit,
        activityTab: activeTab,
        q: searchValue,
        filterBy: filterValue,
        sortBy: sortValue,
        sortOrder
      },
      { studentToken: stuToken, teacherToken: teaToken }
    );

    if (response?.success) {
      setDashboardData(response.data);
    }
  };

  useEffect(() => {
    const fetchMentor = async () => {
      setLoading(true);
      await handelgetmyMentor(id);
      setLoading(false);
    };
    fetchMentor();
  }, [id, handelgetmyMentor]);

  useEffect(() => {
    fetchDashboard(page, limit);
  }, [id, stuToken, teaToken, page, limit, activeTab, searchValue, sortValue, sortOrder, filterValue]);

  useEffect(() => {
    if (myMentor?.name) {
      setDocuTitle(`${myMentor.name}-Koshish`);
    }
  }, [myMentor, setDocuTitle]);

  const handleFollowToggle = async () => {
    if (!dashboardData?.viewer?.canFollow || followLoading) return;

    setFollowLoading(true);
    try {
      const viewerType = dashboardData.viewer.type;
      const token = viewerType === 'teacher' ? teaToken : stuToken;

      const response = dashboardData.viewer.isFollowing
        ? await unfollowTeacherProfile(import.meta.env.VITE_BACKEND_URL, viewerType, id, token)
        : await followTeacherProfile(import.meta.env.VITE_BACKEND_URL, viewerType, id, token);

      if (response?.success) {
        toast.success(response.message || 'Updated follow status');
        await fetchDashboard(page, limit);
      } else {
        toast.error(response?.message || 'Unable to update follow status');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Unable to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  const timeline = dashboardData?.timeline || [];
  const stats = dashboardData?.stats || {};
  const viewer = dashboardData?.viewer || {};
  const pagination = dashboardData?.pagination;

  const tabs = [
    { id: 'daily_activity', label: 'Daily Activity Log' },
    { id: 'test', label: 'Tests' },
    { id: 'event', label: 'Events' },
    { id: 'class', label: 'Classes Joined' }
  ];

  const filterOptionsByTab = {
    daily_activity: [
      { label: 'All', value: 'all' },
      { label: 'Manual', value: 'manual' },
      { label: 'System', value: 'system' }
    ],
    test: [
      { label: 'All', value: 'all' },
      { label: 'System', value: 'system' }
    ],
    event: [
      { label: 'All', value: 'all' },
      { label: 'Active', value: 'active' },
      { label: 'Past', value: 'past' }
    ],
    class: [
      { label: 'All', value: 'all' },
      { label: 'Direct', value: 'direct' },
      { label: 'Activity', value: 'activity' }
    ]
  };

  const activityLabelMap = {
    daily_activity: 'Daily Activity',
    test: 'Test',
    event: 'Event',
    attendance: 'Attendance',
    class: 'Class'
  };

  const badgeClassMap = {
    daily_activity: 'bg-blue-100 text-blue-700',
    test: 'bg-violet-100 text-violet-700',
    event: 'bg-emerald-100 text-emerald-700',
    attendance: 'bg-amber-100 text-amber-700',
    class: 'bg-sky-100 text-sky-700'
  };

  const attendanceRate = Number(stats.attendanceRate || 0);
  const safeAttendanceRate = Number.isFinite(attendanceRate)
    ? Math.max(0, Math.min(100, attendanceRate))
    : 0;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setPage(1);
    setSearchValue('');
    setSortValue('date');
    setSortOrder('desc');
    setFilterValue('all');
  };

  const handleResetControls = () => {
    setPage(1);
    setLimit(10);
    setSearchValue('');
    setSortValue('date');
    setSortOrder('desc');
    setFilterValue('all');
  };

  if (loading || !myMentor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 pt-24">
        <p className="text-xl font-semibold text-blue10 animate-pulse">
          Loading mentor details...
        </p>
      </div>
    );
  }

  return myMentor &&  (
    <div className="min-h-screen bg-[#f3f5f8] flex items-center justify-center pt-24 px-4 pb-32">
        <Helmet>
          <title>{`${myMentor.name} - Koshish`}</title>
          <meta name='description' content={`Learn more about ${myMentor.name}, a mentor at Koshish.`} />
          <meta name='keywords' content={`Koshish, Mentors, ${myMentor.name}`} />
          <meta name='author' content='Koshish Team' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta name='robots' content='index, follow' />
        </Helmet>

      <div className="max-w-6xl w-full rounded-2xl bg-white shadow-xl border border-slate-200 p-6 md:p-8 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Member Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-xl bg-[#1f2937] text-white p-5 space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={myMentor.image}
                alt={myMentor.name || 'Mentor Photo'}
                className="w-20 h-20 rounded-xl object-cover border border-white/30"
              />
              <div>
                <h2 className="text-xl font-bold">{myMentor.name || 'Unnamed Mentor'}</h2>
                <p className="text-sm text-slate-200">{myMentor.speciality || 'Mentor'}</p>
                {myMentor.yog !== -1 && (
                  <p className="text-xs text-slate-300 mt-1">YOG: {myMentor.yog - 4} - {myMentor.yog - 2000}</p>
                )}
              </div>
            </div>

            {viewer?.canFollow && (
              <button
                type="button"
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`w-full px-4 py-2 rounded-md text-sm font-semibold transition ${
                  viewer.isFollowing
                    ? 'bg-slate-600 text-white hover:bg-slate-500'
                    : 'bg-emerald-500 text-white hover:bg-emerald-400'
                } ${followLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {followLoading
                  ? 'Updating...'
                  : viewer.isFollowing
                    ? 'Following'
                    : 'Follow'}
              </button>
            )}

            <div className="space-y-2 text-sm">
              <p><span className="text-slate-300">Followers:</span> {stats.followersCount || 0}</p>
              <p><span className="text-slate-300">Following:</span> {stats.followingCount || 0}</p>
              {myMentor.joinTime && (
                <p><span className="text-slate-300">Joined:</span> {new Date(myMentor.joinTime).toDateString()}</p>
              )}
              {myMentor.linkedin !== 'NAN' && (
                <a
                  href={myMentor.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sky-300 hover:text-sky-200"
                >
                  <FaLinkedin /> LinkedIn
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Daily Activity</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stats.dailyActivityCount || 0}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Tests</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stats.testsCount || 0}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Events</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stats.eventsCount || 0}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Classes Joined</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stats.joinedClassesCount || 0}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2 xl:col-span-3">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-slate-500">Mentor Attendance</p>
                <p className="text-sm font-semibold text-slate-700">{safeAttendanceRate.toFixed(2)}%</p>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${safeAttendanceRate}%` }}
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                <p className="rounded-md bg-white px-2 py-1 border border-slate-200">
                  Present: <span className="font-semibold">{stats.attendancePresent || 0}</span>
                </p>
                <p className="rounded-md bg-white px-2 py-1 border border-slate-200">
                  Absent: <span className="font-semibold">{stats.attendanceAbsent || 0}</span>
                </p>
                <p className="rounded-md bg-white px-2 py-1 border border-slate-200">
                  Late: <span className="font-semibold">{stats.attendanceLate || 0}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Speciality */}
        {myMentor.speciality !== 'NAN' && (
          <p className="text-blue-600 text-lg font-semibold">
            {myMentor.speciality}
          </p>
        )}

        {/* Quote */}
        {myMentor.quote !== 'NAN' && (
          <blockquote className="relative text-gray-600 text-lg italic bg-blue-50 p-6 rounded-lg shadow-inner max-w-2xl">
            <span className="absolute -top-5 left-5 text-5xl text-blue-400">“</span>
            <span className="block px-4">{myMentor.quote}</span>
            <span className="absolute -bottom-5 right-5 text-5xl text-blue-400">”</span>
          </blockquote>
        )}

        {/* About Section */}
        {(myMentor.aboutHead !== 'NAN' || myMentor.about !== 'NAN') && (
          <div className="w-full text-left space-y-4">
            {myMentor.aboutHead !== 'NAN' && (
              <h3 className="text-2xl font-bold text-blue-700 border-b-2 border-blue-400 pb-2">
                {myMentor.aboutHead}
              </h3>
            )}
            {myMentor.about !== 'NAN' && (
              <p className="text-gray-700 text-lg bg-gray-50 p-4 rounded-md shadow">
                {myMentor.about}
              </p>
            )}
          </div>
        )}

        {/* Details */}
        <div className="w-full flex flex-col items-start space-y-2">
          {myMentor.joinTime && (
            <p className="text-gray-600 text-sm">
              Joined on {new Date(myMentor.joinTime).toDateString()}
            </p>
          )}
          
          
          
          {myMentor.linkedin !== 'NAN' && (
            <div className="flex items-center space-x-2 pt-2">
              <span className="text-gray-700 text-lg font-semibold">🔗 Contact: </span>
              <a
                href={myMentor.linkedin}
                target="_blank"
                className="text-blue-600 hover:text-blue-800 text-2xl transition-transform duration-300 hover:scale-110"
              >
                <FaLinkedin />
              </a>
            </div>
          )}
        </div>

        {myMentor.isActive && (
          <span className="inline-block px-4 py-1 text-sm font-semibold bg-green-100 text-green-700 rounded-full">
            Active Mentor
          </span>
        )}

        {/* Activity Timeline */}
        <div className="w-full text-left space-y-4">
          <h3 className="text-2xl font-bold text-blue-700 border-b-2 border-blue-400 pb-2">
            Activity Timeline
          </h3>

          <SectionTabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

          <SearchFilterSort
            searchValue={searchValue}
            onSearchChange={(value) => {
              setSearchValue(value);
              setPage(1);
            }}
            filterOptions={filterOptionsByTab[activeTab] || []}
            filterValue={filterValue}
            onFilterChange={(value) => {
              setFilterValue(value);
              setPage(1);
            }}
            sortOptions={[
              { label: 'Date', value: 'date' },
              { label: 'Title', value: 'title' },
              { label: 'Type', value: 'type' }
            ]}
            sortValue={sortValue}
            onSortChange={(value) => {
              setSortValue(value);
              setPage(1);
            }}
            sortOrderValue={sortOrder}
            onSortOrderChange={(value) => {
              setSortOrder(value);
              setPage(1);
            }}
            onReset={handleResetControls}
          />

          {timeline.length === 0 ? (
            <p className="text-gray-600">No records found for this tab.</p>
          ) : (
            <div className="space-y-3">
              {timeline.map((activity) => (
                <div key={activity.id} className="bg-white rounded-xl shadow p-4 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${badgeClassMap[activity.type] || 'bg-slate-100 text-slate-700'}`}
                    >
                      {activityLabelMap[activity.type] || activity.type}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(activity.date).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-slate-800">{activity.title}</p>
                  {activity.description ? (
                    <p className="text-sm text-slate-600">{activity.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(nextPage) => {
                setPage(nextPage);
              }}
              limit={limit}
              onLimitChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default MyMentor;
