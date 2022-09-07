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
import axios from "axios";
import { useState, useEffect } from "react";
import { successPopUp, errorPopUp } from "App";


import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from "@mui/material/Grid";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
// , Redirect
// @mui material components
import Card from "@mui/material/Card";


// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

function Basic() {
    const [users, setUsers] = useState([])
    const [info, setInfo] = useState("");
    const [amount, setAmount] = useState("");
    const [sendTo, setSendTo] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios(`http://localhost:2400/message/getUsersContact`, { withCredentials: true })
            .then(res => res.data.msg)
            .then((res) => {
                // console.log(res)
                setUsers(res.map(x => ({
                    label: x.username,
                    _id: x._id
                })
                ))
            });
    }, []);
    return (
        // <BasicLayout image={bgImage}>
        
    <DashboardLayout>
    <DashboardNavbar/>
    <MDBox mb={2}/>
        <Grid container spacing={0} justifyContent="center" alignItems="center">
            <Card sx={{ width: 380, height:500}}>
                <MDBox
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                    // mx={2}
                    mx={"auto"}
                    mt={-3}
                    p={2}
                    mb={1}
                    // xl={"100%"}
                    // textAlign="center"
                    // textAlign="left"
                >
                    <MDTypography variant="h4" fontWeight="medium" color="white" mt={0}>
                        send money
                    </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <MDBox component="form" role="form">
                        <MDBox mb={2}>
                            <MDInput
                                type="number"
                                label="amount"
                                onChange={(event) => setAmount(event.target.value)}
                                fullWidth
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="info"
                                // sx={{ width: 300 }}
                                onChange={(event) => setInfo(event.target.value)}
                                fullWidth
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={users}
                                onChange={(event, newValue) => {
                                    setSendTo(newValue._id);
                                }}
                                // sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="User to send" />}
                            />
                        </MDBox>

                        <MDBox mt={23} mb={1}>
                            <MDButton
                                variant="gradient"
                                color="info"
                                // fullWidth
                                onClick={() => {
                                    // console.log(amount, sendTo);
                                    axios.post(
                                        `http://localhost:2400/user/makeTransactions`,
                                        {
                                            amount,
                                            _id: sendTo,
                                            info
                                        },
                                        { withCredentials: true }
                                    )
                                    .then(res => res.data)
                                    .then((data) => {
                                      if (data.success) {
                                        successPopUp("make transaction")
                                        navigate("/home");
                                      }
                                      else {
                                        errorPopUp(data.msg)
                                      }
                                    })
                                }
                                }
                            >
                                send
                            </MDButton>
                        </MDBox>

                    </MDBox>
                </MDBox>
            </Card>
            
        {/* </BasicLayout > */}
        </Grid>
        <Grid pt={13}/>
      <Footer/>
    </DashboardLayout>
    );
}

export default Basic;
