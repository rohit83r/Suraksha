import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      {/* You can add Navbar here */}
      {/* <Navbar /> */}

      <main>
        <Outlet />
      </main>

      {/* You can add Footer here */}
      {/* <Footer /> */}
    </>
  );
};

export default MainLayout;
