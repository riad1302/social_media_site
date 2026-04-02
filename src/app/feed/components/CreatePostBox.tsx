'use client';

import { createPost } from '@/lib/api';
import type { Post, User } from '@/types';
import { useRef, useState } from 'react';
import Avatar from '@/components/Avatar';

export default function CreatePostBox({
  currentUser,
  onPost,
}: {
  currentUser: User;
  onPost: (post: Post) => void;
}) {
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content.trim());
      formData.append('visibility', visibility);
      if (image) formData.append('image', image);
      const res = await createPost(formData);
      onPost(res.post);
      setContent('');
      setVisibility('public');
      setImage(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = '';
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="_feed_inner_text_area _feed_inner_area _b_radious6 _mar_b16">
      <div className="_feed_inner_text_area_box" style={{ padding: '20px 20px 0' }}>
        <div className="_feed_inner_text_area_box_image" style={{ marginRight: 12 }}>
          <Avatar name={currentUser.name} />
        </div>
        <div className="_feed_inner_text_area_box_form" style={{ flex: 1 }}>
          <textarea
            className="_textarea form-control"
            placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            style={{ resize: 'none', fontSize: 14, border: 'none', background: 'transparent', padding: '8px 0', outline: 'none', boxShadow: 'none', width: '100%' }}
          />
        </div>
      </div>

      {preview && (
        <div style={{ padding: '0 20px 12px', position: 'relative', display: 'inline-block', marginLeft: 52 }}>
          <img src={preview} alt="preview" style={{ maxHeight: 180, borderRadius: 8 }} />
          <button
            type="button"
            onClick={() => { setImage(null); setPreview(null); }}
            style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontSize: 13 }}
          >×</button>
        </div>
      )}

      <div className="_feed_inner_text_area_bottom">
        <div className="_feed_inner_text_area_item">
          <button type="button" className="_feed_inner_text_area_bottom_photo_link _feed_common" onClick={() => fileRef.current?.click()}>
            <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 20 20">
                <path fill="#666" d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm.65 10.184l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51z" />
              </svg>
            </span>
            Photo
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />

          <button type="button" className="_feed_inner_text_area_bottom_photo_link _feed_common">
            <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 24 24">
                <path fill="#666" d="M15 8v8H5V8h10m1-2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4V7c0-.55-.45-1-1-1z" />
              </svg>
            </span>
            Video
          </button>

          <button type="button" className="_feed_inner_text_area_bottom_photo_link _feed_common">
            <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 24 24">
                <path fill="#666" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
              </svg>
            </span>
            Event
          </button>

          <button type="button" className="_feed_inner_text_area_bottom_photo_link _feed_common">
            <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 24 24">
                <path fill="#666" d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z" />
              </svg>
            </span>
            Article
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
            style={{ fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 8px', background: 'transparent', cursor: 'pointer' }}
          >
            <option value="public">🌍 Public</option>
            <option value="private">🔒 Private</option>
          </select>
          <button
            type="button"
            onClick={handleSubmit}
            className="_feed_inner_text_area_btn_link"
            disabled={loading || !content.trim()}
          >
            <span>{loading ? 'Posting...' : 'Post'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
