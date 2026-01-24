// app/gallery/[id]/page.jsx//серверний компонент
import React from "react";
import { getPictureById } from "@/app/actions/pictures/picturesActions";
import PictureView from "./PictureView"; // client component

export default async function PicturePage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id) throw new Error("ID картинки не передано");

  const picture = await getPictureById(id);

  return <PictureView picture={picture} />; // передаємо дані в клієнтський компонент
}
