'use client';

import { clearToken, getFeed, getMe, logout } from '@/lib/api';
import type { Post, User } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CreatePostBox from './components/CreatePostBox';
import FeedNavbar from './components/FeedNavbar';
import LeftSidebar from './components/LeftSidebar';
import PostCard from './components/PostCard';
import RightSidebar from './components/RightSidebar';
import StoriesRow from './components/StoriesRow';

export default function FeedPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const [meRes, feedRes] = await Promise.all([getMe(), getFeed()]);
        setCurrentUser(meRes.user);
        setPosts(feedRes.data);
        setNextCursor(feedRes.next_cursor);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  async function loadMore() {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await getFeed(nextCursor);
      setPosts((prev) => [...prev, ...res.data]);
      setNextCursor(res.next_cursor);
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleLogout() {
    try { await logout(); } catch { /* ignore */ }
    clearToken();
    router.push('/login');
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p>Loading feed...</p>
      </div>
    );
  }

  return (
    <div className="_layout _layout_main_wrapper">
      <div className="_main_layout">
        <FeedNavbar
          userName={currentUser?.name ?? ''}
          userEmail={currentUser?.email ?? ''}
          onLogout={handleLogout}
        />

        <div className="container-fluid px-4">
          <div className="_layout_inner_wrap">
            <div className="row">
              {/* Left Sidebar */}
              <div className="col-xl-3 col-lg-3 col-md-12">
                <LeftSidebar />
              </div>

              {/* Middle Feed */}
              <div className="col-xl-6 col-lg-6 col-md-12">
                <div className="_layout_middle_wrap">
                  <div className="_layout_middle_inner">
                    <StoriesRow />

                    {currentUser && (
                      <CreatePostBox
                        currentUser={currentUser}
                        onPost={(post) => setPosts((prev) => [post, ...prev])}
                      />
                    )}

                    {posts.length === 0 ? (
                      <div className="_feed_inner_area _b_radious6 _padd_t24 _padd_b24 _padd_r24 _padd_l24 _mar_b16" style={{ textAlign: 'center', color: '#888' }}>
                        <p>No posts yet. Be the first to post!</p>
                      </div>
                    ) : (
                      posts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          currentUserId={currentUser?.id ?? 0}
                          onDelete={(id) => setPosts((prev) => prev.filter((p) => p.id !== id))}
                        />
                      ))
                    )}

                    {nextCursor && (
                      <div style={{ textAlign: 'center', padding: '16px 0' }}>
                        <button onClick={loadMore} className="_feed_inner_text_area_btn_link" disabled={loadingMore}>
                          <span>{loadingMore ? 'Loading...' : 'Load more'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-xl-3 col-lg-3 col-md-12">
                <RightSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
