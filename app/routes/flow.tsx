import { Outlet } from "react-router";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";

export default function About() {
  return (
    <>
      <Header className="" />
      <Outlet />
      <Footer />
    </>
  );
}
