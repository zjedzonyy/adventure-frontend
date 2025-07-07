import { Navbar, Footer } from "../layout/index.js";

export default function Protected() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark_background text-text_primary dark:text-text_secondary transition-colors duration-300">
      <Navbar></Navbar>
      <Footer></Footer>
    </div>
  );
}
