import React, { useState, useEffect, useCallback, useRef } from "react";
import { Input, Button } from "antd";
import Menubar from "../components/Menu";
import { useSelector } from "react-redux";
import { http } from "../services/http";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useTranslation } from "react-i18next";
import { column } from "../utils/columns";
import { aggregateDocuments } from "../utils/document";
import moment from "moment";
import "jspreadsheet-ce/dist/jspreadsheet.css";
import jspreadsheet from "jspreadsheet-ce";
import Navbar from '../components/navbar';

const TrackingList = () => {
  const employeId = useSelector((state) => state.main.employeeId);
  const { t } = useTranslation();
  const spreadsheetRef = useRef(null);
  const [fdata, setFData] = useState([]);
  const [loading, setLoading] = useState(true);
  const jspreadsheetInstanceRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  let searchInput = null;

  const handleSearch = (e, confirm, dataIndex) => {
    const value = e.target.value;
  };

  const getColumnSearchProps = (dataIndex) => {
    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={(node) => {
              searchInput = node;
            }}
            placeholder={`${t("search")} ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
              handleSearch(e, confirm, dataIndex);
            }}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          ? record[dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : "",
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.select(), 100);
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
    };
  };

  const columns = column(t, getColumnSearchProps).map((col) => {
    if (col.dataIndex === "summa") {
      return {
        ...col,
        render: (text, record) => {
          const formattedText = new Intl.NumberFormat("fr-FR").format(
            record.summa,
          );
          return `${formattedText} ${record.currency && Array.isArray(record.currency) ? record.currency[0] : ''}`;
        },
      };
    }

    if (col.dataIndex === "docNum") {
      return {
        ...col,
        title: t("numSale"),
      };
    }

    return col;
  });

  const fetchData = useCallback(
    async (page) => {
      try {
        setLoading(true);
        const { data } = await http.get(
          `api/meningsotuvlarim?ownerCode=${employeId}&pageToken=${page}`,
        );

        const formattedData = aggregateDocuments(data);
        console.log(formattedData);
        const maxsulotLengths = formattedData.map(
          (entry) => entry.maxsulot.length,
        );
        const totalMaxsulotLength = maxsulotLengths.reduce(
          (sum, length) => sum + length,
          0,
        );

        const hasMore = totalMaxsulotLength === 10 ? true : false;
        setFData(formattedData);
        setHasMoreData(hasMore);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    },
    [employeId],
  );

  const handleSave = () => {
    if (!jspreadsheetInstanceRef.current) {
      return; // If no spreadsheet instance exists, exit early
    }

    const updatedData = jspreadsheetInstanceRef.current.getData(); // Get updated data from the spreadsheet instance
    console.log("Updated Data:", updatedData);

    // Example: Send updated data to a server using HTTP POST request
    saveUpdatedData(updatedData);
  };

  const saveUpdatedData = async (data) => {
    try {
      setLoading(true);
      // Example: Replace with your actual HTTP POST request to save data
      const response = await http.post('api/saveData', { data });
      console.log("Save response:", response.data); // Log response or handle success message
      // Optionally, update local state or perform additional actions upon successful save
    } catch (error) {
      console.error("Error saving data:", error);
      // Handle error state or display error message to user
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    const tableData = fdata.map((item) => ({
      ...item,
      maxsulot: item.maxsulot.join(", "),
      sana: moment(item.sana, "DD.MM.YYYY").format("DD.MM.YYYY, HH:mm:ss"), // Specify date format
    }));

    if (spreadsheetRef.current) {
      if (jspreadsheetInstanceRef.current) {
        jspreadsheetInstanceRef.current.destroy();
      }

      jspreadsheetInstanceRef.current = jspreadsheet(spreadsheetRef.current, {
        data: tableData.map((row) => columns.map((col) => row[col.dataIndex])),
        columns: columns.map((col) => ({
          type: "text",
          title: col.title,
          width: col.width || 150,
        })),
        minDimensions: [columns.length, tableData.length],
        editable: isEditable,
      });
    }
  }, [fdata, columns, isEditable]);
  // Fetch data on initial load
  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

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
            onClick={handleSave}
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
