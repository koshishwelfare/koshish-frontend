import React from "react";
import { FaYoutube, FaLinkedin, FaInstagram } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Logo from "../assets/koshishlogo.png";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const Footer = () => {
  const navigate = useNavigate();
  const position = [26.45835, 82.56189];
  const googleMapsUrl = `https://www.google.com/maps?q=${position[0]},${position[1]}`;

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Contact Us", path: "/contact" },
    { label: "Privacy and Policy", path: "/privacy-and-policy" },
    { label: "Events", path: "/events" },
    { label: "Family", path: "/family" },
    { label: "News", path: "/news" },
    { label: "Gallery", path: "/gallery" },
  ];

  return (
    <footer className="mt-12 w-full overflow-hidden bg-gradient-to-r from-blue12 via-blue21 to-blue10 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 px-6 py-10 md:grid-cols-3">
        <div className="flex max-w-md flex-col items-center md:items-start">
          <img src={Logo} alt="Koshish logo" className="h-20 w-20 rounded-full border border-white/30" />
          <h2 className="mt-3 text-3xl font-bold">Koshish</h2>
          <p className="mt-2 text-center text-sm text-white/85 md:text-left">
            A Welfare and Educational Society
          </p>
          <div className="mt-5">
            <p className="text-sm uppercase tracking-wide text-white/80">Follow us on</p>
            <div className="mt-2 flex items-center justify-center gap-4 md:justify-start">
              <a
                href="https://youtube.com/@koshishwefareoffical"
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl transition-all duration-300 hover:text-[#ff0000]"
                aria-label="Visit Koshish YouTube"
              >
                <FaYoutube />
              </a>
              <a
                href="https://www.linkedin.com/company/koshish-institute-of-education"
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl transition-all duration-300 hover:text-[#0077b5]"
                aria-label="Visit Koshish LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://www.instagram.com/koshishwesociety"
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl transition-all duration-300 hover:text-[#c13584]"
                aria-label="Visit Koshish Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
          <p className="mt-5 text-sm text-white/80">&copy; {new Date().getFullYear()} All rights reserved</p>
          <p className="mt-1 text-sm text-white/80">
            Made with love by {" "}
            <a
              href="https://www.linkedin.com/company/99205021"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-emerald-200 hover:text-emerald-100"
            >
              SDC-ABN
            </a>
          </p>
        </div>

        <div className="app-card h-full rounded-2xl border border-emerald-100 bg-white/95 p-5 text-center text-slate-800 shadow-md md:text-left">
          <h2 className="text-2xl font-bold text-blue12">Contact Us</h2>
          <p className="mt-3 text-sm text-slate-700">
            <a href="tel:+918467865427" className="hover:text-emerald-700">
              Mob: +91 84678 65427
            </a>
            <br />
            <a href="mailto:team@koshishwelfare.in" className="hover:text-emerald-700">
              Email: team@koshishwelfare.in
            </a>
          </p>
          <h3 className="mt-5 text-xl font-semibold text-blue12">Our Location</h3>
          <p className="mt-2 text-sm text-slate-700">
            Akbarpur - Tanda Road, Akbarpur, Ravepur Vhaudden Pur, Uttar Pradesh 224122
          </p>
          <div className="relative z-0 mt-4 overflow-hidden rounded-xl border border-emerald-200">
            <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="h-44 w-full">
              <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={position}>
                <Popup>
                  Koshish Welfare
                  <br />
                  Ambedkar Nagar, UP, India
                  <br />
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    Open in Google Maps
                  </a>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        <div className="app-card h-full rounded-2xl border border-emerald-100 bg-white/95 p-5 text-slate-800 shadow-md">
          <h2 className="text-center text-2xl font-bold text-blue12 md:text-left">Important Links</h2>
          <ul className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 sm:text-base">
            {quickLinks.map((item) => (
              <li
                key={item.path}
              >
                <button
                  type="button"
                  className="w-full cursor-pointer rounded-md px-2 py-1 text-left text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
