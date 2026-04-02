'use client';

import Avatar from '@/components/Avatar';
import { useEffect, useRef, useState } from 'react';

interface FeedNavbarProps {
  userName: string;
  userEmail: string;
  onLogout: () => void;
}

export default function FeedNavbar({ userName, userEmail, onLogout }: FeedNavbarProps) {
  const [showProfileDrop, setShowProfileDrop] = useState(false);
  const profileDropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileDropRef.current && !profileDropRef.current.contains(e.target as Node)) {
        setShowProfileDrop(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg _header_nav">
      <div className="container-fluid px-4">
        {/* Logo */}
        <div className="_logo_wrap">
          <a className="navbar-brand" href="/feed">
            <img src="/assets/images/logo.svg" alt="BuddyScript" className="_nav_logo" />
          </a>
        </div>

        {/* Search */}
        <div className="_header_form mx-auto" style={{ width: 280 }}>
          <form className="_header_form_grp">
            <svg className="_header_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
              <circle cx="7" cy="7" r="6" stroke="#999" strokeWidth="1.5" />
              <path stroke="#999" strokeLinecap="round" strokeWidth="1.5" d="M16 16l-3-3" />
            </svg>
            <input className="form-control _inpt1" type="search" placeholder="Input search text" style={{ paddingLeft: 44 }} />
          </form>
        </div>

        {/* Right side: nav icons + profile */}
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav align-items-center">
            <li className="_header_nav_item">
              <a href="/feed" className="_header_nav_link _header_nav_link_active">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path className="_home_active" stroke="#00ACFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" />
                  <path className="_home_active" stroke="#00ACFF" strokeWidth="1.8" d="M9 21V12h6v9" />
                </svg>
              </a>
            </li>
            <li className="_header_nav_item">
              <a href="#" className="_header_nav_link">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path fill="#999" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </a>
            </li>
            <li className="_header_nav_item" style={{ position: 'relative' }}>
              <a href="#" className="_header_nav_link">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path fill="#999" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
                <span className="_counting">6</span>
              </a>
            </li>
            <li className="_header_nav_item" style={{ position: 'relative' }}>
              <a href="#" className="_header_nav_link">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path fill="#999" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
                <span className="_counting">3</span>
              </a>
            </li>
          </ul>

          {/* Profile dropdown */}
          <div className="_header_nav_profile ms-3" style={{ position: 'relative' }} ref={profileDropRef}>
            <div className="_header_nav_profile_image">
              <Avatar name={userName} size={36} />
            </div>
            <div className="_header_nav_dropdown">
              <p className="_header_nav_para" style={{ marginBottom: 0 }}>{userName}</p>
              <button
                onClick={() => setShowProfileDrop((v) => !v)}
                className="_header_nav_dropdown_btn"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" fill="none" viewBox="0 0 10 6">
                  <path fill="#112032" d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z" />
                </svg>
              </button>
            </div>

            <div className={`_nav_profile_dropdown${showProfileDrop ? ' show' : ''}`}>
              <div className="_nav_profile_dropdown_info">
                <div className="_nav_profile_dropdown_image">
                  <Avatar name={userName} size={54} />
                </div>
                <div>
                  <h4 className="_nav_dropdown_title">{userName}</h4>
                  <a href="#" className="_nav_drop_profile">View Profile</a>
                </div>
              </div>
              <hr style={{ margin: '12px 0' }} />
              <ul className="_nav_dropdown_list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li className="_nav_dropdown_list_item">
                  <a href="#" className="_nav_dropdown_link">
                    <div className="_nav_drop_info" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                          <path stroke="#377DFF" strokeWidth="1.5" strokeLinecap="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                          <path stroke="#377DFF" strokeWidth="1.5" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                        </svg>
                      </span>
                      Settings
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" fill="none" viewBox="0 0 8 14">
                      <path stroke="#999" strokeWidth="1.5" strokeLinecap="round" d="M1 1l6 6-6 6" />
                    </svg>
                  </a>
                </li>
                <li className="_nav_dropdown_list_item">
                  <a href="#" className="_nav_dropdown_link">
                    <div className="_nav_drop_info" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                          <path stroke="#377DFF" strokeWidth="1.5" strokeLinecap="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                          <path stroke="#377DFF" strokeWidth="1.5" strokeLinecap="round" d="M12 8v4M12 16h.01" />
                        </svg>
                      </span>
                      Help &amp; Support
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" fill="none" viewBox="0 0 8 14">
                      <path stroke="#999" strokeWidth="1.5" strokeLinecap="round" d="M1 1l6 6-6 6" />
                    </svg>
                  </a>
                </li>
                <li className="_nav_dropdown_list_item" style={{ marginBottom: 0 }}>
                  <button
                    onClick={onLogout}
                    className="_nav_dropdown_link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', padding: 0 }}
                  >
                    <div className="_nav_drop_info" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 19 19">
                          <path stroke="#377DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.667 18H2.889A1.889 1.889 0 011 16.111V2.89A1.889 1.889 0 012.889 1h3.778M13.277 14.222L18 9.5l-4.723-4.722M18 9.5H6.667" />
                        </svg>
                      </span>
                      Log Out
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" fill="none" viewBox="0 0 8 14">
                      <path stroke="#999" strokeWidth="1.5" strokeLinecap="round" d="M1 1l6 6-6 6" />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
