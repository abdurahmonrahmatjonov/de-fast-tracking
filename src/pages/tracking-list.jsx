import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Button, message } from "antd";
import { http } from "../services/http";
import { useTranslation } from "react-i18next";
import "jspreadsheet-ce/dist/jspreadsheet.css";
import jspreadsheet from "jspreadsheet-ce";
import Navbar from "../components/Navbar";
import { Oval } from "react-loader-spinner";
import { formatData } from "../utils/document";
import moment from "moment"


const TrackingList = () => {
  const { t } = useTranslation();
  const spreadsheetRef = useRef(null);
  const jspreadsheetInstanceRef = useRef(null);

  const [fdata, setFData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [saving, setSaving] = useState(false);

  const columnDefinitions = useMemo(
    () => [
      { type: "text", title: t("docNum"), width: 250,readOnly:true },
      { type: "hidden", title: t("docEntry"), width: 250,readOnly: true },
      { type: "hidden", title: t("cardCode"), width: 250,readOnly: true },
      { type: "text", title: t("cardName"), width: 250,readOnly: true },
      { type: "text", title: t("u_numberOfCntr"), width: 150, readOnly: !isEditable },
      { type: "text", title: t("u_China_platform"), width: 150, readOnly: !isEditable },
      { type: "text", title: t("u_numberPlatformKzx"), width: 150, readOnly: !isEditable },
      { type: "text", title: t("u_StationOfOperationRailway"), width: 200, readOnly: !isEditable },
      { type: "text", title: t("u_DateOfOperation"), width: 150, readOnly: !isEditable },
      { type: "text", title: t("u_LineOfOperation"), width: 150, readOnly: !isEditable },
      { type: "text", title: t("u_DestinationStation"), width: 200, readOnly: !isEditable },
      { type: "text", title: t("u_Remaining_km"), width: 230, readOnly: !isEditable },
      { type: "text", title: t("u_DispatchPlan"), width: 200, readOnly: !isEditable },
      { type: "text", title: t("u_DateSending"), width: 150, readOnly: !isEditable },
    ],
    [t, isEditable]
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await http.get(`api/trackings`);
      const formattedData = formatData(data);
      console.log(formattedData);
      setFData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error(t("Error fetching data"));
    } finally {
      setLoading(false);
    }
  }, [t]);

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
          return { ...row, id: originalRow.id };
        }
        return null;
      })
      .filter((row) => row !== null);

    console.log("Updated Rows:", updatedRows);
    await saveUpdatedData(updatedRows);
    fetchData()
  };

  const saveUpdatedData = async (data) => {
    setSaving(true);
    const newFData = [...fdata];

    const mapRowToPatchData = (row) => {
      return {
        docNum: row[0],
        docEntry: row[1],
        cardCode: row[2],
        cardName: row[3],
        u_numberOfCntr: row[4],
        u_China_platform: row[5],
        u_numberPlatformKzx: row[6],
        u_StationOfOperationRailway: row[7],
        u_DateOfOperation:  moment(row[8], "DD.MM.YYYY").format("YYYY-MM-DD"),
        u_LineOfOperation: row[9],
        u_DestinationStation: row[10],
        u_Remaining_km: row[11],
        u_DispatchPlan:  moment(row[12], "DD.MM.YYYY").format("YYYY-MM-DD"),
        u_DateSending:  moment(row[13], "DD.MM.YYYY").format("YYYY-MM-DD"),
      };
    };

    for (const row of data) {
      const patchData = mapRowToPatchData(row);
      console.log(row);
      try {
        const response = await http.patch("api/trackings", patchData);
        console.log("Save response:", response.data);
        message.success(t("Data saved successfully ") + row[0]);
      } catch (error) {
        console.error("Error saving data:", error);
        message.error(t("Error saving data ") + row[0]);
      }
    }

    setFData([...newFData]);
    setSaving(false);
  };

  const initializeSpreadsheet = useCallback(() => {
    const tableData = fdata.map((item) => ({
      ...item,
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
        minDimensions: [columnDefinitions.length, tableData.length],
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
  }, [columnDefinitions, fdata]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    initializeSpreadsheet();
  }, [initializeSpreadsheet, isEditable, t]);

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
          <Button
            onClick={toggleEdit}
            className={`mb-4 ${isEditable ? "bg-green-500" : "bg-blue-500"} text-white hover:bg-green-700`}
            loading={saving}
          >
            {isEditable ? t("save") : t("edit")}
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
