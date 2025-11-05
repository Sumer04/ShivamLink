import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

// 🟠 UPDATE Product
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, price, imageUrl, categoryId } = await req.json();

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: { name, price, imageUrl, categoryId },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}



export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // 🧹 Delete from Cloudinary if exists
    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    // 🗑️ Delete from database
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ message: "Error deleting product" }, { status: 500 });
  }
}


