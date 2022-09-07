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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

import axios from "axios";

import { successPopUp, errorPopUp } from "App";
import { useNavigate } from "react-router-dom";

import MDAvatar from "components/MDAvatar";

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

import MDButton from "components/MDButton";
import EditUser from "./editUser";
// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

import { useState } from "react";


function User(props) {
  const [amount, setAmount] = useState(0);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const navigate = useNavigate();
  // console.log("user props ", props)
  const secondbutton = props.isConfirmed ?
    <MDButton variant="text" color={darkMode ? "white" : "dark"} onClick={() => {
      navigate('/edit-user', {
        state: {
          email: props.email,
          firstName: props.firstName,
          id: props.id,
          image: props.image,
          lastName: props.lastName,
          username: props.username,
        }
      })
    }
    } >
      <Icon>edit</Icon>&nbsp;edit
    </MDButton>
    :
    <MDBox mb={2}>
      <MDInput
        type="number"
        label="amount"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        fullWidth
      />
    </MDBox>

    ;

  const thirdbutton = props.isConfirmed ?
    <MDButton variant="text" color={darkMode ? "white" : "dark"} onClick={() => {
      props.setChatWithId(props.id)
      props.setChatWithImage(props.image)
    }
    } >
      <Icon>message</Icon>&nbsp;chat
    </MDButton>
    :
    <MDButton variant="text" color={darkMode ? "white" : "dark"} onClick={() => {
      axios.post(`http://localhost:2400/admin/confirmUser`, { _id: props.id, amount }, { withCredentials: true })
        .then(res => res.data)
        .then(res => {
          if (res.success) {
            props.onChange(props.id + "confirm")

            successPopUp("confirm user")
          }
          else {
            // alert(res.msg)
            errorPopUp(res.msg)
          }
        }
        )

    }
    } >
      <Icon>edit</Icon>&nbsp;confirm
    </MDButton>;

  return (
    <MDBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      bgColor={darkMode ? "transparent" : "grey-100"}
      borderRadius="lg"
      p={3}
      // mb={noGutter ? 0 : 1}
      mt={2}
    >
      <MDBox width="100%" display="flex" flexDirection="column">

        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
          mb={2}
        >
          <MDAvatar src={props.image} size="sm" />

          <MDTypography variant="button" fontWeight="medium" textTransform="capitalize">
            {props.username}
          </MDTypography>

          <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
            <MDBox mr={1}>
              <MDButton variant="text" color="error" onClick={() => {
                axios.post(`http://localhost:2400/admin/deleteUser`, { _id: props.id }, { withCredentials: true })

                .then(res => res.data)
                .then(res => {
                  if (res.success) {
                    props.onChange(props.id + "confirm")                    
                    props.onChange(props.id + "delete")
                    successPopUp("delete user")
                  }
                  else {
                    // alert(res.msg)
                    errorPopUp(res.msg)
                  }
                }
                )

              }}
              >
                <Icon>delete</Icon>&nbsp;delete
              </MDButton>
            </MDBox>

            {secondbutton}
            {thirdbutton}

          </MDBox>

        </MDBox>
        <MDBox mb={1} lineHeight={0}>


          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              id :&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {props.id}
              </MDTypography>
            </MDTypography>
          </MDBox>

        </MDBox>
        <MDBox mb={1} lineHeight={0}>
          <MDTypography variant="caption" color="text">
            Email Address:&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" fontWeight="medium">
              {props.email}
            </MDTypography>
          </MDTypography>
        </MDBox>

        <MDBox mb={1} lineHeight={0}>
          <MDTypography variant="caption" color="text">
            First name :&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" fontWeight="medium">
              {props.firstName}
            </MDTypography>
          </MDTypography>
        </MDBox>

        <MDBox mb={1} lineHeight={0}>
          <MDTypography variant="caption" color="text">
            Last name :&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" fontWeight="medium">
              {props.lastName}
            </MDTypography>
          </MDTypography>
        </MDBox>


      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of User
User.defaultProps = {
  noGutter: false,
};

// Typechecking props for the User
User.propTypes = {
  name: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  vat: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
};

export default User;
