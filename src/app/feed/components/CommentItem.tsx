'use client';

import { addReply, toggleCommentLike } from '@/lib/api';
import { timeAgo } from '@/lib/utils';
import type { Comment, Reply } from '@/types';
import { useState } from 'react';
import Avatar from '@/components/Avatar';
import ReplyItem from './ReplyItem';

export default function CommentItem({
  comment,
  currentUserId,
}: {
  comment: Comment;
  currentUserId: number;
}) {
  const [likesCount, setLikesCount] = useState(comment.likes_count ?? comment.likes?.length ?? 0);
  const [liked, setLiked] = useState(comment.likes?.some((l) => l.user_id === currentUserId) ?? false);
  const [replies, setReplies] = useState<Reply[]>(comment.replies ?? []);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);

  async function handleLike() {
    const res = await toggleCommentLike(comment.id);
    setLikesCount(res.likes_count);
    setLiked(res.liked);
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim()) return;
    const res = await addReply(comment.id, replyText.trim());
    setReplies((prev) => [res.reply, ...prev]);
    setReplyText('');
    setShowReplies(true);
  }

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Avatar name={comment.user.name} size={36} />
        <div style={{ flex: 1 }}>
          <div className="_feed_inner_area" style={{ padding: '10px 14px', borderRadius: 8, margin: 0 }}>
            <strong style={{ fontSize: 13 }}>{comment.user.name}</strong>
            <p style={{ margin: '4px 0 0', fontSize: 13 }}>{comment.content}</p>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 4, fontSize: 12, color: '#888' }}>
            <button
              onClick={handleLike}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: liked ? '#377dff' : '#888',
                fontSize: 12,
                fontWeight: liked ? 600 : 400,
                padding: 0,
              }}
            >
              Like{likesCount > 0 ? ` · ${likesCount}` : ''}
            </button>
            <button
              onClick={() => setShowReplyInput((v) => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 12, padding: 0 }}
            >
              Reply
            </button>
            {replies.length > 0 && (
              <button
                onClick={() => setShowReplies((v) => !v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#377dff', fontSize: 12, padding: 0 }}
              >
                {showReplies ? 'Hide replies' : `${replies.length} repl${replies.length > 1 ? 'ies' : 'y'}`}
              </button>
            )}
            <span>{timeAgo(comment.created_at)}</span>
          </div>

          {showReplyInput && (
            <form onSubmit={handleReply} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input
                className="form-control"
                style={{ fontSize: 13 }}
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button type="submit" className="_feed_inner_text_area_btn_link" style={{ whiteSpace: 'nowrap', fontSize: 13 }}>
                <span>Reply</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {showReplies && replies.map((r) => (
        <ReplyItem key={r.id} reply={r} currentUserId={currentUserId} />
      ))}
    </div>
  );
}
