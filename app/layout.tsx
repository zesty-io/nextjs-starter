import { Roboto, Mulish as mulish } from "next/font/google";
import "./globals.css";
import { Container, createTheme } from "@mui/material";
import ThemeRegistry from "./ThemeRegistry";
import Header from "@/components/Header";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  style: ["normal"],
  subsets: ["latin"],
});

export const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeRegistry options={{ key: "mui" }}>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
