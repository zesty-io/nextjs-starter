import { Grid } from "@mui/material";
import { ArticleCard } from "@/components/ArticleCard";
import { Article, ContentItem } from "@/types";

export default function Homepage({ content }: { content: ContentItem }) {
  const articles = content.articles.data as ContentItem<Article>[];

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <ArticleCard article={articles[0]} />
      </Grid>
      {articles.slice(1).map((article, index: number) => (
        <Grid key={index} item xs={12} sm={6} md={4}>
          <ArticleCard article={article} />
        </Grid>
      ))}
    </Grid>
  );
}
