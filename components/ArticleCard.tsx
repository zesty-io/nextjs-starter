import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';

type ArticleCardProps = {};

export const ArticleCard = ({ title, subtitle, image, date, author }: any) => {
  return (
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
        image={image}
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
          minHeight: '208px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography>{subtitle}</Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Avatar src={author.data[0].image.data[0].url} />
          <Box>
            <Typography variant="subtitle2">{author.data[0].name}</Typography>
            <Typography variant="caption">
              {new Date(date).toDateString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
