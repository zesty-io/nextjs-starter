import { Grid } from '@mui/material';
import { ArticleCard } from '@/components/ArticleCard';

export default function Homepage({ content }) {
  const articles = content.articles.data;

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <ArticleCard {...articles[0]} />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <ArticleCard {...articles[1]} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <ArticleCard {...articles[2]} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <ArticleCard {...articles[3]} />
      </Grid>
    </Grid>
  );
}
