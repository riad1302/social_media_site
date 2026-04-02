const FRIENDS_LIST = [
  { name: 'Steve Jobs', title: 'CEO of Apple', img: '/assets/images/f1.png', online: false, time: '5 minute ago' },
  { name: 'Ryan Roslansky', title: 'CEO of LinkedIn', img: '/assets/images/f2.png', online: true, time: '' },
  { name: 'Dylan Field', title: 'CEO of Figma', img: '/assets/images/f3.png', online: true, time: '' },
  { name: 'Steve Jobs', title: 'CEO of Apple', img: '/assets/images/f4.png', online: false, time: '5 minute ago' },
];

export default function RightSidebar() {
  return (
    <div className="_layout_right_sidebar_wrap">
      <div className="_layout_right_sidebar_inner">
        <div className="_feed_inner_area _b_radious6 _padd_t24 _padd_b6 _padd_r24 _padd_l24">
          {/* Header */}
          <div className="_feed_right_inner_area_card_content _mar_b24">
            <h4 className="_title5">Your Friends</h4>
            <a href="#" className="_feed_right_inner_area_card_content_txt_link">See All</a>
          </div>

          {/* Search */}
          <div className="_feed_right_inner_area_card_form">
            <svg className="_feed_right_inner_area_card_form_svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 17 17">
              <circle cx="7" cy="7" r="6" stroke="#aaa" strokeWidth="1.5" />
              <path stroke="#aaa" strokeLinecap="round" strokeWidth="1.5" d="M16 16l-3-3" />
            </svg>
            <input type="search" className="_feed_right_inner_area_card_form_inpt" placeholder="input search text" />
          </div>

          {/* Friends list */}
          {FRIENDS_LIST.map((friend, i) => (
            <div key={i} className="_feed_right_inner_area_card_ppl">
              <div className="_feed_right_inner_area_card_ppl_box">
                <div className="_feed_right_inner_area_card_ppl_image" style={{ position: 'relative' }}>
                  <img
                    src={friend.img}
                    alt={friend.name}
                    className="_box_ppl_img"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  {friend.online && (
                    <span style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#52c41a', border: '2px solid #fff' }} />
                  )}
                </div>
                <div>
                  <p className="_feed_right_inner_area_card_ppl_title" style={{ margin: 0 }}>{friend.name}</p>
                  <p className="_feed_right_inner_area_card_ppl_para" style={{ margin: 0 }}>{friend.title}</p>
                </div>
              </div>
              <div className="_feed_right_inner_area_card_ppl_side" style={{ textAlign: 'right' }}>
                {friend.time ? (
                  <span>{friend.time}</span>
                ) : (
                  <span className="_feed_right_inner_area_card_ppl_side_txt" style={{ color: '#52c41a' }}>●</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
