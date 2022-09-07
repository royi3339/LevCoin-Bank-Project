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

// react-router-dom components
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { successPopUp, errorPopUp } from "App";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";
// import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import store from "store";

function Cover() {
    const navigate = useNavigate();
    const props = useLocation().state;
    // console.log("edit user", props)
    const [username, setusername] = useState(props.username);
    const [email, setemail] = useState(props.email);
    const [firstName, setfirstName] = useState(props.firstName);
    const [lastName, setlastName] = useState(props.lastName);
    const [image, setImage] = useState(props.image);

    return (
        <DashboardLayout>
        <DashboardNavbar/>
        <MDBox mb={2}/>
        <Grid container spacing={0} justifyContent="center" alignItems="center">
            <Card sx={{ width: 380, height:550}}>
                <MDBox
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="success"
                    // mx={2}
                    mx={"auto"}
                    mt={-3}
                    p={3}
                    mb={1}
                    // textAlign="center"
                >
                <MDTypography variant="h6" fontWeight="medium" color="white" mt={0}>
                    edit profile
                </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <MDBox component="form" role="form">
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="Username"
                                value={username}
                                onChange={(event) => setusername(event.target.value)}
                                fullWidth
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="FirstName"
                                value={firstName}
                                onChange={(event) => setfirstName(event.target.value)}
                                fullWidth
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="LastName"
                                value={lastName}
                                onChange={(event) => setlastName(event.target.value)}
                                fullWidth
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="email"
                                label="Email"
                                value={email}
                                onChange={(event) => setemail(event.target.value)}
                                fullWidth
                            />
                        </MDBox>

                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="image"
                                value={image}
                                onChange={(event) => setImage(event.target.value)}
                                fullWidth
                            />
                        </MDBox>
                        <MDBox mt={15} mb={1}>
                            <MDButton
                                variant="gradient"
                                color="info"
                                // fullWidth
                                onClick={() => {
                                    const details={
                                        username,
                                        email,
                                        firstName,
                                        lastName
                                    }
                                    axios.post(///post patch
                                        `http://localhost:2400/user/updateDetails`,
                                        details,
                                        { withCredentials: true }
                                    )
                                        .then(res => res.data)
                                        .then((data) => {
                                          if (data.success) {
                                            successPopUp("update details")
                                            store.dispatch({type:"edit profile",details})
                                            navigate("/profile")
                                          }
                                          else {
                                            errorPopUp(data.msg)
                                          }
                                        })
                                }
                                }
                            >
                                change
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
            </Grid>
            <Grid pt={13}/>
      <Footer />
    </DashboardLayout>
    );
}

export default Cover;
