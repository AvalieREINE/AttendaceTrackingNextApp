import { Shojumaru } from 'next/font/google';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import Dashboard from './Dashboard';
import ClassLists from './ClassLists';

enum ContentTypes {
  DASHBOARD,
  CLASSLISTS
}
function HomePage() {
  // check if logged in, show login or home page
  const [showDropDown, setShowDropDown] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(true);
  const [selectedContent, setSelectedContent] = useState<number>(0);
  const router = useRouter();
  const clickRef: any = useRef();
  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (
        showDropDown &&
        clickRef.current &&
        !clickRef.current.contains(e.target)
      ) {
        setShowDropDown(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [showDropDown]);

  const Contents = () => {
    switch (selectedContent) {
      case ContentTypes.DASHBOARD:
        return <Dashboard clickRef={clickRef} />;
      case ContentTypes.CLASSLISTS:
        return <ClassLists clickRef={clickRef} />;
      default:
        return null;
    }
  };
  const Signout = () => {
    // todo: add logic to remove token
    router.push('/signin');
  };
  return (
    // <div className="grid grid-cols-1 mt-28 place-items-center">
    //   <div>
    //     <h1 className="text-5xl">Whitecliffe Attendance Tracking System</h1>
    //   </div>
    //   <button className="bg-button-primary hover:bg-button-primary-hover text-black font-bold py-2 px-20 mt-20 rounded">
    //     Login
    //   </button>
    //   <button className="bg-button-primary hover:bg-button-primary-hover text-black font-bold py-2 px-20 mt-10 rounded">
    //     Register
    //   </button>
    // </div>

    <div className="bg-gray-100 font-family-karla flex min-h-screen ">
      {showSideMenu ? (
        <aside className=" z-20 relative bg-sidebar hidden w-64 sm:block shadow-xl">
          <div className="p-6">
            <a
              href="index.html"
              className="text-white text-3xl font-semibold uppercase hover:text-gray-300"
            >
              Admin
            </a>
            <button className="w-full bg-white cta-btn font-semibold p-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg hover:shadow-xl hover:bg-gray-300 flex items-center justify-center">
              <i className="fas fa-plus mr-3"></i> Enter Attendance
            </button>

            <button className="w-full bg-white cta-btn   py-4 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg hover:shadow-xl hover:bg-gray-300 flex items-center justify-center">
              <i className="fas fa-table  ml-3 "></i> Send Email Reminder
            </button>
          </div>
          <div className="text-white  font-semibold pt-3">
            <button
              onClick={() => {
                setSelectedContent(ContentTypes.DASHBOARD);
              }}
              className={`w-full flex items-center text-white py-4 pl-6   ${
                selectedContent === ContentTypes.DASHBOARD
                  ? 'bg-black'
                  : 'nav-item'
              }`}
            >
              <i className="fas fa-tachometer-alt mr-3"></i>
              Dashboard
            </button>
            <button
              onClick={() => setSelectedContent(ContentTypes.CLASSLISTS)}
              className={`w-full flex items-center text-white py-4 pl-6   ${
                selectedContent === ContentTypes.CLASSLISTS
                  ? 'bg-black'
                  : 'nav-item'
              }`}
            >
              <i className="fas fa-sticky-note mr-3"></i>
              Class Lists
            </button>

            <a
              href="/home"
              className=" flex items-center  text-white py-4 pl-6 nav-item "
            >
              <i className="fas fa-sticky-note mr-3"></i>
              Other
            </a>
          </div>
        </aside>
      ) : null}

      <div className="w-full flex flex-col">
        <header className="w-full items-center bg-white py-2 px-6 hidden sm:flex">
          <button
            onClick={() => {
              setShowSideMenu(!showSideMenu);
            }}
            className="realtive z-10 border-4 border-gray-400 hover:border-gray-300 focus:border-gray-300 focus:outline-none"
          >
            {showSideMenu ? 'Close' : 'Open'} Menu
          </button>
          <div className="w-1/2"></div>
          <div className="relative w-1/2 flex justify-end">
            <button
              onClick={() => {
                setShowDropDown(!showDropDown);
              }}
              className="realtive z-10 w-12 h-12 rounded-full overflow-hidden border-4 border-gray-400 hover:border-gray-300 focus:border-gray-300 focus:outline-none"
            >
              <img src="https://source.unsplash.com/uJ8LNVCBjFQ/400x400" />
            </button>
            <button className="h-full w-full fixed inset-0 cursor-default"></button>
            {showDropDown && (
              <div className="absolute bg-white rounded-lg shadow-lg py-2 mt-16">
                <>
                  <button className="block px-6 py-2 account-link hover:text-white">
                    Account
                  </button>

                  <button
                    className="block px-6 py-2 account-link hover:text-white"
                    onClick={Signout}
                  >
                    Sign Out
                  </button>
                </>
              </div>
            )}
          </div>
        </header>

        <header className="w-full bg-sidebar py-5 px-6 sm:hidden">
          <div className="flex items-center justify-between">
            <a
              href="index.html"
              className="text-white text-3xl font-semibold uppercase hover:text-gray-300"
            >
              Admin
            </a>
            <button
              className="text-white   focus:outline-none"
              onClick={() => setShowSideMenu(!showSideMenu)}
            >
              {!showSideMenu ? 'Show' : 'Close'} menu
            </button>
          </div>
          {/* className="isOpen ? 'flex': 'hidden'" */}
          {showSideMenu && (
            <nav className="flex flex-col pt-4">
              <div className="flex items-center active-nav-link text-white py-2 pl-4 nav-item">
                <i className="fas fa-tachometer-alt mr-3"></i>
                Dashboard
              </div>
              <a
                href="blank.html"
                className="flex items-center text-white opacity-75 hover:opacity-100 py-2 pl-4 nav-item"
              >
                <i className="fas fa-sticky-note mr-3"></i>
                Blank Page
              </a>
              <a
                href="tables.html"
                className="flex items-center text-white opacity-75 hover:opacity-100 py-2 pl-4 nav-item"
              >
                <i className="fas fa-table mr-3"></i>
                Tables
              </a>
              <a
                href="forms.html"
                className="flex items-center text-white opacity-75 hover:opacity-100 py-2 pl-4 nav-item"
              >
                <i className="fas fa-align-left mr-3"></i>
                Forms
              </a>
              <a
                href="tabs.html"
                className="flex items-center text-white opacity-75 hover:opacity-100 py-2 pl-4 nav-item"
              >
                <i className="fas fa-tablet-alt mr-3"></i>
                Tabbed Content
              </a>
              <a
                href="calendar.html"
                className="flex items-center text-white opacity-75 hover:opacity-100 py-2 pl-4 nav-item"
              >
                <i className="fas fa-calendar mr-3"></i>
                Calendar
              </a>
              <a
                href="#"
                className="flex items-center text-white opacity-75 hover:opacity-100 py-2 pl-4 nav-item"
              >
                <i className="fas fa-cogs mr-3"></i>
                Support
              </a>
              <a
                href="#"
                className="flex items-center text-white opacity-75 hover:opacity-100 py-2 pl-4 nav-item"
              >
                <i className="fas fa-user mr-3"></i>
                My Account
              </a>
              <a
                href="#"
                className="flex items-center text-white opacity-75 hover:opacity-100 py-2 pl-4 nav-item"
              >
                <i className="fas fa-sign-out-alt mr-3"></i>
                Sign Out
              </a>
              <button
                onClick={() => setShowDropDown(!showDropDown)}
                className="w-full bg-white cta-btn font-semibold py-2 mt-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-300 flex items-center justify-center"
              >
                <i className="fas fa-arrow-circle-up mr-3"></i> Close Menu
              </button>
            </nav>
          )}
        </header>
        <Contents />
      </div>
    </div>
  );
}

export default HomePage;
