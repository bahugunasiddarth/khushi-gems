import { Metadata } from "next";
import LocationClient from "./client-view";

export const metadata: Metadata = {
  title: "Visit Our Store | Best Jewellery Shop in Johari Bazar, Jaipur",
  description: "Visit Khushi Gems & Jewels at Badi Chopar, Johari Bazar. Experience the finest handcrafted Gold, Silver and Kundan Meena jewellery in the heart of Jaipur.",
  keywords: ["Jewellery Shop Johari Bazar", "Khushi Gems Location", "Jaipur Jewellery Store Address", "Badi Chopar Jewellers"]
};

export default function LocationPage() {
  return <LocationClient />;
}