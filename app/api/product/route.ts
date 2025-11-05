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
      return NextResponse.json(
        { error: "Name, price, and categoryId are required" },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;

    // 🖼️ Upload image to Cloudinary
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
    }

    // 🧾 Create product in database
    const newProduct = await prisma.product.create({
      data: {
        name,
        price: price.toString(),
        categoryId,
        imageUrl,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

// 🔵 READ All Products
export async function GET(req: NextRequest) {
  try {
    const categoryId = req.nextUrl.searchParams.get("categoryId");

    const products = await prisma.product.findMany({
      where: categoryId ? { categoryId } : {},
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
