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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
// import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import axios from "axios";

// Data
// import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
// import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { useState, useEffect } from "react";

async function getDateFunc()
{
  return new Date();
}

function Dashboard() {
  const [usersAmount, setUsersAmount] = useState("");
  const [yearChart, setYearChart] = useState({});
  const [currentDate, setCurrentDate] = useState([]);
  const [monthChart, setMonthChart] = useState({});
  const [weekChart, setWeekChart] = useState({});
  useEffect(() => {
    axios("http://localhost:2400/user/getTransactionsOfLastYear", {
      withCredentials: true,
    })
      .then(res => res.data.msg)
      .then((res) => {
        setYearChart(res)
      });
  }, []);
  useEffect(() => {
    axios("http://localhost:2400/user/getUsersAmount", {
      withCredentials: true,
    })
      .then(res => res.data.msg)
      .then((res) => {
        setUsersAmount(res)
      });
  }, []);
  useEffect(() => {
    axios("http://localhost:2400/user/getTransactionsOfLastMonth", {
      withCredentials: true,
    })
      .then(res => res.data.msg)
      .then((res) => {
        setMonthChart(res)
      });
  }, []);
  useEffect(() => {
    axios("http://localhost:2400/user/getTransactionsOfLastWeek", {
      withCredentials: true,
    })
      .then(res => res.data.msg)
      .then((res) => {
        setWeekChart(res)
      });
  }, []);
  useEffect(() => {
    getDateFunc()
      .then((res) => {
        setCurrentDate(currentDate.concat(new Date().toString().split(" ").slice(1, 5).toString().replaceAll(",", " - ")))
      });
  }, []);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="last period"
                  description="Last 12 monthly profit"
                  // date="just update"
                  date={currentDate}
                  chart={yearChart}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="success"
                  title="last month"
                  description="your last month daily profit"
                  // date="just update"
                  date={currentDate}
                  chart={monthChart}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="dark"
                  title="last week"
                  description="your last week daily profit"
                  // date="just updated"
                  date={currentDate}
                  chart={weekChart}
                />
              </MDBox>
            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="success"
                  icon="group"
                  title="usersAmount"
                  count={usersAmount}
                // percentage={{
                //     color: "success",
                //     amount: "+1%",
                //     label: "than yesterday",
                // }}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
