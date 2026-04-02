'use client';

import { toggleReplyLike } from '@/lib/api';
import { timeAgo } from '@/lib/utils';
import type { Reply } from '@/types';
import { useState } from 'react';
import Avatar from '@/components/Avatar';

export default function ReplyItem({
  reply,
  currentUserId,
}: {
  reply: Reply;
  currentUserId: number;
}) {
  const [likesCount, setLikesCount] = useState(reply.likes_count ?? reply.likes?.length ?? 0);
  const [liked, setLiked] = useState(reply.likes?.some((l) => l.user_id === currentUserId) ?? false);

  async function handleLike() {
    const res = await toggleReplyLike(reply.id);
    setLikesCount(res.likes_count);
    setLiked(res.liked);
  }

  return (
    <div style={{ paddingLeft: 48, marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Avatar name={reply.user.name} size={32} />
        <div style={{ flex: 1 }}>
          <div className="_feed_inner_area" style={{ padding: '8px 12px', borderRadius: 8, margin: 0 }}>
            <strong style={{ fontSize: 13 }}>{reply.user.name}</strong>
            <p style={{ margin: '3px 0 0', fontSize: 13 }}>{reply.content}</p>
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
            <span>{timeAgo(reply.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
