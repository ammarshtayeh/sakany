import { Listing } from "@/data/mockData";

export function generateListingSchema(listing: Listing) {
  const averageRating = listing.reviews?.length
    ? listing.reviews.reduce((acc, r) => acc + r.rating, 0) /
      listing.reviews.length
    : 0;

  return {
    "@context": "https://schema.org",
    "@type": "Apartment",
    name: listing.title,
    description: listing.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "نابلس",
      addressRegion: "فلسطين",
      streetAddress: listing.location,
    },
    geo:
      listing.lat && listing.lng
        ? {
            "@type": "GeoCoordinates",
            latitude: listing.lat,
            longitude: listing.lng,
          }
        : undefined,
    image: listing.image,
    numberOfRooms: listing.beds,
    numberOfBathroomsTotal: listing.bathrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: listing.sqft,
      unitCode: "MTK", // Square meters
    },
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: "ILS",
      availability:
        listing.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
    aggregateRating: listing.reviews?.length
      ? {
          "@type": "AggregateRating",
          ratingValue: averageRating.toFixed(1),
          reviewCount: listing.reviews.length,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    review: listing.reviews?.map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.userName,
      },
      datePublished: review.date,
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: review.comment,
    })),
    amenityFeature: listing.features.map((feature) => ({
      "@type": "LocationFeatureSpecification",
      name: feature,
    })),
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "سكنو - Sakannu",
    alternateName: "Sakannu",
    url: "https://sakannu.vercel.app",
    logo: "https://sakannu.vercel.app/logo.png",
    description:
      "أول منصة فلسطينية متخصصة في توفير السكنات الطلابية الآمنة لطلاب جامعة النجاح الوطنية في نابلس",
    address: {
      "@type": "PostalAddress",
      addressLocality: "نابلس",
      addressRegion: "فلسطين",
      streetAddress: "شارع رفيديا الرئيسي",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+970-59-553-7190",
      contactType: "Customer Service",
      email: "ammar.shtayeh@gmail.com",
      availableLanguage: ["ar", "en"],
    },
    sameAs: [
      "https://instagram.com/sakany_ps",
      "https://facebook.com/sakany.ps",
    ],
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "سكّني",
    url: "https://sakany.vercel.app",
    description: "منصة سكن طلاب جامعة النجاح الوطنية في نابلس",
    inLanguage: "ar",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://sakany.vercel.app/students?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}
