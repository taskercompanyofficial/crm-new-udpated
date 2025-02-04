import React from "react";
import { API_URL, WORKERS } from "@/lib/apiEndPoints";
import { getImageUrl } from "@/lib/utils";
import { description, keywords, title } from "@/lib/Meta";
import { fetchData } from "@/hooks/fetchData";
import ViewStaff from "../components/view";

// Function to dynamically generate metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  try {
    // Fetch the data for the slug
    const endPoint = `${API_URL}${WORKERS}/${slug}`;
    const response = await fetchData({ endPoint });

    if (!response || !response.data) {
      throw new Error("Failed to fetch complaint data");
    }

    return {
      title: `${response.data.full_name} | Complaints ${title}`, // Dynamic title
      description: response.data.full_name || description,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: `Complaints ${title}`,
      description: description,
      keywords: keywords,
    };
  }
}

// Server component function
export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  try {
    const endPoint = `${API_URL}${WORKERS}/${slug}`;
    const response = await fetchData({ endPoint });

    if (!response || !response.data) {
      notFound();
    }

    return <ViewStaff data={response.data} />;
  } catch (error) {
    console.error("Error fetching complaint:", error);
    notFound();
  }
}

export function notFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-xl font-semibold">Staff Member Not Found</h2>
      <p className="text-gray-600">
        The staff member you are looking for does not exist or has been removed.
      </p>
    </div>
  );
}
