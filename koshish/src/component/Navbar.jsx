import React, { useContext, useEffect, useMemo, useState } from "react";
import koshishLogo from "../assets/koshish.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { StudentContext } from "../context/StudentContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { stuToken, studentLogout } = useContext(StudentContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);

  const navItems = useMemo(
    () => [
      { to: "/events", label: "Events" },
      { to: "/family", label: "Family" },
      { to: "/news", label: "News" },
      { to: "/gallery", label: "Gallery" },
      { to: "/about", label: "About" },
    ],
    []
  );

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const getNavLinkClass = ({ isActive }) =>
    `rounded-md px-2 py-1 transition ${
      isActive
        ? "text-emerald-300 underline decoration-2 underline-offset-8"
        : "text-white/90 hover:text-emerald-200"
    }`;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY < 20) {
      setShowNavbar(true);
    } else if (currentScrollY > lastScrollY) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleStudentLogout = () => {
    studentLogout();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <nav
      className={`fixed z-50 w-full border-b border-white/10 bg-gradient-to-r from-blue12 via-blue21 to-blue10 text-white shadow-lg transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <NavLink to="/" className="flex items-center gap-2">
          <img
            src={koshishLogo}
            alt="Koshish Logo"
            className="h-12 w-12 sm:h-14 sm:w-14"
          />
          <span className="text-2xl sm:text-3xl font-bold tracking-tight">Koshish</span>
        </NavLink>

        <ul className="hidden md:flex gap-4 items-center text-base lg:text-lg">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={getNavLinkClass}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex">
          <div className="flex items-center gap-3">
            {stuToken ? (
              <>
                <NavLink to="/student">
                  <button className="rounded-lg bg-white px-5 py-2 font-semibold text-blue12 transition hover:bg-slate-100">
                    Student Dashboard
                  </button>
                </NavLink>
                <button
                  type="button"
                  onClick={handleStudentLogout}
                  className="rounded-lg border border-rose-200 bg-rose-500 px-5 py-2 font-semibold text-white transition hover:bg-rose-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/student-auth">
                <button className="rounded-lg bg-white px-5 py-2 font-semibold text-blue12 transition hover:bg-slate-100">
                  Student Login
                </button>
              </NavLink>
            )}
            <NavLink to="/contact">
              <button className="rounded-lg border border-emerald-200 bg-emerald-500 px-5 py-2 font-semibold text-white transition hover:bg-emerald-600">
                Join Us
              </button>
            </NavLink>
          </div>
        </div>

        <button
          className="md:hidden rounded-md p-2 text-2xl text-white/95 transition hover:bg-white/10"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-blue13 px-6 py-4">
          <ul className="flex flex-col gap-4 text-lg">
            <li>
              <NavLink to="/" onClick={() => setIsOpen(false)} className={getNavLinkClass}>
                Home
              </NavLink>
            </li>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} onClick={() => setIsOpen(false)} className={getNavLinkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            {stuToken ? (
              <>
                <li>
                  <NavLink to="/student" onClick={() => setIsOpen(false)} className={getNavLinkClass}>
                    Student Dashboard
                  </NavLink>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleStudentLogout}
                    className="w-full rounded-lg border border-rose-300 bg-rose-500 px-4 py-2 text-left font-semibold text-white transition hover:bg-rose-600"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <NavLink to="/student-auth" onClick={() => setIsOpen(false)} className={getNavLinkClass}>
                  Student Login
                </NavLink>
              </li>
            )}
            <li>
              <NavLink to="/contact" onClick={() => setIsOpen(false)} className={getNavLinkClass}>
                Contact Us
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" onClick={() => setIsOpen(false)}>
                <button className="mt-2 w-full rounded-lg border border-emerald-200 bg-emerald-500 px-4 py-2 font-semibold text-white transition hover:bg-emerald-600">
                  Join Us
                </button>
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
