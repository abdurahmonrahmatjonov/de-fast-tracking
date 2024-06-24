import React, { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { Menu } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import logo from "../assets/images/BIS logo.svg";
import "../assets/style/menu.css";
import  {setCollapse, setSelectedPath, setOpenMiniMenu} from '../slice/mainSlice';
import { useSelector,useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { MdDashboard } from 'react-icons/md';

export const Menubar = () => {
  const {t} = useTranslation()
  const {collapse, selectedPath, openMiniMenu} = useSelector(
    state => state.main,
  );
  const dispatch = useDispatch();
  const [menuHeight, setMenuHeight] = useState("auto");

  const navigate = useNavigate();

  useEffect(() => {
    const menu = document.getElementById("menu");
    if (menu) {
      setMenuHeight(`${menu.scrollHeight}px`);
    }
  }, [collapse]);


  const toggleCollapsed = () => {
    dispatch(setCollapse(!collapse));
  };
  const onSelectMenuItem = item => {
    dispatch(setSelectedPath(item.key));
    navigate(`/${item.key}`);
  };


  const getMenuItems = () => {
    let items = [
      {
        key: "tracking-list",
        icon: <MdDashboard style={{ fontSize: "25px", color: "white" }} />,
        label: t("tracking-list"),
      }
    ];

    return items;
  };

  const items = getMenuItems();

  return (
    <div className="flex">
      <div className={`${
        collapse ? "w-[80px]" : "w-[250px]"
        } h-${menuHeight} bg-[#0A4D68]`}
      >
        <div className="flex gap-6 pt-7">
          {collapse ? (
            ""
          ) : (
            <img src={logo} alt="" className="ml-7" />
          )}

          <button
            onClick={toggleCollapsed}
            className="bg-[#0A4D68] text-white text-2xl"
          >
            {collapse ? (
              <MenuUnfoldOutlined className="ml-8" />
            ) : (
              <MenuFoldOutlined />
            )}
          </button>
        </div>
        <div className="mt-20">
          <Menu
          defaultOpenKeys={openMiniMenu}
          selectedKeys={[selectedPath]}
          mode="inline"
          inlineCollapsed={collapse}
          items={items}
          className="bg-transparent m-auto"
          theme="light"
          onSelect={onSelectMenuItem}
          onOpenChange={v => {
            dispatch(setOpenMiniMenu(v));
          }}
        />
        </div>
      </div>
    </div>
  );
};

export default Menubar;
