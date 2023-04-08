import Image from "next/image";
import Link from "next/link";
import { ImageContainer, ImageWrapper, SuccessContainer } from "../styles/pages/success";
import { GetServerSideProps } from "next";
import { stripe } from "../lib/stripe";
import Stripe from "stripe";
import Head from "next/head";

interface SuccessProps {
  customerName: string;
  product: {
    name: string;
    imageUrl: string;
  };
}

export default function Success({ customerName, product }: SuccessProps) {
  return (
    <>
      <Head>
        <title>Compra efetuada | Shop</title>
        <meta name="robots" content="noindex" />
      </Head>

      <SuccessContainer>
        <h1>Compra efetuada</h1>

        <ImageContainer>
          <ImageWrapper>
            <Image src={product.imageUrl} alt="" height={106} width={114} />
          </ImageWrapper>
          <ImageWrapper>
            <Image src={product.imageUrl} alt="" height={106} width={114} />
          </ImageWrapper>
          <ImageWrapper>
            <Image src={product.imageUrl} alt="" height={106} width={114} />
          </ImageWrapper>
          <ImageWrapper>
            <Image src={product.imageUrl} alt="" height={106} width={114} />
          </ImageWrapper>
          <ImageWrapper>
            <Image src={product.imageUrl} alt="" height={106} width={114} />
          </ImageWrapper>
        </ImageContainer>

        <p>
          Uhuul <strong>{customerName}</strong>, sua Camiseta{" "}
          <strong>{product.name}</strong> já está a caminho da sua casa.
        </p>
        <Link href={"/"}>Voltar ao catálogo</Link>
      </SuccessContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const sessionId = query.session_id as string;

  if (!sessionId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const sessionInfo = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "line_items.data.price.product"],
  });

  const customerName = sessionInfo.customer_details?.name;
  const product = sessionInfo.line_items?.data[0].price?.product as Stripe.Product;

  return {
    props: {
      customerName,
      product: {
        name: product.name,
        imageUrl: product.images[0],
      },
    },
  };
};
