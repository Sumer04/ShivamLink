import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

// 🟢 Get all categories
export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Error fetching categories", error },
      { status: 500 }
    );
  }
}

// 🔴 Delete a category (and its related products & images)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Missing category ID" }, { status: 400 });
    }

    // 🧾 Find all products under this category
    const products = await prisma.product.findMany({
      where: { categoryId: id },
      select: { id: true, imageUrl: true },
    });

    // 🗑️ Delete images from Cloudinary (if they exist)
    for (const product of products) {
      if (product.imageUrl) {
        // Extract Cloudinary public ID from image URL
        const publicIdMatch = product.imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
        if (publicIdMatch) {
          const publicId = publicIdMatch[1];
          try {
            await cloudinary.uploader.destroy(publicId);
            console.log(`🧹 Deleted Cloudinary image: ${publicId}`);
          } catch (err) {
            console.error("❌ Cloudinary deletion failed:", err);
          }
        }
      }
    }

    // 🗑️ Delete all products in this category
    await prisma.product.deleteMany({
      where: { categoryId: id },
    });

    // 🗑️ Delete the category itself
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Category and related products deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { message: "Error deleting category", error },
      { status: 500 }
    );
  }
}
