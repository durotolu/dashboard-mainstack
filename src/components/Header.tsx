import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../hooks/useApi";
import { Loading } from "./ui/Loading";
import "./Header.css";

export const Header: React.FC = () => {
  const { data: user, loading, error } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__left">
          <div className="header__logo">
            <div className="logo">
              <div className="logo__icon">
                <img src="/mainstack-logo.svg" alt="Logo" />
              </div>
            </div>
          </div>
        </div>
        <nav className="header__nav">
          <a href="#" className="nav-link">
            <img src="/home.svg" alt="home" />
            Home
          </a>
          <a href="#" className="nav-link">
            <img src="/insert_chart.svg" alt="analytics" />
            Analytics
          </a>
          <a href="#" className="nav-link nav-link--active">
            <img src="/payments.svg" alt="revenue" />
            Revenue
          </a>
          <a href="#" className="nav-link">
            <img src="/group.svg" alt="crm" />
            CRM
          </a>
          <a href="#" className="nav-link">
            <img src="/widgets.svg" alt="apps" />
            Apps
          </a>
        </nav>

        <div className="header__right">
          <button className="header__notification" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 6.5C15 5.11929 14.4732 3.79514 13.5355 2.85786C12.5979 1.92057 11.2737 1.39404 9.89286 1.39404C8.51201 1.39404 7.18786 1.92057 6.25058 2.85786C5.31329 3.79514 4.78676 5.11929 4.78676 6.5C4.78676 12.5 2.5 14 2.5 14H17.5C17.5 14 15 12.5 15 6.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.4419 17.5C11.2952 17.7526 11.0849 17.9622 10.8319 18.1079C10.5789 18.2537 10.2922 18.3304 10 18.3304C9.70781 18.3304 9.42106 18.2537 9.16808 18.1079C8.9151 17.9622 8.70479 17.7526 8.55811 17.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className="header__messages" aria-label="Messages">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="20" fill="white" />
              <mask
                id="mask0_19139_1238"
                maskUnits="userSpaceOnUse"
                x="10"
                y="10"
                width="20"
                height="20"
              >
                <rect x="10" y="10" width="20" height="20" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_19139_1238)">
                <path
                  d="M15.8332 21.4583H20.8332C21.0106 21.4583 21.1591 21.3984 21.2787 21.2788C21.3984 21.1591 21.4582 21.0106 21.4582 20.8333C21.4582 20.6559 21.3984 20.5074 21.2787 20.3878C21.1591 20.2681 21.0106 20.2083 20.8332 20.2083H15.8332C15.6559 20.2083 15.5074 20.2681 15.3877 20.3878C15.2681 20.5074 15.2083 20.6559 15.2083 20.8333C15.2083 21.0106 15.2681 21.1591 15.3877 21.2788C15.5074 21.3984 15.6559 21.4583 15.8332 21.4583ZM15.8332 18.9583H24.1666C24.3439 18.9583 24.4924 18.8984 24.6121 18.7788C24.7317 18.6591 24.7915 18.5106 24.7915 18.3333C24.7915 18.1559 24.7317 18.0074 24.6121 17.8878C24.4924 17.7681 24.3439 17.7083 24.1666 17.7083H15.8332C15.6559 17.7083 15.5074 17.7681 15.3877 17.8878C15.2681 18.0074 15.2083 18.1559 15.2083 18.3333C15.2083 18.5106 15.2681 18.6591 15.3877 18.7788C15.5074 18.8984 15.6559 18.9583 15.8332 18.9583ZM15.8332 16.4583H24.1666C24.3439 16.4583 24.4924 16.3984 24.6121 16.2788C24.7317 16.1591 24.7915 16.0106 24.7915 15.8333C24.7915 15.6559 24.7317 15.5074 24.6121 15.3878C24.4924 15.2681 24.3439 15.2083 24.1666 15.2083H15.8332C15.6559 15.2083 15.5074 15.2681 15.3877 15.3878C15.2681 15.5074 15.2083 15.6559 15.2083 15.8333C15.2083 16.0106 15.2681 16.1591 15.3877 16.2788C15.5074 16.3984 15.6559 16.4583 15.8332 16.4583ZM15.032 24.5833L13.3637 26.2515C13.1265 26.4887 12.8538 26.5424 12.5456 26.4126C12.2374 26.2828 12.0833 26.0491 12.0833 25.7115V13.5897C12.0833 13.1688 12.2291 12.8125 12.5208 12.5208C12.8124 12.2291 13.1687 12.0833 13.5897 12.0833H26.4101C26.8311 12.0833 27.1874 12.2291 27.479 12.5208C27.7707 12.8125 27.9165 13.1688 27.9165 13.5897V23.0769C27.9165 23.4978 27.7707 23.8541 27.479 24.1458C27.1874 24.4374 26.8311 24.5833 26.4101 24.5833H15.032ZM14.4999 23.3333H26.4101C26.4742 23.3333 26.533 23.3066 26.5864 23.2532C26.6399 23.1997 26.6666 23.141 26.6666 23.0769V13.5897C26.6666 13.5256 26.6399 13.4668 26.5864 13.4134C26.533 13.36 26.4742 13.3333 26.4101 13.3333H13.5897C13.5256 13.3333 13.4668 13.36 13.4134 13.4134C13.3599 13.4668 13.3332 13.5256 13.3332 13.5897V24.4871L14.4999 23.3333Z"
                  fill="#56616B"
                />
              </g>
            </svg>
          </button>

          <div className="header__right__inner" ref={dropdownRef}>
            <div className="header__profile">
              {loading ? (
                <Loading size="small" />
              ) : error ? (
                <div className="profile-error">Error</div>
              ) : (
                <div className="profile">
                  <div className="profile__avatar">
                    {user
                      ? user.first_name.charAt(0).toUpperCase() +
                        user.last_name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                </div>
              )}
            </div>

            <button
              className="header__menu"
              aria-label="Menu"
              aria-expanded={isDropdownOpen}
              onClick={toggleDropdown}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M3 6H17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M3 12H17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M3 18H17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="header__dropdown" role="menu" aria-label="User menu">
                <div className="header__dropdown__profile">
                  <div className="dropdown-profile__avatar">
                    {user
                      ? user.first_name.charAt(0).toUpperCase() +
                        user.last_name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <div className="dropdown-profile__info">
                    <div className="dropdown-profile__name">
                      {user ? `${user.first_name} ${user.last_name}` : "User"}
                    </div>
                    <div className="dropdown-profile__email">
                      {user ? user.email : "user@example.com"}
                    </div>
                  </div>
                </div>

                <div className="header__dropdown__menu">
                  <button className="dropdown-menu-item" role="menuitem">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M16.25 10C16.25 10.625 16.125 11.25 15.875 11.8125L17.5 13.4375C17.6875 13.625 17.6875 13.9375 17.5 14.125L15.875 15.75C15.6875 15.9375 15.375 15.9375 15.1875 15.75L13.5625 14.125C12.9375 14.375 12.3125 14.5 11.6875 14.5V16.75C11.6875 17 11.4375 17.25 11.1875 17.25H8.8125C8.5625 17.25 8.3125 17 8.3125 16.75V14.5C7.6875 14.5 7.0625 14.375 6.4375 14.125L4.8125 15.75C4.625 15.9375 4.3125 15.9375 4.125 15.75L2.5 14.125C2.3125 13.9375 2.3125 13.625 2.5 13.4375L4.125 11.8125C3.875 11.25 3.75 10.625 3.75 10C3.75 9.375 3.875 8.75 4.125 8.1875L2.5 6.5625C2.3125 6.375 2.3125 6.0625 2.5 5.875L4.125 4.25C4.3125 4.0625 4.625 4.0625 4.8125 4.25L6.4375 5.875C7.0625 5.625 7.6875 5.5 8.3125 5.5V3.25C8.3125 3 8.5625 2.75 8.8125 2.75H11.1875C11.4375 2.75 11.6875 3 11.6875 3.25V5.5C12.3125 5.5 12.9375 5.625 13.5625 5.875L15.1875 4.25C15.375 4.0625 15.6875 4.0625 15.875 4.25L17.5 5.875C17.6875 6.0625 17.6875 6.375 17.5 6.5625L15.875 8.1875C16.125 8.75 16.25 9.375 16.25 10Z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    Settings
                  </button>

                  <button className="dropdown-menu-item" role="menuitem">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4.16667 5.83333H15.8333V15.8333C15.8333 16.2754 15.6577 16.6993 15.3452 17.0118C15.0326 17.3244 14.6087 17.5 14.1667 17.5H5.83333C5.39131 17.5 4.96738 17.3244 4.65482 17.0118C4.34226 16.6993 4.16667 16.2754 4.16667 15.8333V5.83333Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M13.3333 2.5H6.66667C6.20643 2.5 5.83333 2.8731 5.83333 3.33333V5.83333H14.1667V3.33333C14.1667 2.8731 13.7936 2.5 13.3333 2.5Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M8.33333 9.16667V13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M11.6667 9.16667V13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Purchase History
                  </button>

                  <button className="dropdown-menu-item" role="menuitem">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M15.8333 7.5L10 13.3333L4.16667 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Refer and Earn
                  </button>

                  <button className="dropdown-menu-item" role="menuitem">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 5H8.33333V8.33333H5V5Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M11.6667 5H15V8.33333H11.6667V5Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M5 11.6667H8.33333V15H5V11.6667Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M11.6667 11.6667H15V15H11.6667V11.6667Z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    Integrations
                  </button>

                  <button className="dropdown-menu-item" role="menuitem">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M10 6.66667V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M10 13.3333H10.0083" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Report Bug
                  </button>

                  <button className="dropdown-menu-item" role="menuitem">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M13.3333 5.83333C13.3333 7.67428 11.8409 9.16667 10 9.16667C8.15905 9.16667 6.66667 7.67428 6.66667 5.83333C6.66667 3.99238 8.15905 2.5 10 2.5C11.8409 2.5 13.3333 3.99238 13.3333 5.83333Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M10 11.6667C6.31814 11.6667 3.33333 14.6515 3.33333 18.3333H16.6667C16.6667 14.6515 13.6819 11.6667 10 11.6667Z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    Switch Account
                  </button>

                  <button className="dropdown-menu-item" role="menuitem">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M13.3333 14.1667L17.5 10L13.3333 5.83333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17.5 10H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
