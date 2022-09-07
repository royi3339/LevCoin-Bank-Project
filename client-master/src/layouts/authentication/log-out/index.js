/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
// import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
// import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
// import MasterCard from "examples/Cards/MasterCard";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import { successPopUp, errorPopUp } from "App";



function Billing() {
  const navigate = useNavigate();
  axios(`http://localhost:2400/logout`, { withCredentials: true })
    .then(res => res.data)
    .then(res => {
      if (res.success) {
        navigate("/home");
      }
      else {
        errorPopUp(res.msg)
      }
    }
    )
  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />

      <Footer />
    </DashboardLayout>
  );
}

export default Billing;
