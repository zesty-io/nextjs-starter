import { ZestyView } from "@/components/zesty/ZestyView";

export default async function Home({ params }: any) {
  let url = "";
  if (!params?.zesty) {
    url = process.env.ZESTY_PRODUCTION_DOMAIN + "/" + "?toJSON";
  } else {
    url =
      process.env.ZESTY_PRODUCTION_DOMAIN +
      "/" +
      params.zesty.join("/") +
      "?toJSON";
  }
  const data = await getData(url);
  return (
    <>
      <ZestyView content={data} />
    </>
  );
}
// This gets called on every request, its for SSR mode in next
const getData = async (url: string) => {
  try {
    // equivalent to getServerSideProps
    const data = await fetch(url, { cache: "no-store" });

    if (!data.ok) return { notFound: true };

    return data.json();
    // add your own custom logic here if needed, set your data to {data.yourData} ...

    // generate a status 404 page

    // Pass data to the page via props
  } catch (error) {
    // handle unexpected errors
    console.error(error);
    return { notFound: true };
  }
};
