import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);

  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    navigate('/')
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <div
        onClick={() => {
          navigate("/");
        }}
        className="flex items-center justify-around cursor-pointer"
      >
        <img
          className="w-20 cursor-pointer rounded-md"
          src={assets.doctorhall}
          alt=""
        />
        <p className="text-primary font-extrabold text-3xl">DoctorHall</p>
      </div>
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">ABOUT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">CONTACT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 rounded-full" src={userData.image} alt="" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-primary cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-primary cursor-pointer"
                >
                  My Appointments
                </p>
                <p
                  onClick={logout}
                  className="hover:text-primary cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Create account
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />
        {/* -----for mobile device------ */}
        <div
          className={`${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            {/* <img src={assets.logo} alt="" /> */}
            <div className="flex items-center justify-around cursor-pointer">
              <img
                className="w-20 cursor-pointer rounded-md"
                src={assets.doctorhall}
                alt=""
              />
              <p className="text-primary font-extrabold text-3xl">DoctorHall</p>
            </div>
            <img
              className="w-7"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-xl font-medium">
            <NavLink to="/" onClick={() => setShowMenu(false)}>
              <p className="px-4 py-2 inline-block rounded">HOME</p>
            </NavLink>
            <NavLink to="/doctors" onClick={() => setShowMenu(false)}>
              <p className="px-4 py-2 inline-block rounded">ALL DOCTORS</p>
            </NavLink>
            <NavLink to="/about" onClick={() => setShowMenu(false)}>
              <p className="px-4 py-2 inline-block rounded">ABOUT</p>
            </NavLink>
            <NavLink to="/contact" onClick={() => setShowMenu(false)}>
              <p className="px-4 py-2 inline-block rounded">CONTACT</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
}
