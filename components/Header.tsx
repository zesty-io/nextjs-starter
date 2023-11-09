"use client";

import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import Image from "next/image";

function Header() {
  return (
    <AppBar color="inherit" position="sticky">
      <Container>
        <Toolbar disableGutters>
          <Box
            component="a"
            href="/"
            display="flex"
            gap={1}
            sx={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Image
              src="https://brand.zesty.io/zesty-io-logo-dark.svg"
              width="32"
              height="32"
              alt="zesty logo"
            />
            <Typography variant="h6">Zesty</Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
