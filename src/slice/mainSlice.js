import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: '',
  role: '',
  employeeId:'',
  salesPersonCode:'',
  fromWarehouseCode: "",
  baseEntry: "",
  collapse: false,
    selectedPath: 'purchaseRequest',
    openMiniMenu: ['procurementMenu'],
  language: "ru"
};

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },

    setToken(state,action){
      state.token = action.payload
    },
    setFromWarehouseCode(state,action){
      state.fromWarehouseCode  = action.payload
    },
    setCollapse: (state, action) => {
      state.collapse = action.payload;
    },
    setSelectedPath: (state, action) => {
      state.selectedPath = action.payload;
    },
    setOpenMiniMenu: (state, action) => {
      state.openMiniMenu = action.payload;
    },

    setEmployeeId(state,action){
      state.employeeId = action.payload
    },
    setSalesPersonCode(state,action){
      state.salesPersonCode = action.payload
    },
    setBaseEntry(state,action){
      state.baseEntry = action.payload
    },
     setRole(state,action){
      state.role = action.payload
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null
      state.role = null
      state.employeId = null
      state.warehouses = []
     },
     setWarehouses(state,action){
      state.warehouses = action.payload
     },
    setLanguage(state,action){
      state.language = action.payload
    }
  },
});

export const { login, logout,setWarehouses,setSelectedPath,setBaseEntry,setFromWarehouseCode,setCollapse,setOpenMiniMenu,setLanguage,setToken,setEmployeeId,setRole,setSalesPersonCode } = mainSlice.actions;
export default mainSlice.reducer