"use client";

import { useState, Fragment } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { Bars3Icon, MagnifyingGlassIcon, ShoppingCartIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, StarIcon } from "@heroicons/react/20/solid";
import AddToCart from "../../components/AddToCart";
import SecurePaymentSeal from "../../components/SecurePaymentSeal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DropshipProduct({ product }) {
  const [open, setOpen] = useState(false);

  // Fallbacks and destructure data from Sanity product
  const images = product.images || [];
  const colors = product.colors || [];
  const sizes = product.sizes || [];
  const description = product.description || "";
  const highlights = product.highlights || [];
  const details = product.details || "";
  const price = product.price ? `$${product.price}` : "";
  const breadcrumbs = product.breadcrumbs || [];
  const reviews = product.reviews || { average: 0, totalCount: 0, featured: [] };
  const relatedProducts = product.relatedProducts || [];

  // You can replace these with your dynamic navigation/footer if needed
  const currencies = ["CAD", "USD", "AUD", "EUR", "GBP"];
  const navigation = { categories: [], pages: [] };
  const footerNavigation = { account: [], service: [], company: [], connect: [] };

  return (
    <div className="bg-white">
      {/* ... Navigation/Header code (optional, can be in _layout.js) ... */}

      {/* Breadcrumb */}
      <main className="pt-10 sm:pt-16">
        <nav aria-label="Breadcrumb">
          <ol className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            {breadcrumbs.map((breadcrumb, idx) => (
              <li key={breadcrumb.id || idx} className="flex items-center">
                <a href={breadcrumb.href} className="mr-2 text-sm font-medium text-gray-900">
                  {breadcrumb.name}
                </a>
                {idx < breadcrumbs.length - 1 && (
                  <svg fill="currentColor" width={16} height={20} viewBox="0 0 16 20" aria-hidden="true" className="h-5 w-4 text-gray-300">
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                )}
              </li>
            ))}
            <li className="text-sm">
              <span aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                {product.name}
              </span>
            </li>
          </ol>
        </nav>

        {/* Product Images */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-8 lg:px-8">
          {images.slice(0, 4).map((img, idx) => (
            <img
              key={idx}
              alt={img.alt || product.name}
              src={img.asset?.url || img.url}
              className={classNames(
                idx === 0 ? "row-span-2 aspect-3/4 size-full rounded-lg object-cover max-lg:hidden" : "",
                idx === 1 ? "col-start-2 aspect-3/2 size-full rounded-lg object-cover max-lg:hidden" : "",
                idx === 2 ? "col-start-2 row-start-2 aspect-3/2 size-full rounded-lg object-cover max-lg:hidden" : "",
                idx === 3 ? "row-span-2 aspect-4/5 size-full object-cover sm:rounded-lg lg:aspect-3/4" : ""
              )}
            />
          ))}
        </div>

        {/* Product Info */}
        <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">{price}</p>
            {/* Reviews */}
            <div className="mt-6 flex items-center">
              {[0, 1, 2, 3, 4].map((rating) => (
                <StarIcon
                  key={rating}
                  aria-hidden="true"
                  className={classNames(reviews.average > rating ? "text-gray-900" : "text-gray-200", "size-5 shrink-0")}
                />
              ))}
              <span className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                {reviews.totalCount} reviews
              </span>
            </div>
            {/* Colors */}
            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Color</h3>
              <fieldset className="mt-4 flex items-center gap-x-3">
                {colors.map((color) => (
                  <div key={color.id || color.name} className="flex rounded-full outline -outline-offset-1 outline-black/10">
                    <input
                      defaultValue={color.id || color.name}
                      name="color"
                      type="radio"
                      aria-label={color.name}
                      className={classNames(
                        color.classes,
                        "size-8 appearance-none rounded-full forced-color-adjust-none checked:outline-2 checked:outline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-3"
                      )}
                    />
                  </div>
                ))}
              </fieldset>
            </div>
            {/* Sizes */}
            <div className="mt-10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Size guide
                </a>
              </div>
              <fieldset className="mt-4 grid grid-cols-4 gap-3">
                {sizes.map((size) => (
                  <label
                    key={size.id || size.name}
                    aria-label={size.name}
                    className="group relative flex items-center justify-center rounded-md border border-gray-300 bg-white p-3 has-checked:border-indigo-600 has-checked:bg-indigo-600 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-indigo-600 has-disabled:border-gray-400 has-disabled:bg-gray-200 has-disabled:opacity-25"
                  >
                    <input
                      defaultValue={size.id || size.name}
                      name="size"
                      type="radio"
                      disabled={!size.inStock}
                      className="absolute inset-0 appearance-none focus:outline-none disabled:cursor-not-allowed"
                    />
                    <span className="text-sm font-medium uppercase group-has-checked:text-white">{size.name}</span>
                  </label>
                ))}
              </fieldset>
            </div>
            <AddToCart 
              product={{
                id: product._id,
                title: product.title || product.name,
                price: product.price || 0,
                type: 'dropship',
                image: product.images?.[0]?.asset?.url
              }}
              className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
            />
            
            {/* Secure Payment Seal */}
            <div className="mt-4">
              <SecurePaymentSeal variant="compact" className="justify-center" />
            </div>
          </div>

          {/* Description, highlights, details */}
          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
            <div>
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6">
                <p className="text-base text-gray-900">{description}</p>
              </div>
            </div>
            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>
              <ul className="mt-4 list-disc space-y-2 pl-4 text-sm">
                {highlights.map((highlight, i) => (
                  <li key={i} className="text-gray-400">
                    <span className="text-gray-600">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
            <section aria-labelledby="shipping-heading" className="mt-10">
              <h2 id="shipping-heading" className="text-sm font-medium text-gray-900">
                Details
              </h2>
              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{details}</p>
              </div>
            </section>
          </div>

          {/* Reviews */}
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <section className="border-t border-gray-200 pt-10 lg:pt-16">
              <div className="space-y-10">
                {reviews.featured?.map((review) => (
                  <div key={review.id} className="flex flex-col sm:flex-row">
                    <div className="order-2 mt-6 sm:mt-0 sm:ml-16">
                      <h3 className="text-sm font-medium text-gray-900">{review.title}</h3>
                      <div
                        dangerouslySetInnerHTML={{ __html: review.content }}
                        className="mt-3 space-y-6 text-sm text-gray-600"
                      />
                    </div>
                    <div className="order-1 flex items-center sm:flex-col sm:items-start">
                      {review.avatarSrc && (
                        <img alt={review.author} src={review.avatarSrc} className="size-12 rounded-full" />
                      )}
                      <div className="ml-4 sm:mt-4 sm:ml-0">
                        <p className="text-sm font-medium text-gray-900">{review.author}</p>
                        <div className="mt-2 flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              aria-hidden="true"
                              className={classNames(
                                review.rating > rating ? "text-gray-900" : "text-gray-200",
                                "size-5 shrink-0"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Related products */}
        <section className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">Customers also purchased</h2>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {relatedProducts.map((rel) => (
                <div key={rel._id} className="group relative">
                  <img
                    alt={rel.name}
                    src={rel.images?.[0]?.asset?.url}
                    className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                  />
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <a href={`/products/${rel.slug?.current}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {rel.name}
                        </a>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{rel.color}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">${rel.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}