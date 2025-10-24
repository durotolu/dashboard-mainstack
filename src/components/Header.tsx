import React from "react";
import { useUser } from "../hooks/useApi";
import { Loading } from "./ui/Loading";
import "./Header.css";

export const Header: React.FC = () => {
  const { data: user, loading, error } = useUser();

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

          <div className="header__right__inner">
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

            <button className="header__menu" aria-label="Menu">
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
          </div>
        </div>
      </div>
    </header>
  );
};
