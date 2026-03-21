import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CoordinatorContext } from "../../context/coordinater";

const ChangeCocirculerForm = () => {
  const navigate = useNavigate();
  const {
    hadleChangeCocirculer,
    cocirculerUsers,
    cocirculerPagination,
    cocirculerLoading,
    handleGetCocirculerList,
    handleActivateCocirculer,
    handleDeactivateCocirculer
  } = useContext(CoordinatorContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [listFilters, setListFilters] = useState({
    q: "",
    isactive: "",
    sortBy: "date",
    sortOrder: "desc",
    page: 1,
    limit: 10
  });
  const [submitting, setSubmitting] = useState(false);
  const [searchDraft, setSearchDraft] = useState('');

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setListFilters((prev) => {
        if (prev.q === searchDraft) return prev;
        return { ...prev, q: searchDraft, page: 1 };
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [searchDraft]);

  useEffect(() => {
    handleGetCocirculerList(listFilters);
  }, [listFilters]);

  const applyListing = async (overrides = {}) => {
    const nextFilters = { ...listFilters, ...overrides };
    setListFilters(nextFilters);
  };

  const activeUserId = useMemo(() => {
    const activeUser = cocirculerUsers.find((user) => user.isactive);
    return activeUser?._id || null;
  }, [cocirculerUsers]);

  const openCocircularProfile = (id) => navigate(`/profile/cocircular/${id}`);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: String(formData.name || "").trim(),
        email: String(formData.email || "").trim().toLowerCase(),
        password: formData.password
      };
      const ok = await hadleChangeCocirculer(payload);
      if (ok) {
        setFormData({ name: "", email: "", password: "" });
      }
    } catch (error) {
      console.log("Error updating:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
        <h2 className="text-xl font-bold text-slate-900">Add Co-curricular User</h2>
        <p className="mt-1 text-sm text-slate-600">
          Create a co-curricular account with name, email and password. New account becomes active automatically.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-3 md:grid-cols-3">
          <div>
            <h3 className="mb-1 text-sm font-semibold text-slate-700">Name</h3>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border rounded px-3 py-2 border-blue-500 w-full"
            placeholder="Enter full name"
            required
          />
        </div>
        <div>
          <h3 className="mb-1 text-sm font-semibold text-slate-700">Email</h3>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border rounded px-3 py-2 border-blue-500 w-full"
            placeholder="Enter email id"
            required
          />
        </div>
        <div>
          <h3 className="mb-1 text-sm font-semibold text-slate-700">Password</h3>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border rounded px-3 py-2 border-blue-500 w-full"
            placeholder="Minimum 8 characters"
            minLength={8}
            required
          />
        </div>
        <button
          type="submit"
          className="md:col-span-3 mt-1 rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-700 disabled:opacity-70"
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Add Co-curricular"}
        </button>
      </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Co-curricular Listing</h3>
          <button
            type="button"
            onClick={() => applyListing({ page: 1 })}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Refresh
          </button>
        </div>

        <div className="mb-3 grid gap-2 md:grid-cols-6">
          <input
            type="text"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Search name, email, speciality"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            value={listFilters.isactive}
            onChange={(e) => setListFilters((prev) => ({ ...prev, isactive: e.target.value, page: 1 }))}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select
            value={listFilters.sortBy}
            onChange={(e) => setListFilters((prev) => ({ ...prev, sortBy: e.target.value, page: 1 }))}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="date">Sort: Created Date</option>
            <option value="name">Sort: Name</option>
            <option value="email">Sort: Email</option>
            <option value="isactive">Sort: Status</option>
          </select>
          <select
            value={listFilters.sortOrder}
            onChange={(e) => setListFilters((prev) => ({ ...prev, sortOrder: e.target.value, page: 1 }))}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
          <select
            value={listFilters.limit}
            onChange={(e) => setListFilters((prev) => ({ ...prev, limit: Number(e.target.value), page: 1 }))}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
          <button
            type="button"
            onClick={() => applyListing({ page: 1 })}
            className="rounded border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Apply
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="px-3 py-2 font-semibold">Name</th>
                <th className="px-3 py-2 font-semibold">Email</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Created</th>
                <th className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cocirculerUsers.length === 0 && !cocirculerLoading ? (
                <tr>
                  <td colSpan={5} className="px-3 py-5 text-center text-slate-500">No co-curricular users found.</td>
                </tr>
              ) : null}

              {cocirculerUsers.map((user) => {
                const isActive = Boolean(user.isactive);
                return (
                  <tr key={user._id} className="border-b border-slate-100">
                    <td className="px-3 py-2 font-medium text-slate-800">
                      <button
                        type="button"
                        onClick={() => openCocircularProfile(user._id)}
                        className="text-left text-blue-700 hover:underline"
                      >
                        {user.name}
                      </button>
                    </td>
                    <td className="px-3 py-2 text-slate-700">{user.email}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      {user.date ? new Date(user.date).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleActivateCocirculer(user._id, listFilters)}
                          disabled={activeUserId === user._id}
                          className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Set Active
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeactivateCocirculer(user._id, listFilters)}
                          disabled={!isActive}
                          className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Deactivate
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <p className="text-xs font-medium text-slate-500">
            Page {cocirculerPagination?.page || 1} of {cocirculerPagination?.totalPages || 1} | Total {cocirculerPagination?.total || 0}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded border px-3 py-1.5 text-sm"
              disabled={(cocirculerPagination?.page || 1) <= 1}
              onClick={() => {
                const nextPage = Math.max((cocirculerPagination?.page || 1) - 1, 1);
                applyListing({ page: nextPage });
              }}
            >
              Prev
            </button>
            <button
              type="button"
              className="rounded border px-3 py-1.5 text-sm"
              disabled={(cocirculerPagination?.page || 1) >= (cocirculerPagination?.totalPages || 1)}
              onClick={() => {
                const nextPage = Math.min(
                  (cocirculerPagination?.page || 1) + 1,
                  cocirculerPagination?.totalPages || 1
                );
                applyListing({ page: nextPage });
              }}
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChangeCocirculerForm;