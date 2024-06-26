import React, { useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { session } from "../services/session";
import { logout } from "../slice/mainSlice";
import { useTranslation } from "react-i18next";
import { Select } from "antd";
import Flag from "react-world-flags";
import logo from "../assets/images/Union (1).png";


const { Option } = Select;

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const user = useSelector((state) => state.main.user);
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
  }, [i18n]);
  const handleClick = () => {
    navigate("/auth");
    session.delete();
    dispatch(logout());
  };

  const handleLanguageChange = (value) => {
    i18n.changeLanguage(value);
    localStorage.setItem('language', value);
  };

  return (
    <div className="relative flex h-[80px] w-full items-center justify-between  bg-[#FFFFFF] pr-10 drop-shadow-xl ">
        <img src={logo} alt="logo" className="h-[30px] ml-8" />
    <div className="relative flex h-[80px] w-full items-center justify-end gap-4 ">
      <Select
        className=" w-32 ml-5"
        defaultValue={i18n.language}
        onChange={handleLanguageChange}
        style={{ width: 120 }}
      >
        <Option value="en">
          <span className="flex items-center">
            <Flag code="GB" className="mr-2" style={{ width: 20 }} />
            EN
          </span>
        </Option>
        <Option value="ru">
          <span className="flex items-center">
            <Flag code="RU" className="mr-2" style={{ width: 20 }} />
            RU
          </span>
        </Option>
        <Option value="uzb">
          <span className="flex items-center">
            <Flag code="UZ" className="mr-2" style={{ width: 20 }} />
            UZB
          </span>
        </Option>
      </Select>

      <div
        className="ml-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#0085FF1A] text-[#0085FF]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsActive(!isActive)}
      >
        {user[0]}
      </div>
      <h1
        className="font-inter text-base font-medium"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsActive(!isActive)}
      >
        {user}
      </h1>
      {(isHovered || isActive) && (
        <button
          className="absolute bottom-[-50px] right-10 ml-10 flex items-center gap-5 rounded bg-red-500 p-2 text-white"
          onClick={handleClick}
        >
          {t("logout")} {"  "}
          <FaSignOutAlt />
        </button>
      )}
    </div>
    </div>
  );
};

export default Navbar;
