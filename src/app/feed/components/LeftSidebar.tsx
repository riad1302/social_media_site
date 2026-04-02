const EXPLORE_ITEMS = [
  {
    label: 'Learning',
    badge: 'New',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path fill="#666" d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
      </svg>
    ),
  },
  {
    label: 'Insights',
    badge: null,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path fill="#666" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
      </svg>
    ),
  },
  {
    label: 'Find friends',
    badge: null,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path fill="#666" d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
  },
  {
    label: 'Bookmarks',
    badge: null,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path fill="#666" d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
      </svg>
    ),
  },
  {
    label: 'Group',
    badge: null,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path fill="#666" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
  {
    label: 'Gaming',
    badge: 'New',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path fill="#666" d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    badge: null,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path fill="#666" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
      </svg>
    ),
  },
  {
    label: 'Save post',
    badge: null,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path fill="#666" d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" />
      </svg>
    ),
  },
];

const SUGGESTED_PEOPLE = [
  { name: 'Steve Jobs', title: 'CEO of Apple', img: '/assets/images/card_ppl1.png' },
  { name: 'Ryan Roslansky', title: 'CEO of LinkedIn', img: '/assets/images/card_ppl2.png' },
  { name: 'Dylan Field', title: 'CEO of Figma', img: '/assets/images/card_ppl3.png' },
];

export default function LeftSidebar() {
  return (
    <div className="_layout_left_sidebar_wrap">
      {/* Explore */}
      <div className="_left_inner_area_explore _feed_inner_area _b_radious6 _padd_t24 _padd_b6 _padd_r24 _padd_l24">
        <h4 className="_left_inner_area_explore_title _title5 _mar_b24">Explore</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {EXPLORE_ITEMS.map((item) => (
            <li key={item.label} className="_left_inner_area_explore_item">
              <div className="_explore_item">
                <a href="#" className="_left_inner_area_explore_link">
                  {item.icon}
                  {item.label}
                </a>
                {item.badge && (
                  <span className="_left_inner_area_explore_link_txt">{item.badge}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggested People */}
      <div className="_feed_inner_area _b_radious6 _padd_t24 _padd_b6 _padd_r24 _padd_l24">
        <div className="_left_inner_area_suggest_content _mar_b24">
          <h4 className="_title5">Suggested People</h4>
          <a href="#" className="_left_inner_area_suggest_content_txt_link">See All</a>
        </div>
        {SUGGESTED_PEOPLE.map((person) => (
          <div key={person.name + person.title} className="_left_inner_area_suggest_info">
            <div className="_left_inner_area_suggest_info_box">
              <div className="_left_inner_area_suggest_info_image">
                <img
                  src={person.img}
                  alt={person.name}
                  className="_info_img1"
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div className="_left_inner_area_suggest_info_txt">
                <p className="_left_inner_area_suggest_info_title" style={{ margin: 0 }}>{person.name}</p>
                <p className="_left_inner_area_suggest_info_para" style={{ margin: 0 }}>{person.title}</p>
              </div>
            </div>
            <a href="#" className="_info_link">Connect</a>
          </div>
        ))}
      </div>
    </div>
  );
}
