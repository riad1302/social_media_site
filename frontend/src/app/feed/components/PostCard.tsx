'use client';

import { addComment, deletePost, getComments, togglePostLike } from '@/lib/api';
import { timeAgo } from '@/lib/utils';
import type { Comment, Post } from '@/types';
import { useEffect, useRef, useState } from 'react';
import Avatar from '@/components/Avatar';
import CommentItem from './CommentItem';

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL ?? 'http://localhost:8000/storage';

export default function PostCard({
  post,
  currentUserId,
  onDelete,
}: {
  post: Post;
  currentUserId: number;
  onDelete: (id: number) => void;
}) {
  const [likesCount, setLikesCount] = useState(post.likes_count ?? post.likes?.length ?? 0);
  const [liked, setLiked] = useState(post.likes?.some((l) => l.user_id === currentUserId) ?? false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [showPostDrop, setShowPostDrop] = useState(false);
  const postDropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (postDropRef.current && !postDropRef.current.contains(e.target as Node)) {
        setShowPostDrop(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  async function handleLike() {
    const res = await togglePostLike(post.id);
    setLikesCount(res.likes_count);
    setLiked(res.liked);
  }

  async function handleToggleComments() {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const res = await getComments(post.id);
        setComments(res.comments);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments((v) => !v);
  }

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    const res = await addComment(post.id, commentText.trim());
    setComments((prev) => [res.comment, ...prev]);
    setCommentText('');
    setShowComments(true);
  }

  async function handleDelete() {
    if (!confirm('Delete this post?')) return;
    await deletePost(post.id);
    onDelete(post.id);
  }

  return (
    <div className="_feed_inner_timeline_post_area _feed_inner_area _b_radious6 _mar_b16" style={{ padding: 24 }}>
      {/* Post header */}
      <div className="_feed_inner_timeline_post_top" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Avatar name={post.user.name} />
          <div>
            <h5 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--color6)' }}>{post.user.name}</h5>
            <p style={{ margin: 0, fontSize: 12, color: '#888', display: 'flex', alignItems: 'center', gap: 6 }}>
              {timeAgo(post.created_at)}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="9" stroke="#888" strokeWidth="1.5" />
                  <path stroke="#888" strokeWidth="1.5" d="M10 1C10 1 6 7 6 10a4 4 0 008 0c0-3-4-9-4-9z" />
                </svg>
                {post.visibility === 'public' ? 'Public' : 'Private'}
              </span>
            </p>
          </div>
        </div>

        <div className="_feed_inner_timeline_post_box_dropdown" ref={postDropRef}>
          <button
            type="button"
            className="_nav_drop_btn_link"
            onClick={() => setShowPostDrop((v) => !v)}
            style={{ padding: 4 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="4" fill="none" viewBox="0 0 20 4">
              <circle cx="2" cy="2" r="2" fill="#666" />
              <circle cx="10" cy="2" r="2" fill="#666" />
              <circle cx="18" cy="2" r="2" fill="#666" />
            </svg>
          </button>

          <div className={`_feed_timeline_dropdown${showPostDrop ? ' show' : ''}`}>
            {post.user_id === currentUserId && (
              <div className="_feed_timeline_dropdown_item">
                <button
                  onClick={handleDelete}
                  className="_feed_timeline_dropdown_link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: '#dc2626', width: '100%' }}
                >
                  <span style={{ background: '#fee2e2' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                    </svg>
                  </span>
                  Delete Post
                </button>
              </div>
            )}
            <div className="_feed_timeline_dropdown_item">
              <button
                className="_feed_timeline_dropdown_link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}
              >
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path stroke="#377DFF" strokeWidth="1.5" strokeLinecap="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
                Save Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <p style={{ fontSize: 14, marginBottom: 14, lineHeight: 1.7, color: 'var(--color7)' }}>{post.content}</p>

      {post.image && (
        <div style={{ marginBottom: 14, borderRadius: 8, overflow: 'hidden' }}>
          <img
            src={`${STORAGE_URL}/${post.image}`}
            alt="Post"
            style={{ width: '100%', maxHeight: 400, objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13, color: '#888' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ background: '#377dff', borderRadius: '50%', width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="#fff" viewBox="0 0 20 20">
              <path d="M1 8.5C1 7.672 1.672 7 2.5 7H4v9H2.5A1.5 1.5 0 011 14.5v-6zM5 7l4-6h.5A2.5 2.5 0 0112 3.5V7h4.5A1.5 1.5 0 0118 8.5l-1 7A1.5 1.5 0 0115.5 17H5V7z" />
            </svg>
          </span>
          {likesCount}
        </span>
        <button
          onClick={handleToggleComments}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 13, padding: 0 }}
        >
          {post.comments_count ?? comments.length} Comments
        </button>
      </div>

      <hr style={{ margin: '8px 0', borderColor: '#f0f0f0' }} />

      {/* Action buttons */}
      <div className="_feed_inner_text_area_bottom" style={{ height: 48, marginTop: 0, borderRadius: 0, background: 'transparent', padding: '0 4px' }}>
        <div className="_feed_inner_text_area_item">
          <button
            onClick={handleLike}
            className="_feed_inner_text_area_bottom_photo_link _feed_common"
            style={{ color: liked ? '#377dff' : undefined, fontWeight: liked ? 600 : 400 }}
          >
            <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 20 20">
                <path fill={liked ? '#377dff' : '#666'} d="M1 8.5C1 7.672 1.672 7 2.5 7H4v9H2.5A1.5 1.5 0 011 14.5v-6zM5 7l4-6h.5A2.5 2.5 0 0112 3.5V7h4.5A1.5 1.5 0 0118 8.5l-1 7A1.5 1.5 0 0115.5 17H5V7z" />
              </svg>
            </span>
            {liked ? 'Liked' : 'Like'}
          </button>
        </div>
        <div className="_feed_inner_text_area_item">
          <button onClick={handleToggleComments} className="_feed_inner_text_area_bottom_photo_link _feed_common">
            <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 20 20">
                <path fill="#666" fillRule="evenodd" d="M10 2C5.6 2 2 5.3 2 9.4c0 2 .9 3.8 2.3 5.1L3 17.5l3.3-1.3A8.4 8.4 0 0010 17c4.4 0 8-3.4 8-7.6S14.4 2 10 2z" clipRule="evenodd" />
              </svg>
            </span>
            Comment
          </button>
        </div>
        <div className="_feed_inner_text_area_item">
          <button className="_feed_inner_text_area_bottom_photo_link _feed_common">
            <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path fill="#666" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
              </svg>
            </span>
            Share
          </button>
        </div>
      </div>

      {/* Comments */}
      {showComments && (
        <div style={{ marginTop: 14 }}>
          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
            <input
              className="form-control"
              style={{ fontSize: 13, borderRadius: 20, padding: '8px 16px' }}
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" className="_feed_inner_text_area_btn_link" style={{ whiteSpace: 'nowrap', padding: '8px 16px' }}>
              <span style={{ fontSize: 13 }}>Post</span>
            </button>
          </form>

          {loadingComments ? (
            <p style={{ fontSize: 13, color: '#888' }}>Loading comments...</p>
          ) : (
            comments.map((c) => <CommentItem key={c.id} comment={c} currentUserId={currentUserId} />)
          )}
        </div>
      )}
    </div>
  );
}
