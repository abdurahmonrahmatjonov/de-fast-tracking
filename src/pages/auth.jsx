import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  login,
  setToken,
  setEmployeeId,
  setRole,
  setSalesPersonCode, setSelectedPath
} from "../slice/mainSlice";
import { Form, Input, Typography, Button, message, Spin } from "antd";
import { session } from "../services/session";
import { http } from "../services/http";
import { useTranslation } from "react-i18next";

const Auth = () => {
  const { t } = useTranslation();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isMeLoading, setMeLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data } = await http.get("api/auth/me");
      if (data) {
        const {
          accessToken: token,
          firstName,
          lastName,
          jobTitle: role,
          employeeId,
          salesPersonCode,
        } = data;
        const user = `${firstName} ${lastName}`;
        dispatch(login(user));
        dispatch(setToken(token));
        dispatch(setRole(role));
        dispatch(setEmployeeId(employeeId));
        dispatch(setSalesPersonCode(salesPersonCode));
        const prevLocation = sessionStorage.getItem("prevLocation");
        navigate(prevLocation || "/tracking-list");
        const extractedData = prevLocation.slice(1);
        console.log(extractedData);
        dispatch(setSelectedPath(extractedData || "tracking-list"))
      }
    } catch (err) {
      console.log(err);
    } finally {
      setMeLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    const { email, password } = values;
    setLoading(true);
    try {
      const { data } = await http.get(
        `api/auth?EmployeeCode=${email}&ExternalEmployeeNumber=${password}`,
      );
      const {
        accessToken: token,
        firstName,
        lastName,
        jobTitle: role,
        employeeId,
        salesPersonCode,
      } = data;
      const user = `${firstName} ${lastName}`;

      if (role === "Whsmanager") {
        session.set(token);
        dispatch(login(user));
        dispatch(setToken(token));
        dispatch(setRole(role));
        dispatch(setEmployeeId(employeeId));
        dispatch(setSalesPersonCode(salesPersonCode));

        message.success(t("successMessage", { user }));
        navigate("/tracking-list");
        dispatch(setSelectedPath("/tracking-list"))

      } else {
        message.error(t("accessDenied"));
      }
    } catch (err) {
      message.error(t("userNotFound"));
    } finally {
      setLoading(false);
    }
  };

  if (isMeLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex w-[400px] items-center justify-center rounded-3xl bg-gradient-to-br from-[#05BFDB] to-[#0A4D68]">
        <Form
          onFinish={handleSubmit}
          className="flex flex-col items-center gap-10"
        >
          <Typography className="font-montserrat mt-14 text-3xl font-bold text-white">
            {t("Authorization")}
          </Typography>
          <Form.Item
            name="email"
            rules={[{ required: true, message: t("emailRequired") }]}
          >
            <div className="flex flex-col gap-4">
              <h3 className="font-montserrat text-base font-bold text-white">
                {t("Login")}
              </h3>
              <Input
                ref={emailRef}
                type="text"
                autoFocus
                className="h-[50px] w-[280px] rounded-xl pl-5"
              />
            </div>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: t("passwordRequired") }]}
          >
            <div className="flex flex-col gap-4">
              <h3 className="font-montserrat text-base font-bold text-white">
                {t("Password")}
              </h3>
              <Input.Password
                ref={passwordRef}
                required
                className="h-[50px] w-[280px] rounded-xl pl-5"
              />
            </div>
          </Form.Item>
          <div className="mb-10">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="font-montserrat h-[50px] w-[280px] rounded-2xl bg-white text-base font-bold text-[#0A4D68]"
            >
              {t("SignIn")}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Auth;
