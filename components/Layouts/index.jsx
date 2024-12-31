import Footer from "@/components/Footer/index";
import Header from "@/components/Header/index";
import Head from "next/head";
import { Container } from "@chakra-ui/react"; // Import Chakra UI Container

export default function Layout({
  children,
  metaTitle = "Default Title", // Default title directly in the function signature
  metaDescription = "", // Default description directly in the function signature
}) {
  return (
    <>
      <Head>
        <title>{metaTitle}</title> {/* Display the metaTitle */}
        <meta name="description" content={metaDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Container maxW="container." centerContent mt={20} mb={5}>
        {" "}
        {/* Default max width for container */}
        {children}
      </Container>
      <Footer />
    </>
  );
}
