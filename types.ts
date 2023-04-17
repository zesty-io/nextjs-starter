export type Article = {
  title: string;
  subtitle: string;
  image: string;
  date: string;
  content: string;
  author: {
    data: {
      name: string;
      image: {
        data: {
          url: string;
        }[];
      };
    }[];
  };
};

export type Locale = {
  id: string;
  name: string;
  code: string;
  default: string;
  active: string;
  enabled: string;
};

export type Model = {
  type: string;
  zuid: string;
  name: string;
  label: string;
  resourceURI: string;
};

export type Web = {
  url: string;
  uri: string;
  fragment: string;
  canonical_tag_mode: string;
  sitemap_priority: string;
  sitemap_last_updated: string;
  canonical_query_param_whitelist: null;
  canonical_tag_custom_value: null;
  seo_link_text: string;
  seo_meta_title: string;
  seo_meta_description: string;
  seo_meta_keywords: string;
};

export type LayoutChild = {
  icon?: string;
  name: string;
  type: string;
  html: string;
  description?: string;
  draggable?: boolean;
  model?: string;
  position: number;
  fullName: string;
  primarytype: string;
  uid?: string;
  preview?: string;
  classes?: string;
  droppable?: boolean;
};

interface LayoutJson {
  [key: string]: {
    name: string;
    html: string;
    children: LayoutChild[];
  };
}
// TODO: Remove is layout is not important to this starter
export type Layout = {
  html: string;
  json: LayoutJson;
};

export type Meta = {
  type: string;
  model_name: string;
  model_alternate_name: string;
  zuid: string;
  createdAt: string;
  updatedAt: string;
  listed: string;
  version: string;
  locale: Locale;
  model: Model;
  web: Web;
  layout?: Layout;
};

export type NavigationTreeItem = {
  url: string;
  title: string;
  zuid: string;
};

export type ContentItem<T extends Record<string, any> = Record<string, any>> = {
  // Any fields in the content model, using the generic type parameter T
  [K in keyof T]: T[K];
} & {
  // Meta data about the content item
  meta: Meta;
  zestyProductionMode: boolean;
  // The ZUID of the current instance
  zestyInstanceZUID: string;
  zestyBaseURL: string;
  // The navigation tree for the current instance
  zestyNavigationTree: NavigationTreeItem[];
};
