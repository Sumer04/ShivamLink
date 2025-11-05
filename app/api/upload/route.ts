import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = formData.get("categoryId") as string;
    const imageFile = formData.get("image") as File | null;

    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let imageUrl = null;
    let imagePublicId = null;

    // 🖼️ Upload image to Cloudinary if file provided
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "my-business-store" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      imageUrl = (uploadResponse as any).secure_url;
      imagePublicId = (uploadResponse as any).public_id;
    }

    // 🧾 Create product in database
    const newProduct = await prisma.product.create({
      data: {
        name,
        price: price.toString(),
        categoryId,
        imageUrl,
        imagePublicId, // 👈 store for deletion later
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Product creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
