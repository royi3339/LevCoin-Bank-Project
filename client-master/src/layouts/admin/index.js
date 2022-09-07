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
// import Divider from "@mui/material/Divider";

// // @mui icons
// import FacebookIcon from "@mui/icons-material/Facebook";
// import TwitterIcon from "@mui/icons-material/Twitter";
// import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
// import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
// import ProfilesList from "examples/Lists/ProfilesList";
// import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/profile/components/Header";
// import PlatformSettings from "layouts/profile/components/PlatformSettings";

import axios from "axios";
import { useState, useEffect } from "react";


// Data
// import profilesListData from "layouts/profile/data/profilesListData";

// Images
// import homeDecor1 from "assets/images/home-decor-1.jpg";
// import homeDecor2 from "assets/images/home-decor-2.jpg";
// import homeDecor3 from "assets/images/home-decor-3.jpg";
// import homeDecor4 from "assets/images/home-decor-4.jpeg";
// import team1 from "assets/images/team-1.jpg";
// import team2 from "assets/images/team-2.jpg";
// import team3 from "assets/images/team-3.jpg";
// import team4 from "assets/images/team-4.jpg";
import UsersList from "./userslist"
import Card from "@mui/material/Card";
import Chat from "layouts/chat/chat"


function Overview() {

    const [pendingUsers, setPendingUsers] = useState([])
    const [activeUsers, setActiveUsers] = useState([])
    const [chatWithId, setChatWithId] = useState("")
    const [chatWithImage, setChatWithImage] = useState()
    const [lastupdate, setlastupdate] = useState(false)


    useEffect(() => {
        axios(`http://localhost:2400/admin/getPendingUsers`, { withCredentials: true })
            .then(res => res.data.msg)
            .then((res) => {
                setPendingUsers(res)
            });
    }, [lastupdate]);

    useEffect(() => {
        axios(`http://localhost:2400/message/getUsersContact`, { withCredentials: true })
            .then(res => res.data.msg)
            .then((res) => {
                setActiveUsers(res)
            });
    }, [lastupdate]);
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mb={2} />
            <Header>
                <MDBox mt={5} mb={3}>
                    <Grid container spacing={3}>
                        {/* <Grid item xs={12} xl={4}> */}
                        <Grid item xs={6} xl={"100%"}>
                            <UsersList name='pending users' onChange={setlastupdate} lst={pendingUsers}></UsersList>
                        </Grid>
                        {/* <Grid item xs={12} xl={4} > */}
                        <Grid item xs={6} xl={"100%"} >
                            {/* sx={{ weight: "10%" }} */}
                            <UsersList name='active users' onChange={setlastupdate} lst={activeUsers} setChatWithId={setChatWithId} setChatWithImage={setChatWithImage}></UsersList>
                        </Grid>
                    </Grid>
                </MDBox>
                <Grid item xs={12}>
                    {/* {relevantChat} */}
                    <Card>
                        <MDBox
                            mx={2}
                            mt={3}
                            py={3}
                            px={2}
                        >
                            <Chat userId={chatWithId} userImage={chatWithImage} isAdmin={true} />
                        </MDBox>
                    </Card>
                </Grid>

            </Header>
            <Footer />
        </DashboardLayout>
    );
}

export default Overview;
