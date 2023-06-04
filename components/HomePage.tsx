import { Shojumaru } from 'next/font/google';
import { useRouter } from 'next/router';
import React, { createRef, useEffect, useRef, useState } from 'react';
import Dashboard from './Dashboard';
import ClassLists from './ClassLists';
import AttendanceForm from './AttendanceForm';
import { destroyCookie } from 'nookies';
import ImportStudentData from './ImportStudentData';
import AccountDetails from './AccountDetails';
import AddStudentForm from './AddStudentData';

enum ContentTypes {
  DASHBOARD,
  CLASSLISTS,
  ACCOUNT,
  ATTENDANCE,
  REMINDER,
  IMPORTDATA,
  ACCOUNT_DETAILS,
  ADD_STUDENT
}
function HomePage() {
  // check if logged in, show login or home page
  const [showDropDown, setShowDropDown] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(true);
  const [selectedContent, setSelectedContent] = useState<number>(0);
  const router = useRouter();
  const ref: any = useRef(null);
  // useEffect(() => {
  //   const checkIfClickedOutside = (e: any) => {
  //     if (!ref.current.contains(e.target)) {
  //       setShowDropDown(false);
  //     }
  //   };
  //   console.log(ref, 'clickRef home page');

  //   document.addEventListener('click', checkIfClickedOutside, true);

  //   return () => {
  //     document.removeEventListener('click', checkIfClickedOutside, true);
  //   };
  // }, [showDropDown]);
  const onBlur = (event: any) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowDropDown(false);
    }
  };

  const Contents = () => {
    switch (selectedContent) {
      case ContentTypes.DASHBOARD:
        return <Dashboard />;
      case ContentTypes.CLASSLISTS:
        return <ClassLists />;
      case ContentTypes.ATTENDANCE:
        return <AttendanceForm />;
      case ContentTypes.IMPORTDATA:
        return <ImportStudentData />;
      case ContentTypes.ACCOUNT_DETAILS:
        return <AccountDetails />;
      case ContentTypes.ADD_STUDENT:
        return <AddStudentForm />;
      default:
        return null;
    }
  };
  const Signout = () => {
    destroyCookie(null, 'token');
    destroyCookie(null, 'role');
    router.push('/signin');
  };
  return (
    <div className="bg-gray-100 font-family-karla flex min-h-screen ">
      {showSideMenu ? (
        <aside className=" z-20 relative bg-sidebar hidden w-64 sm:block shadow-xl">
          <div className="p-6">
            {/* user types */}
            <p className="text-white text-3xl font-semibold uppercase">
              Teacher
            </p>
            <button
              onClick={() => {
                setSelectedContent(ContentTypes.ADD_STUDENT);
              }}
              className={` ${
                selectedContent === ContentTypes.ADD_STUDENT
                  ? 'bg-gray-800 text-white'
                  : 'bg-white hover:shadow-xl hover:bg-gray-300'
              }w-full cta-btn font-semibold p-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg  flex items-center justify-center`}
            >
              <i className="fas fa-plus mr-3"></i> Add Students
            </button>
            <button
              onClick={() => {
                setSelectedContent(ContentTypes.ATTENDANCE);
              }}
              className={` ${
                selectedContent === ContentTypes.ATTENDANCE
                  ? 'bg-gray-800 text-white'
                  : 'bg-white hover:shadow-xl hover:bg-gray-300'
              }w-full cta-btn font-semibold p-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg  flex items-center justify-center`}
            >
              <i className="fas fa-plus mr-3"></i> Mark Attendance
            </button>

            <button
              onClick={() => {
                setSelectedContent(ContentTypes.IMPORTDATA);
              }}
              className={` ${
                selectedContent === ContentTypes.IMPORTDATA
                  ? 'bg-gray-800 text-white'
                  : 'bg-white hover:shadow-xl hover:bg-gray-300'
              }w-full cta-btn font-semibold p-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg  flex items-center justify-center`}
            >
              <i className="fas fa-table  ml-3 "></i> Import student data
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
              Program Lists
            </button>
          </div>
        </aside>
      ) : null}

      <div className="w-full flex flex-col">
        <header className="w-full items-center bg-white py-2 px-6 hidden sm:flex">
          <button
            onClick={() => {
              setShowSideMenu(!showSideMenu);
            }}
            className="realtive z-10   hover:border-gray-300 focus:border-gray-300 focus:outline-none"
          >
            {!showSideMenu ? (
              <i className="fa-solid fa-bars fa-2xl"></i>
            ) : (
              <i className="fa-solid fa-xmark fa-2xl"></i>
            )}
          </button>
          <div className="w-1/2"></div>
          <div className="relative w-1/2 flex justify-end">
            <button
              onClick={() => {
                setShowDropDown(!showDropDown);
              }}
              onBlur={onBlur}
              className="realtive z-10 w-12 h-12 rounded-full overflow-hidden border-4 border-gray-400 hover:border-gray-300 focus:border-gray-300 focus:outline-none"
            >
              <i className="fa-solid fa-user fa-xl"></i>

              {showDropDown && (
                <div className="absolute bg-white rounded-lg shadow-lg py-2 mt-6 right-0">
                  <>
                    <button
                      onClick={() => {
                        setSelectedContent(ContentTypes.ACCOUNT_DETAILS);
                      }}
                      className="block px-6 py-2 account-link hover:text-white"
                    >
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
            </button>
          </div>
        </header>
        <header className="w-full bg-sidebar py-5 px-6 sm:hidden">
          <div className="flex items-center justify-between">
            {/* user types */}
            <p className="text-white text-3xl font-semibold uppercase">Admin</p>
            <button
              className="text-white   focus:outline-none"
              onClick={() => setShowSideMenu(!showSideMenu)}
            >
              {!showSideMenu ? (
                <i className="fa-solid fa-bars fa-lg"></i>
              ) : null}
            </button>
          </div>

          {showSideMenu && (
            <nav className="flex flex-col pt-4">
              <button
                onClick={() => {
                  setSelectedContent(ContentTypes.DASHBOARD);
                }}
                className={`w-full flex items-center text-white py-2 pl-6   ${
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
                className={`w-full flex items-center text-white py-2 pl-6   ${
                  selectedContent === ContentTypes.CLASSLISTS
                    ? 'bg-black'
                    : 'nav-item'
                }`}
              >
                <i className="fas fa-sticky-note mr-3"></i>
                Import student data
              </button>
              <button
                onClick={() => setSelectedContent(ContentTypes.CLASSLISTS)}
                className={`w-full flex items-center text-white py-2 pl-6   ${
                  selectedContent === ContentTypes.CLASSLISTS
                    ? 'bg-black'
                    : 'nav-item'
                }`}
              >
                <i className="fas fa-sticky-note mr-3"></i>
                Class Lists
              </button>
              <button
                onClick={() => setSelectedContent(ContentTypes.ACCOUNT)}
                className={`w-full flex items-center text-white py-2 pl-6   ${
                  selectedContent === ContentTypes.ACCOUNT
                    ? 'bg-black'
                    : 'nav-item'
                }`}
              >
                <i className="fas fa-sticky-note mr-3"></i>
                My Account
              </button>
              <button
                onClick={Signout}
                className={`w-full flex items-center text-white py-2 pl-6 nav-item`}
              >
                <i className="fas fa-sticky-note mr-3"></i>
                Sign Out
              </button>

              <button
                onClick={() => setShowSideMenu(false)}
                className="w-full bg-white cta-btn font-semibold py-2 mt-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-300 flex items-center justify-center"
              >
                <i className="fas fa-arrow-circle-up mr-3"></i> Close Menu
              </button>
            </nav>
          )}
        </header>
        <Contents />
        {/* {Contents()} */}
      </div>
    </div>
  );
}

export default HomePage;
