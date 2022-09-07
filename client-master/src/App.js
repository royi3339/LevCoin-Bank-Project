import { useState, useEffect } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";

// Material Dashboard 2 React routes
import { userRoutes, adminRoutes, logedOffRoutes, links } from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

import axios from "axios";

import store from "store"

// import socketIOClient from "socket.io-client";
// export const socket = socketIOClient('localhost:2400');

import Grid from "@mui/material/Grid";
import MDButton from "components/MDButton";

import MDSnackbar from "components/MDSnackbar";


import socketIOClient from "socket.io-client";
export const socket = socketIOClient('localhost:2400');


export function errorPopUp(text){
  socket.emit('error', { dst: store.getState().user._id, text:text} )
}

export function successPopUp(text){
  socket.emit('success', { dst: store.getState().user._id, text:"The "+text+" operation was successful"})
}

export function forMe(dst) {
  const user = store.getState().user
  console.log(user)
  console.log(dst)
  console.log(user.isAdmin)
  if (dst == "admin" && user.isAdmin) return true;
  if (dst == user._id) return true;
  return false;
}

export default function App() {

  const [successSB, setSuccessSB] = useState(false);
  const [infoSB, setInfoSB] = useState(false);
  const [warningSB, setWarningSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [loanSB, setLoanSB] = useState(false);
  const [transactionSB, setTransactionSB] = useState(false);

  const openSuccessSB = (message) => {
    setSuccessSB(true);
    setLastPong(message)
  }
  const closeSuccessSB = () => setSuccessSB(false);
  const openInfoSB = (message) => {
    setInfoSB(true);
    setLastPong(message)
  }
  const closeInfoSB = () => setInfoSB(false);
  const openWarningSB = (message) => {
    setWarningSB(true);
    setLastPong(message)
  }
  const closeWarningSB = () => setWarningSB(false);

  const openErrorSB = (message) => {
    setErrorSB(true);
    setLastPong(message)
  }
  const closeErrorSB = () => setErrorSB(false);

  const openLoanSB = (message) => {
    setLoanSB(true);
    setLastPong(message)
  }
  const closeLoanSB = () => setLoanSB(false);

  const openTransactionSB = (message) => {
    setTransactionSB(true);
    setLastPong(message)
  }
  const closeTransactionSB = () => setTransactionSB(false);

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);

  function saveAlert(message,title,color){
    message.title = title
    message.color = color
    store.dispatch({ type: "alert", alert: message })
  }

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });


    socket.on('message', (message) => {
      console.log('message',message)
      if (forMe(message.dst)) {
        openInfoSB(message)
        saveAlert(message,'chat message','info')
      }
    })

    socket.on('balance', (message) => {
      console.log('balance',message)

      if (forMe(message.dst)) {
        openWarningSB(message)
        saveAlert(message,'balance message','warning')
      }
    })

    socket.on('success', (message) => {
      if (forMe(message.dst)) {
        openSuccessSB(message)
        saveAlert(message,"success",'success')
      }
    })

    socket.on('error', (message) => {
      if (forMe(message.dst)) {
        openErrorSB(message)
        saveAlert(message,"error",'error')
      }
    })
    socket.on('loan', (message) => {
      console.log("loan",message)
      if (forMe(message.dst)) {
        openLoanSB(message)
        saveAlert(message,"loan",'secondery')
      }
    })
    socket.on('transaction', (message) => {
      console.log("transaction",message)
      if (forMe(message.dst)) {
        openTransactionSB(message)
        saveAlert(message,"transaction",'primary')
      }
    })

    // return () => {
    //   socket.off('connect');
    //   socket.off('disconnect');
    //   socket.off('balance');
    //   socket.off('message');
    //   socket.off('success');
    //   socket.off('error');
    // };
  }, []);


  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  const [user, setUser] = useState()
  useEffect(() => {
    const getUser = async () => {
      await axios(`http://localhost:2400/user/details`, { withCredentials: true })
        .then(res => res.data.msg)
        .then((res) => {
          setUser(res)
          store.dispatch({ type: "change user", user: res })
        })
        .catch(error => {
          setUser(undefined)
        }
        )
    };
    getUser();

    const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
      getUser();

    }, 1000)

    return () => clearInterval(intervalId); //This is important
  }, []);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="success"
      content={lastPong ? lastPong.text : ""}
      dateTime={lastPong ? (lastPong.date ? lastPong.date.split(" ").slice(1, 5).toString().replaceAll(",", "-"):"now") : "now"}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
    />
  );

  const renderInfoSB = (
    <MDSnackbar
      icon="notifications"
      title="new message"
      content={lastPong ? lastPong.text : ""}
      dateTime={lastPong ? (lastPong.date ? lastPong.date.split(" ").slice(1, 5).toString().replaceAll(",", "-"):"now") : "now"}
      open={infoSB}
      onClose={closeInfoSB}
      close={closeInfoSB}
    />
  );


  const renderWarningSB = (
    <MDSnackbar
      color="warning"
      icon="star"
      title="warning"
      content={lastPong ? lastPong.text : ""}
      dateTime={lastPong ? (lastPong.date ? lastPong.date.split(" ").slice(1, 5).toString().replaceAll(",", "-"):"now") : "now"}
      open={warningSB}
      onClose={closeWarningSB}
      close={closeWarningSB}
    />
  );

  const renderErrorSB = (

    
    <MDSnackbar
      color="error"
      icon="warning"
      title="error"
      content={lastPong ? lastPong.text : ""}
      dateTime={lastPong ? (lastPong.date ? lastPong.date.split(" ").slice(1, 5).toString().replaceAll(",", "-"):"now") : "now"}
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
    />
  );
  const renderLoanSB = (

    
    <MDSnackbar
      color="secondary"
      icon="send"
      title="Loan update"
      content={lastPong ? lastPong.text : ""}
      dateTime={lastPong ? (lastPong.date ? lastPong.date.split(" ").slice(1, 5).toString().replaceAll(",", "-"):"now") : "now"}
      open={loanSB}
      onClose={closeLoanSB}
      close={closeLoanSB}
    />
  );
  const renderTransactionSB = (

    
    <MDSnackbar
      color="primary"
      icon="warning"
      title="transaction update"
      content={lastPong ? lastPong.text : ""}
      dateTime={lastPong ? (lastPong.date ? lastPong.date.split(" ").slice(1, 5).toString().replaceAll(",", "-"):"now") : "now"}
      open={transactionSB}
      onClose={closeTransactionSB}
      close={closeTransactionSB}
    />
  );
  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (true || (miniSidenav && !onMouseEnter)) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };
  function temp() {
    if (user) {
      if (user.isAdmin) {
        return adminRoutes
      }
      return userRoutes
    }
    return logedOffRoutes

  }
  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="best cryptoBank"
            routes={temp()}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>

        {getRoutes(temp())}
        {getRoutes(links)}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>

      <MDBox p={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={3}>

            {renderSuccessSB}
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>

            {renderInfoSB}
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>

            {renderWarningSB}
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>

            {renderErrorSB}
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>

            {renderLoanSB}
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>

            {renderTransactionSB}
          </Grid>
        </Grid>
      </MDBox>

    </ThemeProvider>



  );
}
