import { Link, Outlet } from "@remix-run/react";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import FlowLogo from "~/components/images/FlowLogo";

export default function About() {
  return (
    <>
      <Header className="" />
      <Outlet />
      <Footer />
    </>
  );
}
