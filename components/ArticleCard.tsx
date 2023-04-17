import { Article, ContentItem } from '@/types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import Link from 'next/link';

type ArticleCardProps = {
  article: ContentItem<Article>;
};

export const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <Link href={article.meta.web.uri} style={{ textDecoration: 'none' }}>
      <Card
        variant="outlined"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: 0,
          background: 'transparent',
        }}
      >
        <CardMedia
          component="img"
          image={article.image}
          sx={{
            minHeight: '193px',
            maxHeight: '484px',
            flex: 1,
            borderRadius: '4px',
            boxShadow: 2,
          }}
        />
        <CardContent
          sx={{
            minHeight: '180px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography noWrap variant="h6">
              {article.title}
            </Typography>
            <Typography color="textSecondary">{article.subtitle}</Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Avatar src={article.author.data[0].image.data[0].url} />
            <Box>
              <Typography variant="subtitle2">
                {article.author.data[0].name}
              </Typography>
              <Typography variant="caption">
                {new Date(article.date).toDateString()}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};
