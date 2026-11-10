    import { v2 as cloudinary } from "cloudinary";

export async function POST(request: Request) {
  const { paramsToSign } = await request.json();

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return Response.json({
    signature,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  });
}