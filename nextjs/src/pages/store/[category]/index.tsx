import type { GetStaticProps, GetStaticPaths } from 'next';
import { IndexLayout } from '@/components/layout';
import { ProductCard } from '@/components/product';
import { strapi } from '@/lib/api';

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  imageAlt: string;
  category: string;
  slug: string;
};

type Props = {
  title: string;
  products: Product[];
};

export default function Category({ title, products }: Props) {
  return (
    <section className="flex flex-col sm:container sm:gap-6 sm:py-16">
      <h1 className="hidden sm:block px-0 font-secondary text-heading-3xl">
        {title.charAt(0).toUpperCase() + title.slice(1)}
      </h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard
              title={product.title}
              price={product.price}
              discount={product.discount}
              image={product.images[0]}
              imageAlt={product.imageAlt}
              slug={`${product.category}/${product.slug}`}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

Category.PageLayout = IndexLayout;

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await strapi.getCategories();
  const paths = categories.map(({ slug }) => ({ params: { category: slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { category } = context.params as { category: string };
  const products = await strapi.getProducts(category);
  return { props: { title: category, products }, revalidate: 3600 };
};