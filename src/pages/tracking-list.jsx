import React, { useState, useEffect, useCallback, useRef } from "react";
import {  Button } from "antd";
import Menubar from "../components/Menu";
import { useSelector } from "react-redux";
import { http } from "../services/http";
import { useTranslation } from "react-i18next";
import { aggregateDocuments } from "../utils/document";
import moment from "moment";
import "jspreadsheet-ce/dist/jspreadsheet.css";
import jspreadsheet from "jspreadsheet-ce";
import Navbar from "../components/navbar";

const TrackingList = () => {
  const employeId = useSelector((state) => state.main.employeeId);
  const { t } = useTranslation();
  const spreadsheetRef = useRef(null);
  const jspreadsheetInstanceRef = useRef(null);
  const [fdata, setFData] = useState([]);
  const [_, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const fetchData = useCallback(async (page) => {
    try {
      setLoading(true);
      const { data } = await http.get(
        `api/meningsotuvlarim?ownerCode=${employeId}&pageToken=${page}`
      );
      const formattedData = aggregateDocuments(data);
      const maxsulotLengths = formattedData.map(
        (entry) => entry.maxsulot && entry.maxsulot.length
      );
      const totalMaxsulotLength = maxsulotLengths.reduce(
        (sum, length) => sum + (length || 0),
        0
      );
      const hasMore = totalMaxsulotLength === 10;
      setFData(formattedData);
      setHasMoreData(hasMore);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [employeId]);

  const handleNextPage = () => {
    if (hasMoreData) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const toggleEdit = () => {
    setIsEditable((prevEditable) => !prevEditable);
    // Save data when toggling edit mode
    handleSave();
  };

  const handleSave = () => {
    if (!jspreadsheetInstanceRef.current) {
      return;
    }
    const updatedData = jspreadsheetInstanceRef.current.getData();
    console.log("Updated Data:", updatedData);
    saveUpdatedData(updatedData);
  };

  const saveUpdatedData = async (data) => {
    try {
      setLoading(true);
      const response = await http.post("api/saveData", { data });
      console.log("Save response:", response.data);
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  useEffect(() => {
    const tableData = fdata.map((item) => ({
      ...item,
      maxsulot: item.maxsulot ? item.maxsulot.join(", ") : "",
      sana: item.sana ? moment(item.sana, "DD.MM.YYYY").format("DD.MM.YYYY, HH:mm:ss") : "",
    }));

    if (spreadsheetRef.current && tableData.length > 0) {
      if (jspreadsheetInstanceRef.current) {
        jspreadsheetInstanceRef.current.destroy();
      }

      const jSpreadsheetOptions = {
        data: tableData.map((row) =>
          Object.values(row).map((value) => value || "")
        ),
        columns: Object.keys(tableData[0] || {}).map((key) => ({
          type: "text",
          title: key,
          width: 150,
        })),
        minDimensions: [Object.keys(tableData[0] || {}).length, tableData.length],
        editable: isEditable,
      };

      jspreadsheetInstanceRef.current = jspreadsheet(spreadsheetRef.current, jSpreadsheetOptions);
    }
  }, [fdata, isEditable]);

  return (
    <div className="flex h-full w-full overflow-y-auto">
      <Menubar />
      <div className="h-screen w-full overflow-y-auto">
        <Navbar />
        <h1 className="font-poppins ml-4 mt-10 text-xl font-bold text-black sm:ml-10 sm:mt-14 sm:text-2xl">
          {t("MySales")}
        </h1>
        <div className="mt-10 w-full border-[1px] border-[#E8E8E8] sm:mt-14"></div>
        <div className="ml-4 mt-6 sm:ml-10 sm:mt-10">
          <div className="mb-4 flex flex-col justify-between sm:flex-row">
            <div className="font-nunitto font-bold">
              {t("page")} : {currentPage}
            </div>
            <div className="mt-2 flex gap-2 sm:mr-10">
              <Button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="h-[40px] w-[100px] rounded-2xl bg-gray-300 text-gray-700 disabled:bg-gray-200 disabled:text-gray-400 sm:w-[100px]"
              >
                {t("previous")}
              </Button>
              <Button
                onClick={handleNextPage}
                disabled={!hasMoreData}
                className="h-[40px] w-[100px] rounded-2xl bg-[#0A4D68] text-white disabled:bg-gray-200 disabled:text-gray-400 sm:w-[100px]"
              >
                {t("next")}
              </Button>
            </div>
          </div>
          <Button
            onClick={toggleEdit}
            className="mb-4 bg-blue-500 text-white hover:bg-blue-700"
          >
            {isEditable ? t("Save") : t("Edit")}
          </Button>
          <div className="overflow-auto">
            <div ref={spreadsheetRef} className="w-full h-[500px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingList;
