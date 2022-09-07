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
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import Card from "@mui/material/Card";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

// Overview page components
import Header from "layouts/profile/components/Header";

import { useState, useEffect } from "react";

import Balance from "./balance";

import store from "store";


function Overview() {
  const [details, setdetails] = useState({})
  useEffect(() => {
    var user = store.getState().user
    delete user.isAdmin
    delete user.isConfirmed
    setdetails(user)
  }, []);


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={-1} />
      <Header>


      <MDBox mb={2}>
      <Grid justifyContent="center" alignItems="center">
        <Card>
        <MDBox mt={5} mb={3} >
          <Grid container spacing={0}>
            <Grid item xs={12} md={6} xl={20} sx={{ display: "block" }}>
              {/* <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} alignItems="center"  /> */}
              {/* <Divider orientation="horizontal" sx={{ ml: 30, mr: 25 }}  alignItems="center" /> */}

              <ProfileInfoCard

                title={details.username}
                description=""
                info=
                {details}
                social={[
                ]}
                shadow={true}
              />
              {/* <Divider orientation="vertical" sx={{ mx: 0 }} /> */}
              {/* <Divider orientation="horizontal" sx={{ mx: 10 }} /> */}
            </Grid>
          </Grid>

        </MDBox>
          <Balance/>
        </Card>
        </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
