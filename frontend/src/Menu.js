import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <AppBar
      position="fixed"
      style={{ backgroundColor: "#1976d2", width: "100%", top: 0 }}
    >
      <Container maxWidth="md">
        <Toolbar style={{ justifyContent: "space-between", padding: 0 }}>
          <Box display="flex" alignItems="center">
            {/* ロゴ画像をpublicフォルダから参照 */}
            <img
              src="/images/logo.png"
              alt="CardCheckr Logo"
              style={{ width: "40px", height: "40px", marginRight: "10px" }}
            />
            {/* タイトル */}
            <Typography
              variant="h6"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              CardCheckr
            </Typography>
          </Box>
          <div>
            <Button
              color="inherit"
              component={Link}
              to="/id"
              style={{
                textTransform: "none",
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              ID
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/card"
              style={{
                textTransform: "none",
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              Card
            </Button>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Menu;
