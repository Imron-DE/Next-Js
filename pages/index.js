import dynamic from "next/dynamic";
import Beranda from "./beranda";

const Layout = dynamic(() => import("@/components/Layouts"), { ssr: false });

export default function Home() {
  return (
    <Layout metaTitle="Home" metaDescription="ini adalah halaman home">
      <Beranda />
    </Layout>
  );
}
