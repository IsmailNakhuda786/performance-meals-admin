import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";

import AdminPortal from "../admin/App";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const response = await admin.graphql(
    `#graphql
      query PerformanceMealsShopContext {
        shop {
          name
          myshopifyDomain
        }
        products(first: 10) {
          nodes {
            id
          }
        }
      }`,
  );
  const payload = await response.json();

  return {
    shop: payload.data?.shop ?? {
      name: session.shop,
      myshopifyDomain: session.shop,
    },
    loadedProductCount: payload.data?.products.nodes.length ?? 0,
  };
};

export default function PerformanceMealsApp() {
  const { shop, loadedProductCount } = useLoaderData<typeof loader>();

  return (
    <>
      <s-banner heading={`Connected to ${shop.name}`} tone="success">
        <s-paragraph>
          Authenticated as {shop.myshopifyDomain}. Shopify returned{" "}
          {loadedProductCount} products in the initial API check.
        </s-paragraph>
      </s-banner>
      <AdminPortal />
    </>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
