import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { entryId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { entryId } = await params;
    const entry = await Prisma.journalEntry.findUnique({
      where: {
        id: entryId,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch entry" }, { status: 500 });
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: { entryId: string } }
) {
  try {
    const { entryId } = await params;
    await Prisma.journalEntry.update({
      where: { id: entryId },
      data: { deletedAt: new Date() },
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {

    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 }
    )
  }
}