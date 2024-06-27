import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Button, message } from "antd";
import { useSelector } from "react-redux";
import { http } from "../services/http";
import { useTranslation } from "react-i18next";
import { aggregateDocuments } from "../utils/document";
import moment from "moment";
import "jspreadsheet-ce/dist/jspreadsheet.css";
import jspreadsheet from "jspreadsheet-ce";
import Navbar from "../components/navbar";
import { Oval } from "react-loader-spinner";

const TrackingList = () => {
  const employeId = useSelector((state) => state.main.employeeId);

  const { t } = useTranslation();
  const spreadsheetRef = useRef(null);
  const jspreadsheetInstanceRef = useRef(null);

  const [fdata, setFData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [saving, setSaving] = useState(false);


  const columnDefinitions = useMemo(
    () => [
      { type: "text", title: t("item"), width: 250 },
      { type: "text", title: t("date"), width: 250 },
      { type: "text", title: t("whs"), width: 250 },
      { type: "text", title: t("name"), width: 250 },
    ],
    [t]
  );

  const fetchData = useCallback(
    async (page) => {
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
        message.error(t("Error fetching data"));
      } finally {
        setLoading(false);
      }
    },
    [employeId, t]
  );

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
    if (isEditable) {
      handleSave();
    }
  };

  const handleSave = async () => {
    if (!jspreadsheetInstanceRef.current) {
      return;
    }
    const updatedData = jspreadsheetInstanceRef.current.getData();
    console.log("All Data:", updatedData);

    const updatedRows = updatedData
      .map((row, index) => {
        const originalRow = fdata[index];
        if (!isEqual(row, originalRow)) {
          console.log(true);
          return { ...row, id: originalRow.id };
        }
        return null;
      })
      .filter((row) => row !== null);

    console.log("Updated Rows:", updatedRows);
    await saveUpdatedData(updatedRows);
  };

  const saveUpdatedData = async (data) => {
    try {
      setSaving(true);
      const response = await http.post("api/saveData", { data });
      console.log("Save response:", response.data);
      setFData(data);
      message.success(t("Data saved successfully"));
    } catch (error) {
      console.error("Error saving data:", error);
      message.error(t("Error saving data"));
    } finally {
      setSaving(false);
    }
  };


  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  useEffect(() => {
    const tableData = fdata.map((item) => ({
      ...item,
      maxsulot: item.maxsulot ? item.maxsulot.join(", ") : "",
      sana: item.sana
        ? moment(item.sana, "DD.MM.YYYY").format("DD.MM.YYYY")
        : "",
    }));

    if (spreadsheetRef.current && tableData.length > 0) {
      if (jspreadsheetInstanceRef.current) {
        jspreadsheetInstanceRef.current.destroy();
      }

      const jSpreadsheetOptions = {
        data: tableData.map((row) =>
          Object.values(row).map((value) => value || "")
        ),
        columns: columnDefinitions,
        minDimensions: [
          columnDefinitions.length,
          tableData.length,
        ],
        editable: isEditable,
        allowInsertRow: false,
        allowManualInsertRow: false,
        allowInsertColumn: false,
        allowManualInsertColumn: false,
        allowDeleteRow: false,
        allowDeleteColumn: false,
      };

      jspreadsheetInstanceRef.current = jspreadsheet(
        spreadsheetRef.current,
        jSpreadsheetOptions
      );
    }
  }, [columnDefinitions, fdata, isEditable, t]);

  const isEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  return (
    <div className="flex h-full w-full overflow-y-auto">
      <div className="h-screen w-full overflow-y-auto">
        <Navbar />
        <h1 className="font-poppins ml-4 mt-10 text-xl font-bold text-black sm:ml-10 sm:mt-14 sm:text-2xl">
          {t("tracking-list")}
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
            className={`mb-4 ${isEditable ? "bg-green-500" : "bg-blue-500"} text-white hover:bg-green-700`}
            loading={saving}
          >
            {isEditable ? t("Save") : t("Edit")}
          </Button>

          {loading ? (
            <div className="mt-20 flex items-center justify-center">
              <Oval
                height={40}
                width={40}
                color="#0000ff"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#0000ff"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            </div>
          ) : (
            <div className="overflow-auto">
              <div ref={spreadsheetRef} className="h-max w-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingList;