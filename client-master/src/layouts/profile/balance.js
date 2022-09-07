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
// import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import axios from "axios";


// Dashboard components
import { useState, useEffect } from "react";
// import { useEffect } from "react";

export default function Balance() {
    const [balance, setBalance] = useState("");
    const [amountInDollar, setAmountInDollar] = useState("");
    const [amountInILS, setAmountInILS] = useState("");
    useEffect(() => {
        axios("http://localhost:2400/user/getBalance", {
          withCredentials: true,
        })
        .then(res => res.data.msg)
        .then((res) => {
            console.log("getBalance")
            setBalance(`${res} ₿`)
        });
      }, []);
      useEffect(() => {
        axios("http://localhost:2400/user/getAmountInDollar", {
          withCredentials: true,
        })
        .then(res => res.data.msg)
        .then((res) => {
          setAmountInDollar(`${res} $`)
        });
      }, []);
      

      useEffect(() => {
        axios("http://localhost:2400/user/getAmountInILS", {
          withCredentials: true,
        })
        .then(res => res.data.msg)
        .then((res) => {
          setAmountInILS(`${res} ₪`)
        });
      }, []);

    return (
            <MDBox py={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="dark"
                                icon="money"
                                title="balance"
                                count={balance}
                                // percentage={{
                                //     color: "success",
                                //     amount: "+55%",
                                //     label: "than lask week",
                                // }}
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                icon="paid"
                                title="amountInDollar"
                                count={amountInDollar}
                                // percentage={{
                                //     color: "success",
                                //     amount: "+3%",
                                //     label: "than last month",
                                // }}
                            />
                        </MDBox>
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="primary"
                                icon="₪"
                                title="amountInILS"
                                count={amountInILS}
                                // percentage={{
                                //     color: "success",
                                //     amount: "",
                                //     label: "Just updated",
                                // }}
                            />
                        </MDBox>
                    </Grid>
                </Grid>
            </MDBox>
    );
}
