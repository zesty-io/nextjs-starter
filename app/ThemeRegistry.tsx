"use client";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./layout";

export default function RootStyleRegistry({ children }: any) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: "css" });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: any[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({ name: serialized.name, global: !args[0] });
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;

    const nonGlobalNames = [];
    const globalStyles = [];
    let styles = "";
    for (const { name, global } of names) {
      if (global) {
        globalStyles.push({ name, css: cache.inserted[name] });
      } else {
        nonGlobalNames.push(name);
        styles += cache.inserted[name];
      }
    }
    return [
      ...globalStyles.map((style, i) => (
        <style
          key={style.name}
          data-emotion={`${cache.key}-global`}
          dangerouslySetInnerHTML={{
            // @ts-ignore
            __html: style.css,
          }}
        />
      )),
      <style
        key="css"
        data-emotion={`${cache.key} ${nonGlobalNames.join(" ")}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />,
    ];
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
