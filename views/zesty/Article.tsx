/**
 * Zesty.io Content Model Component
 * When the ZestyLoader [..slug].js file is used, this component will autoload if it associated with the URL
 *
 * Label: Articles
 * Name: articles
 * Model ZUID: 6-e2adb4ddba-1nx4mq
 * File Created On: Wed Apr 12 2023 13:30:36 GMT-0700 (Pacific Daylight Time)
 *
 * Model Fields:
 *
 * title (text)
 * content (wysiwyg_basic)
 * targeted_personas (one_to_many)
 * image (images)
 *
 * In the render function, text fields can be accessed like {content.field_name}, relationships are arrays,
 * images are objects {content.image_name.data[0].url}
 *
 * This file is expected to be customized; because of that, it is not overwritten by the integration script.
 * Model and field changes in Zesty.io will not be reflected in this comment.
 *
 * View and Edit this model's current schema on Zesty.io at https://8-9abda8c5c9-h98j1p.manager.zesty.io/schema/6-e2adb4ddba-1nx4mq
 *
 * Data Output Example: https://zesty.org/services/web-engine/introduction-to-parsley/parsley-index#tojson
 * Images API: https://zesty.org/services/media-storage-micro-dam/on-the-fly-media-optimization-and-dynamic-image-manipulation
 */

import { Article as ArticleType, ContentItem } from "@/types";
import { Avatar, Box, IconButton, Paper, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Image from "next/image";
import React from "react";
import Link from "next/link";

function Article({ content }: { content: ContentItem<ArticleType> }) {
  return (
    <>
      <Box height={450} sx={{ position: "relative" }}>
        <Image
          src={content.image}
          fill
          alt="Article hero image"
          style={{ borderRadius: "6px", objectFit: "contain" }}
        />
      </Box>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mx: "auto",
          maxWidth: "800px",
          position: "relative",
          top: "-80px",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {content.title}
            </Typography>
            <Typography color="textSecondary">{content.subtitle}</Typography>
          </Box>
          <Link
            href={`https://${content.zestyInstanceZUID}.manager.zesty.io/content/${content.meta.model.zuid}/${content.meta.zuid}`}
            target="_blank"
          >
            <IconButton>
              <EditIcon />
            </IconButton>
          </Link>
        </Box>
        <Box display="flex" gap={1} mt={3}>
          <Avatar src={content.author.data[0].image.data[0].url} />
          <Box>
            <Typography variant="subtitle2">
              {content.author.data[0].name}
            </Typography>
            <Typography variant="caption">
              {new Date(content.date).toDateString()}
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Box dangerouslySetInnerHTML={{ __html: content.content }} />
    </>
  );
}

export default Article;
