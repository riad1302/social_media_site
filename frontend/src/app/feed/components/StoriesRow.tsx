import Avatar from '@/components/Avatar';

const STORY_IMGS = [
  '/assets/images/img1.png',
  '/assets/images/img2.png',
  '/assets/images/img3.png',
  '/assets/images/img4.png',
];

const STORY_NAMES = ['Ryan Roslansky', 'Ryan Roslansky', 'Ryan Roslansky', 'Ryan Roslansky'];

export default function StoriesRow() {
  return (
    <div className="_feed_inner_area _b_radious6 _mar_b16" style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
        {/* Your Story */}
        <div className="_feed_inner_profile_story" style={{ minWidth: 100, flex: '0 0 100px' }}>
          <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', height: 145 }}>
            <div className="_feed_inner_profile_story_image" style={{ height: '100%' }}>
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />
            </div>
            <div className="_feed_inner_story_txt">
              <div className="_feed_inner_story_btn">
                <button
                  className="_feed_inner_story_btn_link"
                  type="button"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
                    <path fill="#fff" d="M14 8H8v6H6V8H0V6h6V0h2v6h6v2z" />
                  </svg>
                </button>
              </div>
              <p className="_feed_inner_story_para">Your Story</p>
            </div>
          </div>
        </div>

        {/* Other Stories */}
        {STORY_IMGS.map((img, i) => (
          <div key={i} className="_feed_inner_public_story" style={{ minWidth: 100, flex: '0 0 100px' }}>
            <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', height: 145 }}>
              <div className="_feed_inner_public_story_image" style={{ height: '100%' }}>
                <img
                  src={img}
                  alt=""
                  className="_public_story_img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).parentElement!.style.background =
                      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="_feed_inner_public_mini">
                <Avatar name={STORY_NAMES[i]} size={28} />
              </div>
              <div className="_feed_inner_pulic_story_txt">
                <p className="_feed_inner_pulic_story_para">{STORY_NAMES[i]}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
