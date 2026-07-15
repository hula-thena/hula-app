import React, { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "./supabase.js";
import {
  Heart,
  MessageCircle,
  Search,
  Plus,
  X,
  Link as LinkIcon,
  PenLine,
  Calendar as CalendarIcon,
  LayoutList,
  ChevronLeft,
  ChevronRight,
  Tag as TagIcon,
  Send,
  Trash2,
  ExternalLink,
  ImagePlus,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  좋은 글 모임 — 공유 게시판                                          */
/*  20명 모임에서 좋은 글을 모으고 함께 읽는 앱                          */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  { id: "mission", label: "미션", color: "#7F77DD" },
  { id: "ssam", label: "쌤법문", color: "#1D9E75" },
  { id: "lovco", label: "럽코문장", color: "#D4537E" },
  { id: "doban", label: "도반법문", color: "#378ADD" },
  { id: "etc", label: "기타", color: "#888780" },
];

const catOf = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[4];

const LOGO = "data:image/png;base64,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";

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => Date.now();

/* ------------------------------------------------------------------ */
/*  Storage helpers — Supabase (글·댓글·좋아요가 모두에게 공유됨)         */
/* ------------------------------------------------------------------ */

/* 앱 안에서는 createdAt(카멜), DB에서는 created_at(스네이크)을 써서 둘 사이를 변환해요 */
function rowToPost(r) {
  return {
    id: r.id,
    type: r.type,
    author: r.author,
    title: r.title || "",
    body: r.body || "",
    url: r.url || "",
    image: r.image || "",
    category: r.category || "etc",
    tags: r.tags || [],
    likes: r.likes || [],
    comments: r.comments || [],
    createdAt: Number(r.created_at) || now(),
    editedAt: r.edited_at ? Number(r.edited_at) : null,
  };
}
function postToRow(p) {
  return {
    id: p.id,
    type: p.type,
    author: p.author,
    title: p.title || "",
    body: p.body || "",
    url: p.url || "",
    image: p.image || "",
    category: p.category || "etc",
    tags: p.tags || [],
    likes: p.likes || [],
    comments: p.comments || [],
    created_at: p.createdAt || now(),
    edited_at: p.editedAt || null,
  };
}

async function loadPosts() {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(rowToPost);
  } catch (e) {
    console.error("글을 불러오지 못했어요", e);
    return [];
  }
}

/* 글 하나를 새로 올리거나(있으면) 덮어씁니다 */
async function upsertPost(post) {
  try {
    await supabase.from("posts").upsert(postToRow(post));
  } catch (e) {
    console.error("저장에 실패했어요", e);
  }
}

async function deletePostRow(id) {
  try {
    await supabase.from("posts").delete().eq("id", id);
  } catch (e) {
    console.error("삭제에 실패했어요", e);
  }
}

async function loadTagline() {
  try {
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "tagline")
      .maybeSingle();
    return data ? data.value : null;
  } catch (e) {
    return null;
  }
}

async function saveTaglineRow(text) {
  try {
    await supabase.from("settings").upsert({ key: "tagline", value: text });
  } catch (e) {
    console.error("부제목 저장 실패", e);
  }
}

/* ------------------------------------------------------------------ */
/*  Small utilities                                                    */
/* ------------------------------------------------------------------ */

function timeAgo(ts) {
  const s = Math.floor((now() - ts) / 1000);
  if (s < 60) return "방금";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}일 전`;
  const dt = new Date(ts);
  return `${dt.getMonth() + 1}월 ${dt.getDate()}일`;
}

function initials(name) {
  return (name || "?").trim().slice(0, 2);
}

/* deterministic soft color from name */
function avatarColor(name) {
  let h = 0;
  for (let i = 0; i < (name || "").length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return `hsl(${h} 42% 88%)`;
}
function avatarText(name) {
  let h = 0;
  for (let i = 0; i < (name || "").length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return `hsl(${h} 45% 32%)`;
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function GoodReads() {
  const [posts, setPosts] = useState(null);
  const [me, setMe] = useState("");
  const [askName, setAskName] = useState(false);

  const [view, setView] = useState("feed"); // feed | calendar
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [activeTag, setActiveTag] = useState(null);
  const [tagline, setTagline] = useState("참회와 감사, 자각과 자기사랑");
  const [editingTagline, setEditingTagline] = useState(false);

  const [composing, setComposing] = useState(false);
  const [showMoney, setShowMoney] = useState(true);
  const [calMonth, setCalMonth] = useState(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const [openPost, setOpenPost] = useState(null); // id of expanded post in calendar

  /* load */
  useEffect(() => {
    let live = true;
    loadPosts().then((p) => {
      if (!live) return;
      setPosts(p);
    });
    loadTagline().then((t) => {
      if (live && t) setTagline(t);
    });
    const stored = typeof window !== "undefined" ? window.__me : null;
    if (stored) setMe(stored);
    else setAskName(true);
    return () => {
      live = false;
    };
  }, []);

  const saveTagline = useCallback((text) => {
    const t = text.trim() || "참회와 감사, 자각과 자기사랑";
    setTagline(t);
    setEditingTagline(false);
    saveTaglineRow(t);
  }, []);

  /* derived: all tags */
  const allTags = useMemo(() => {
    if (!posts) return [];
    const counts = {};
    posts.forEach((p) => (p.tags || []).forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([t, n]) => ({ t, n }));
  }, [posts]);

  /* derived: filtered + sorted feed */
  const filtered = useMemo(() => {
    if (!posts) return [];
    const q = query.trim().toLowerCase();
    return posts
      .filter((p) => {
        if (activeCat !== "all" && p.category !== activeCat) return false;
        if (activeTag && !(p.tags || []).includes(activeTag)) return false;
        if (q) {
          const hay = `${p.title} ${p.body} ${p.author} ${(p.tags || []).join(" ")}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [posts, query, activeCat, activeTag]);

  /* 다른 사람이 올린 글이 보이도록 주기적으로 새로고침 (12초마다) */
  useEffect(() => {
    const t = setInterval(() => {
      loadPosts().then((p) => setPosts(p));
    }, 12000);
    return () => clearInterval(t);
  }, []);

  /* actions — 화면을 먼저 바꾸고, 바뀐 글만 Supabase에 저장 */
  function addPost(data) {
    const p = {
      id: uid(),
      author: me || "익명",
      likes: [],
      comments: [],
      createdAt: now(),
      ...data,
    };
    setPosts([p, ...(posts || [])]);
    upsertPost(p);
    setComposing(false);
  }

  function toggleLike(id) {
    let changed = null;
    const next = (posts || []).map((p) => {
      if (p.id !== id) return p;
      const has = p.likes.includes(me);
      changed = { ...p, likes: has ? p.likes.filter((n) => n !== me) : [...p.likes, me] };
      return changed;
    });
    setPosts(next);
    if (changed) upsertPost(changed);
  }

  function addComment(id, body) {
    if (!body.trim()) return;
    let changed = null;
    const next = (posts || []).map((p) => {
      if (p.id !== id) return p;
      changed = {
        ...p,
        comments: [...p.comments, { id: uid(), author: me || "익명", body: body.trim(), createdAt: now() }],
      };
      return changed;
    });
    setPosts(next);
    if (changed) upsertPost(changed);
  }

  function editPost(id, patch) {
    let changed = null;
    const next = (posts || []).map((p) => {
      if (p.id !== id) return p;
      changed = { ...p, ...patch, editedAt: now() };
      return changed;
    });
    setPosts(next);
    if (changed) upsertPost(changed);
  }

  function deletePost(id) {
    setPosts((posts || []).filter((p) => p.id !== id));
    deletePostRow(id);
    setOpenPost(null);
  }

  /* loading */
  if (posts === null) {
    return (
      <div style={S.shell}>
        <div style={{ ...S.center, color: C.textSec }}>불러오는 중…</div>
      </div>
    );
  }

  return (
    <div style={S.shell}>
      <style>{CSS}</style>

      {showMoney && <MoneyRain />}

      {askName && <NamePrompt onDone={(n) => { setMe(n); window.__me = n; setAskName(false); }} />}

      {/* Header */}
      <header style={S.header}>
        <div style={S.brandRow}>
          <div style={S.brandLeft}>
            <img src={LOGO} alt="훌라 로고" style={S.logo} />
            <div>
              <h1 style={S.brand}>훌라</h1>
              {editingTagline ? (
                <input
                  autoFocus
                  style={S.taglineInput}
                  defaultValue={tagline}
                  onBlur={(e) => saveTagline(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveTagline(e.target.value);
                    if (e.key === "Escape") setEditingTagline(false);
                  }}
                />
              ) : (
                <p style={S.tagline}>
                  {tagline}
                  <button
                    style={S.taglineEdit}
                    onClick={() => setEditingTagline(true)}
                    aria-label="부제목 수정"
                    title="부제목 수정"
                  >
                    <PenLine size={12} />
                  </button>
                </p>
              )}
            </div>
          </div>
          <div style={S.headRight}>
            {me && (
              <div style={S.meChip} title="나">
                <span style={{ ...S.avatar, background: avatarColor(me), color: avatarText(me) }}>
                  {initials(me)}
                </span>
                {me}
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div style={S.searchWrap}>
          <Search size={16} color={C.textTer} />
          <input
            style={S.searchInput}
            placeholder="제목, 내용, 작성자, 태그 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button style={S.searchClear} onClick={() => setQuery("")} aria-label="검색 지우기">
              <X size={14} />
            </button>
          )}
        </div>

        {/* View toggle */}
        <div style={S.viewToggle}>
          <button
            style={{ ...S.viewBtn, ...(view === "feed" ? S.viewBtnOn : {}) }}
            onClick={() => setView("feed")}
          >
            <LayoutList size={15} /> 모아보기
          </button>
          <button
            style={{ ...S.viewBtn, ...(view === "calendar" ? S.viewBtnOn : {}) }}
            onClick={() => setView("calendar")}
          >
            <CalendarIcon size={15} /> 달력
          </button>
        </div>

        {/* Category filter */}
        <div style={S.catRow}>
          <button
            style={{ ...S.catChip, ...(activeCat === "all" ? S.catChipOn : {}) }}
            onClick={() => setActiveCat("all")}
          >
            전체
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              style={{
                ...S.catChip,
                ...(activeCat === c.id
                  ? { background: c.color, color: "#fff", borderColor: c.color }
                  : {}),
              }}
              onClick={() => setActiveCat(activeCat === c.id ? "all" : c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Active tag pill */}
        {activeTag && (
          <div style={S.activeTagRow}>
            <span style={S.activeTagPill}>
              #{activeTag}
              <button onClick={() => setActiveTag(null)} style={S.activeTagX} aria-label="태그 해제">
                <X size={12} />
              </button>
            </span>
          </div>
        )}
      </header>

      {/* Body */}
      <main style={S.main}>
        {view === "feed" ? (
          <Feed
            posts={filtered}
            me={me}
            onLike={toggleLike}
            onComment={addComment}
            onTag={(t) => setActiveTag(t)}
            onDelete={deletePost}
            onEdit={editPost}
          />
        ) : (
          <CalendarView
            posts={posts}
            month={calMonth}
            setMonth={setCalMonth}
            openPost={openPost}
            setOpenPost={setOpenPost}
            me={me}
            onLike={toggleLike}
            onComment={addComment}
            onTag={(t) => { setActiveTag(t); setView("feed"); }}
            onDelete={deletePost}
            onEdit={editPost}
          />
        )}

        {/* Popular tags */}
        {allTags.length > 0 && view === "feed" && (
          <aside style={S.tagCloud}>
            <div style={S.tagCloudHead}><TagIcon size={14} /> 자주 쓴 태그</div>
            <div style={S.tagCloudList}>
              {allTags.slice(0, 14).map(({ t, n }) => (
                <button
                  key={t}
                  style={{
                    ...S.cloudTag,
                    ...(activeTag === t ? S.cloudTagOn : {}),
                  }}
                  onClick={() => setActiveTag(activeTag === t ? null : t)}
                >
                  #{t} <span style={S.cloudCount}>{n}</span>
                </button>
              ))}
            </div>
          </aside>
        )}
      </main>

      {/* FAB */}
      <button style={S.fab} onClick={() => setComposing(true)} aria-label="새 글 올리기">
        <Plus size={22} />
      </button>

      {/* Composer */}
      {composing && <Composer onClose={() => setComposing(false)} onSubmit={addPost} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Money rain (plays once on open)                                    */
/* ------------------------------------------------------------------ */
function MoneyRain() {
  const bills = Array.from({ length: 26 });
  return (
    <div style={S.moneyLayer} aria-hidden="true">
      {bills.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 1.8;
        const dur = 2.6 + Math.random() * 1.8;
        const size = 26 + Math.random() * 14;
        const sway = (Math.random() * 2 - 1) * 40;
        return (
          <span
            key={i}
            className="gr-bill"
            style={{
              left: `${left}%`,
              fontSize: size,
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
              "--sway": `${sway}px`,
            }}
          >
            💸
          </span>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Name prompt                                                        */
/* ------------------------------------------------------------------ */
function NamePrompt({ onDone }) {
  const [v, setV] = useState("");
  return (
    <div style={S.overlay}>
      <div style={S.modal}>
        <h2 style={S.modalTitle}>반가워요</h2>
        <p style={{ color: C.textSec, fontSize: 14, margin: "0 0 16px", lineHeight: 1.6 }}>
          모임에서 쓸 닉네임을 알려주세요. 글과 댓글에 이 닉네임으로 표시돼요.
        </p>
        <input
          autoFocus
          style={S.input}
          placeholder="닉네임"
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && v.trim() && onDone(v.trim())}
        />
        <button
          style={{ ...S.primaryBtn, marginTop: 14, width: "100%", opacity: v.trim() ? 1 : 0.5 }}
          disabled={!v.trim()}
          onClick={() => v.trim() && onDone(v.trim())}
        >
          시작하기
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Feed                                                               */
/* ------------------------------------------------------------------ */
function Feed({ posts, me, onLike, onComment, onTag, onDelete, onEdit }) {
  if (posts.length === 0) {
    return (
      <div style={S.empty}>
        <PenLine size={28} color={C.textTer} />
        <p style={{ fontWeight: 500, margin: "12px 0 4px" }}>아직 글이 없어요</p>
        <p style={{ color: C.textSec, fontSize: 14 }}>오른쪽 아래 + 버튼으로 첫 글을 남겨보세요.</p>
      </div>
    );
  }
  return (
    <div style={S.feed}>
      {posts.map((p) => (
        <PostCard
          key={p.id}
          post={p}
          me={me}
          onLike={onLike}
          onComment={onComment}
          onTag={onTag}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Edit card — 글 수정                                                */
/* ------------------------------------------------------------------ */
function EditCard({ post, onCancel, onSave }) {
  const [title, setTitle] = useState(post.title || "");
  const [body, setBody] = useState(post.body || "");
  const [url, setUrl] = useState(post.url || "");
  const [image, setImage] = useState(post.image || "");
  const [category, setCategory] = useState(post.category || "etc");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(post.tags || []);

  function handleImage(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert("이미지가 너무 커요. 4MB 이하로 올려주세요.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result);
    reader.readAsDataURL(file);
  }

  function addTag() {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !tags.includes(t) && tags.length < 6) {
      setTags([...tags, t]);
      setTagInput("");
    }
  }

  const canSave = post.type === "link" ? url.trim() : (body.trim() || image);

  return (
    <article style={{ ...S.card, borderColor: C.accent }}>
      <div style={S.editHead}>
        <span style={S.editBadge}>글 수정</span>
        <button style={S.iconBtn} onClick={onCancel} aria-label="취소">
          <X size={16} />
        </button>
      </div>

      <input
        style={S.input}
        placeholder="제목 (선택)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {post.type === "link" && (
        <input
          style={{ ...S.input, marginTop: 10 }}
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      )}

      <textarea
        style={{ ...S.input, marginTop: 10, minHeight: 100, resize: "vertical", lineHeight: 1.6 }}
        placeholder="내용"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <div style={{ marginTop: 12 }}>
        {image ? (
          <div style={{ position: "relative" }}>
            <img src={image} alt="미리보기" style={{ width: "100%", borderRadius: 11, display: "block", border: `0.5px solid ${C.border}` }} />
            <button style={S.imageRemove} onClick={() => setImage("")} aria-label="이미지 제거">
              <X size={16} />
            </button>
          </div>
        ) : (
          <label style={S.imageUpload}>
            <ImagePlus size={18} />
            <span>사진 / 글귀 카드 이미지 올리기</span>
            <input type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
          </label>
        )}
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={S.fieldLabel}>분류</div>
        <div style={S.catRow}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              style={{
                ...S.catChip,
                ...(category === c.id ? { background: c.color, color: "#fff", borderColor: c.color } : {}),
              }}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={S.fieldLabel}>태그 (최대 6개)</div>
        <div style={S.tagInputRow}>
          <input
            style={{ ...S.input, flex: 1 }}
            placeholder="태그 입력 후 Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          />
          <button style={S.addTagBtn} onClick={addTag}>추가</button>
        </div>
        {tags.length > 0 && (
          <div style={{ ...S.tagRow, marginTop: 8 }}>
            {tags.map((t) => (
              <span key={t} style={S.draftTag}>
                #{t}
                <button style={S.draftTagX} onClick={() => setTags(tags.filter((x) => x !== t))} aria-label="태그 제거">
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={S.editBtnRow}>
        <button style={S.cancelBtn} onClick={onCancel}>취소</button>
        <button
          style={{ ...S.primaryBtn, flex: 1, opacity: canSave ? 1 : 0.4 }}
          disabled={!canSave}
          onClick={() =>
            onSave({
              title: title.trim(),
              body: body.trim(),
              url: post.type === "link" ? url.trim() : "",
              image,
              category,
              tags,
            })
          }
        >
          저장
        </button>
      </div>
    </article>
  );
}

function PostCard({ post, me, onLike, onComment, onTag, onDelete, onEdit }) {
  const [showComments, setShowComments] = useState(false);
  const [draft, setDraft] = useState("");
  const [confirmDel, setConfirmDel] = useState(false);
  const [delName, setDelName] = useState("");
  const [editing, setEditing] = useState(false);
  const cat = catOf(post.category);
  const liked = post.likes.includes(me);
  const mine = post.author === me;

  const nameOk = delName.trim() === post.author;

  if (editing) {
    return (
      <EditCard
        post={post}
        onCancel={() => setEditing(false)}
        onSave={(patch) => {
          onEdit(post.id, patch);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <article style={S.card}>
      <div style={S.cardHead}>
        <span style={{ ...S.avatar, background: avatarColor(post.author), color: avatarText(post.author) }}>
          {initials(post.author)}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={S.cardMetaRow}>
            <span style={S.author}>{post.author}</span>
            <span style={S.dot}>·</span>
            <span style={S.time}>{timeAgo(post.createdAt)}</span>
            {post.editedAt && <span style={S.edited}>(수정됨)</span>}
          </div>
        </div>
        <span style={{ ...S.catTag, color: cat.color, borderColor: cat.color }}>{cat.label}</span>
        {mine && (
          <>
            <button style={S.iconBtn} onClick={() => setEditing(true)} aria-label="수정" title="수정">
              <PenLine size={15} />
            </button>
            <button
              style={S.iconBtn}
              onClick={() => { setConfirmDel(true); setDelName(""); }}
              aria-label="삭제"
              title="삭제"
            >
              <Trash2 size={15} />
            </button>
          </>
        )}
      </div>

      {confirmDel && (
        <div style={S.confirmBox}>
          <p style={S.confirmTitle}>이 글을 정말 삭제할까요?</p>
          <p style={S.confirmDesc}>
            삭제하면 되돌릴 수 없어요. 확인을 위해 본인 닉네임 <b>{post.author}</b> 을(를) 그대로 입력해주세요.
          </p>
          <input
            autoFocus
            style={S.confirmInput}
            placeholder="닉네임 입력"
            value={delName}
            onChange={(e) => setDelName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && nameOk) onDelete(post.id); }}
          />
          <div style={S.confirmBtnRow}>
            <button style={S.cancelBtn} onClick={() => setConfirmDel(false)}>
              취소
            </button>
            <button
              style={{ ...S.deleteBtn, opacity: nameOk ? 1 : 0.4, cursor: nameOk ? "pointer" : "default" }}
              disabled={!nameOk}
              onClick={() => onDelete(post.id)}
            >
              삭제
            </button>
          </div>
        </div>
      )}

      {post.title && <h3 style={S.cardTitle}>{post.title}</h3>}
      {post.body && <p style={S.cardBody}>{post.body}</p>}

      {post.image && (
        <img src={post.image} alt={post.title || "이미지"} style={S.cardImage} />
      )}

      {post.type === "link" && post.url && (
        <a href={post.url} target="_blank" rel="noreferrer" style={S.linkBox}>
          <LinkIcon size={14} />
          <span style={S.linkUrl}>{post.url.replace(/^https?:\/\//, "")}</span>
          <ExternalLink size={13} style={{ marginLeft: "auto", opacity: 0.6 }} />
        </a>
      )}

      {(post.tags || []).length > 0 && (
        <div style={S.tagRow}>
          {post.tags.map((t) => (
            <button key={t} style={S.tag} onClick={() => onTag(t)}>
              #{t}
            </button>
          ))}
        </div>
      )}

      <div style={S.actions}>
        <button
          style={{ ...S.actBtn, ...(liked ? S.actBtnLiked : {}) }}
          onClick={() => onLike(post.id)}
        >
          <Heart size={16} fill={liked ? "#D4537E" : "none"} />
          {post.likes.length > 0 && <span>{post.likes.length}</span>}
        </button>
        <button
          style={{ ...S.actBtn, ...(showComments ? S.actBtnOn : {}) }}
          onClick={() => setShowComments((s) => !s)}
        >
          <MessageCircle size={16} />
          {post.comments.length > 0 && <span>{post.comments.length}</span>}
        </button>
      </div>

      {showComments && (
        <div style={S.commentArea}>
          {post.comments.map((c) => (
            <div key={c.id} style={S.comment}>
              <span style={{ ...S.cAvatar, background: avatarColor(c.author), color: avatarText(c.author) }}>
                {initials(c.author)}
              </span>
              <div style={{ flex: 1 }}>
                <div style={S.cMeta}>
                  <span style={S.cAuthor}>{c.author}</span>
                  <span style={S.time}>{timeAgo(c.createdAt)}</span>
                </div>
                <p style={S.cBody}>{c.body}</p>
              </div>
            </div>
          ))}
          <div style={S.commentInputRow}>
            <input
              style={S.commentInput}
              placeholder="댓글 달기…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && draft.trim()) {
                  onComment(post.id, draft);
                  setDraft("");
                }
              }}
            />
            <button
              style={S.sendBtn}
              onClick={() => {
                if (draft.trim()) {
                  onComment(post.id, draft);
                  setDraft("");
                }
              }}
              aria-label="댓글 등록"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Calendar view                                                      */
/* ------------------------------------------------------------------ */
function CalendarView({ posts, month, setMonth, openPost, setOpenPost, me, onLike, onComment, onTag, onDelete, onEdit }) {
  const { y, m } = month;
  const first = new Date(y, m, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const byDay = useMemo(() => {
    const map = {};
    posts.forEach((p) => {
      const d = new Date(p.createdAt);
      if (d.getFullYear() === y && d.getMonth() === m) {
        const day = d.getDate();
        (map[day] = map[day] || []).push(p);
      }
    });
    return map;
  }, [posts, y, m]);

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prev = () => setMonth(m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 });
  const next = () => setMonth(m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 });

  const todayKey = (() => {
    const t = new Date();
    return t.getFullYear() === y && t.getMonth() === m ? t.getDate() : -1;
  })();

  const selectedPosts = openPost != null ? byDay[openPost] || [] : [];

  return (
    <div style={S.calWrap}>
      <div style={S.calHead}>
        <button style={S.calNav} onClick={prev} aria-label="이전 달"><ChevronLeft size={18} /></button>
        <span style={S.calTitle}>{y}년 {m + 1}월</span>
        <button style={S.calNav} onClick={next} aria-label="다음 달"><ChevronRight size={18} /></button>
      </div>

      <div style={S.calGridHead}>
        {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
          <div key={d} style={{ ...S.calDow, color: i === 0 ? "#D4537E" : i === 6 ? "#378ADD" : C.textTer }}>
            {d}
          </div>
        ))}
      </div>

      <div style={S.calGrid}>
        {cells.map((d, i) => {
          if (d === null) return <div key={"e" + i} style={S.calEmpty} />;
          const items = byDay[d] || [];
          const isToday = d === todayKey;
          const isSel = d === openPost;
          return (
            <button
              key={d}
              style={{
                ...S.calCell,
                ...(items.length ? S.calCellHas : {}),
                ...(isToday ? S.calCellToday : {}),
                ...(isSel ? S.calCellSel : {}),
              }}
              onClick={() => setOpenPost(items.length ? (isSel ? null : d) : null)}
            >
              <span style={{ ...S.calNum, ...(isToday ? { color: "#7F77DD", fontWeight: 600 } : {}) }}>
                {d}
              </span>
              {items.length > 0 && (
                <div style={S.calDots}>
                  {items.slice(0, 3).map((p) => (
                    <span key={p.id} style={{ ...S.calDotMark, background: catOf(p.category).color }} />
                  ))}
                  {items.length > 3 && <span style={S.calMore}>+{items.length - 3}</span>}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {openPost != null && selectedPosts.length > 0 && (
        <div style={S.calDetail}>
          <div style={S.calDetailHead}>
            {m + 1}월 {openPost}일 · {selectedPosts.length}개의 글
          </div>
          {selectedPosts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              me={me}
              onLike={onLike}
              onComment={onComment}
              onTag={onTag}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}

      {openPost == null && (
        <p style={{ textAlign: "center", color: C.textTer, fontSize: 13, marginTop: 16 }}>
          색깔 점이 있는 날짜를 눌러 그날의 글을 펼쳐보세요.
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Composer                                                           */
/* ------------------------------------------------------------------ */
function Composer({ onClose, onSubmit }) {
  const [type, setType] = useState("write"); // write | link
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("mission");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  function handleImage(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert("이미지가 너무 커요. 4MB 이하로 올려주세요.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result);
    reader.readAsDataURL(file);
  }

  function addTag() {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !tags.includes(t) && tags.length < 6) {
      setTags([...tags, t]);
      setTagInput("");
    }
  }

  const canSubmit = type === "write" ? (body.trim() || image) : url.trim();

  function submit() {
    if (!canSubmit) return;
    onSubmit({
      type,
      title: title.trim(),
      body: body.trim(),
      url: type === "link" ? url.trim() : "",
      image,
      category,
      tags,
    });
  }

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.composer} onClick={(e) => e.stopPropagation()}>
        <div style={S.composerHead}>
          <h2 style={S.modalTitle}>좋은 글 나누기</h2>
          <button style={S.iconBtn} onClick={onClose} aria-label="닫기"><X size={18} /></button>
        </div>

        <div style={S.typeToggle}>
          <button
            style={{ ...S.typeBtn, ...(type === "write" ? S.typeBtnOn : {}) }}
            onClick={() => setType("write")}
          >
            <PenLine size={15} /> 직접 쓰기
          </button>
          <button
            style={{ ...S.typeBtn, ...(type === "link" ? S.typeBtnOn : {}) }}
            onClick={() => setType("link")}
          >
            <LinkIcon size={15} /> 링크 공유
          </button>
        </div>

        <input
          style={S.input}
          placeholder="제목 (선택)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {type === "link" && (
          <input
            style={{ ...S.input, marginTop: 10 }}
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        )}

        <textarea
          style={{ ...S.input, marginTop: 10, minHeight: 110, resize: "vertical", lineHeight: 1.6 }}
          placeholder={type === "write" ? "나누고 싶은 글이나 생각을 적어주세요" : "이 글을 왜 추천하는지 한마디 (선택)"}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        {/* image */}
        <div style={{ marginTop: 12 }}>
          {image ? (
            <div style={{ position: "relative" }}>
              <img src={image} alt="미리보기" style={{ width: "100%", borderRadius: 11, display: "block", border: `0.5px solid ${C.border}` }} />
              <button
                style={S.imageRemove}
                onClick={() => setImage("")}
                aria-label="이미지 제거"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label style={S.imageUpload}>
              <ImagePlus size={18} />
              <span>사진 / 글귀 카드 이미지 올리기</span>
              <input type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
            </label>
          )}
        </div>

        {/* category */}
        <div style={{ marginTop: 14 }}>
          <div style={S.fieldLabel}>분류</div>
          <div style={S.catRow}>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                style={{
                  ...S.catChip,
                  ...(category === c.id ? { background: c.color, color: "#fff", borderColor: c.color } : {}),
                }}
                onClick={() => setCategory(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* tags */}
        <div style={{ marginTop: 14 }}>
          <div style={S.fieldLabel}>태그 (최대 6개)</div>
          <div style={S.tagInputRow}>
            <input
              style={{ ...S.input, flex: 1 }}
              placeholder="태그 입력 후 Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            />
            <button style={S.addTagBtn} onClick={addTag}>추가</button>
          </div>
          {tags.length > 0 && (
            <div style={{ ...S.tagRow, marginTop: 8 }}>
              {tags.map((t) => (
                <span key={t} style={S.draftTag}>
                  #{t}
                  <button style={S.draftTagX} onClick={() => setTags(tags.filter((x) => x !== t))} aria-label="태그 제거">
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          style={{ ...S.primaryBtn, marginTop: 18, width: "100%", opacity: canSubmit ? 1 : 0.5 }}
          disabled={!canSubmit}
          onClick={submit}
        >
          올리기
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Theme + styles                                                     */
/* ------------------------------------------------------------------ */
const C = {
  bg: "#FAFAFA",
  surface: "#FFFFFF",
  ink: "#1A1A1A",
  textSec: "#5A5A5A",
  textTer: "#8E8E8E",
  border: "rgba(0,0,0,0.08)",
  borderStrong: "rgba(0,0,0,0.14)",
  accent: "#7F77DD",
};

const CSS = `
  * { box-sizing: border-box; }
  .gr-root ::-webkit-scrollbar { width: 8px; height: 8px; }
  .gr-root ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 4px; }
  input:focus, textarea:focus { outline: none; border-color: ${C.accent} !important; }
  button { font-family: inherit; cursor: pointer; }
  @keyframes pop { from { transform: scale(.96); opacity: 0 } to { transform: scale(1); opacity: 1 } }
  @keyframes gr-fall {
    0% { transform: translateY(-12vh) translateX(0) rotate(0deg); opacity: 0; }
    8% { opacity: 1; }
    100% { transform: translateY(112vh) translateX(var(--sway)) rotate(360deg); opacity: 1; }
  }
  .gr-bill {
    position: absolute;
    top: 0;
    animation-name: gr-fall;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
    will-change: transform;
    user-select: none;
  }`;

const S = {
  shell: {
    fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    background: C.bg,
    color: C.ink,
    minHeight: "100vh",
    maxWidth: 620,
    margin: "0 auto",
    position: "relative",
    paddingBottom: 90,
  },
  moneyLayer: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    overflow: "hidden",
    zIndex: 9999,
  },
  center: { padding: 60, textAlign: "center" },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    background: C.bg,
    padding: "20px 18px 12px",
    borderBottom: `0.5px solid ${C.border}`,
  },
  brandRow: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 },
  brandLeft: { display: "flex", alignItems: "center", gap: 11 },
  logo: { width: 44, height: "auto", borderRadius: 8, flexShrink: 0 },
  brand: { margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em" },
  tagline: { margin: "2px 0 0", fontSize: 13, color: C.textSec, display: "flex", alignItems: "center", gap: 6 },
  taglineEdit: { border: "none", background: "transparent", color: C.textTer, display: "inline-flex", padding: 2, cursor: "pointer", borderRadius: 4 },
  taglineInput: { marginTop: 2, fontSize: 13, color: C.ink, border: `0.5px solid ${C.borderStrong}`, borderRadius: 8, padding: "4px 8px", background: C.surface, fontFamily: "inherit", width: 220 },
  headRight: { display: "flex", alignItems: "center" },
  meChip: {
    display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 500,
    color: C.textSec, background: C.surface, padding: "5px 12px 5px 5px", borderRadius: 20,
    border: `0.5px solid ${C.border}`,
  },

  searchWrap: {
    display: "flex", alignItems: "center", gap: 8, background: C.surface,
    border: `0.5px solid ${C.border}`, borderRadius: 12, padding: "0 12px", height: 42,
  },
  searchInput: { flex: 1, border: "none", background: "transparent", fontSize: 14, color: C.ink, height: "100%" },
  searchClear: { border: "none", background: "transparent", color: C.textTer, display: "flex", padding: 4 },

  viewToggle: { display: "flex", gap: 6, marginTop: 12 },
  viewBtn: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    height: 38, border: `0.5px solid ${C.border}`, background: C.surface, borderRadius: 10,
    fontSize: 13.5, fontWeight: 500, color: C.textSec,
  },
  viewBtnOn: { background: C.ink, color: "#fff", borderColor: C.ink },

  catRow: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 },
  catChip: {
    fontSize: 13, padding: "6px 13px", borderRadius: 18, border: `0.5px solid ${C.borderStrong}`,
    background: C.surface, color: C.textSec, fontWeight: 500,
  },
  catChipOn: { background: C.ink, color: "#fff", borderColor: C.ink },

  activeTagRow: { marginTop: 10 },
  activeTagPill: {
    display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 500,
    background: "#EEEDFE", color: "#534AB7", padding: "5px 6px 5px 11px", borderRadius: 16,
  },
  activeTagX: { border: "none", background: "rgba(83,74,183,0.15)", color: "#534AB7", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" },

  main: { padding: "16px 18px 0" },

  feed: { display: "flex", flexDirection: "column", gap: 14 },

  card: {
    background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 16,
    padding: "16px 18px", animation: "pop .18s ease",
  },
  cardHead: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  avatar: {
    width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: 13, fontWeight: 600, flexShrink: 0,
  },
  cardMetaRow: { display: "flex", alignItems: "center", gap: 6 },
  author: { fontSize: 14, fontWeight: 600 },
  dot: { color: C.textTer },
  time: { fontSize: 12.5, color: C.textTer },
  catTag: { fontSize: 12, fontWeight: 600, padding: "3px 9px", borderRadius: 12, border: "1px solid", lineHeight: 1.3 },

  cardTitle: { margin: "2px 0 8px", fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.35 },
  cardBody: { margin: "0 0 12px", fontSize: 15, lineHeight: 1.7, color: "#3a3a37", whiteSpace: "pre-wrap" },
  cardImage: { width: "100%", borderRadius: 12, marginBottom: 12, display: "block", border: `0.5px solid ${C.border}` },

  linkBox: {
    display: "flex", alignItems: "center", gap: 8, textDecoration: "none",
    background: "#F5F5F5", border: `0.5px solid ${C.border}`, borderRadius: 10,
    padding: "10px 12px", fontSize: 13, color: "#534AB7", marginBottom: 12, fontWeight: 500,
  },
  linkUrl: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },

  tagRow: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 },
  tag: { fontSize: 12.5, color: C.textSec, background: "transparent", border: "none", padding: "2px 0", fontWeight: 500 },

  actions: { display: "flex", gap: 16, marginTop: 8, paddingTop: 10, borderTop: `0.5px solid ${C.border}` },
  actBtn: {
    display: "flex", alignItems: "center", gap: 6, border: "none", background: "transparent",
    color: C.textSec, fontSize: 13.5, fontWeight: 500, padding: "2px 0",
  },
  actBtnLiked: { color: "#D4537E" },
  actBtnOn: { color: C.accent },

  commentArea: { marginTop: 12, paddingTop: 12, borderTop: `0.5px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 12 },
  comment: { display: "flex", gap: 9 },
  cAvatar: { width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0 },
  cMeta: { display: "flex", alignItems: "center", gap: 6, marginBottom: 1 },
  cAuthor: { fontSize: 13, fontWeight: 600 },
  cBody: { margin: 0, fontSize: 14, lineHeight: 1.55, color: "#3a3a37", whiteSpace: "pre-wrap" },
  commentInputRow: { display: "flex", gap: 8, alignItems: "center" },
  commentInput: { flex: 1, height: 38, border: `0.5px solid ${C.border}`, borderRadius: 10, padding: "0 12px", fontSize: 14, background: "#F7F7F7" },
  sendBtn: { width: 38, height: 38, borderRadius: 10, border: "none", background: C.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },

  iconBtn: { border: "none", background: "transparent", color: C.textTer, display: "flex", padding: 6, borderRadius: 8 },

  edited: { fontSize: 11.5, color: C.textTer },

  /* 삭제 확인 */
  confirmBox: {
    background: "#FFF4F4", border: "1px solid #F09595", borderRadius: 12,
    padding: "14px 15px", marginBottom: 12,
  },
  confirmTitle: { margin: "0 0 6px", fontSize: 14.5, fontWeight: 700, color: "#A32D2D" },
  confirmDesc: { margin: "0 0 10px", fontSize: 13, lineHeight: 1.6, color: "#793030" },
  confirmInput: {
    width: "100%", border: "0.5px solid #E0A0A0", borderRadius: 9, padding: "9px 12px",
    fontSize: 14, background: "#fff", fontFamily: "inherit", boxSizing: "border-box",
  },
  confirmBtnRow: { display: "flex", gap: 8, marginTop: 10 },
  cancelBtn: {
    padding: "9px 16px", borderRadius: 9, border: `0.5px solid ${C.borderStrong}`,
    background: C.surface, fontSize: 13.5, fontWeight: 500, color: C.textSec, cursor: "pointer",
  },
  deleteBtn: {
    flex: 1, padding: "9px 16px", borderRadius: 9, border: "none",
    background: "#E24B4A", color: "#fff", fontSize: 13.5, fontWeight: 600,
  },

  /* 수정 모드 */
  editHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  editBadge: {
    fontSize: 12, fontWeight: 600, color: "#534AB7", background: "#EEEDFE",
    padding: "4px 10px", borderRadius: 12,
  },
  editBtnRow: { display: "flex", gap: 8, marginTop: 16 },

  /* tag cloud */
  tagCloud: { marginTop: 22, paddingTop: 18, borderTop: `0.5px solid ${C.border}` },
  tagCloudHead: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 10 },
  tagCloudList: { display: "flex", flexWrap: "wrap", gap: 7 },
  cloudTag: { fontSize: 12.5, padding: "5px 11px", borderRadius: 16, border: `0.5px solid ${C.border}`, background: C.surface, color: C.textSec, fontWeight: 500 },
  cloudTagOn: { background: "#EEEDFE", color: "#534AB7", borderColor: "#CECBF6" },
  cloudCount: { color: C.textTer, fontSize: 11, marginLeft: 2 },

  /* empty */
  empty: { textAlign: "center", padding: "60px 20px", color: C.ink },

  /* FAB */
  fab: {
    position: "fixed", bottom: 24, right: "max(24px, calc(50% - 310px + 24px))",
    width: 56, height: 56, borderRadius: "50%", border: "none", background: C.accent,
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 6px 20px rgba(127,119,221,0.4)", zIndex: 20,
  },

  /* overlay / modal */
  overlay: {
    position: "fixed", inset: 0, background: "rgba(44,44,42,0.45)", zIndex: 100,
    display: "flex", alignItems: "center", justifyContent: "center", padding: 18,
  },
  modal: { background: C.surface, borderRadius: 18, padding: 24, width: "100%", maxWidth: 380, animation: "pop .2s ease" },
  modalTitle: { margin: 0, fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em" },

  composer: {
    background: C.surface, borderRadius: 18, padding: 22, width: "100%", maxWidth: 440,
    maxHeight: "88vh", overflowY: "auto", animation: "pop .2s ease",
  },
  composerHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },

  typeToggle: { display: "flex", gap: 6, marginBottom: 14, background: "#F0F0F0", padding: 4, borderRadius: 12 },
  typeBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, height: 38, border: "none", background: "transparent", borderRadius: 9, fontSize: 13.5, fontWeight: 500, color: C.textSec },
  typeBtnOn: { background: C.surface, color: C.ink, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" },

  input: {
    width: "100%", border: `0.5px solid ${C.borderStrong}`, borderRadius: 11, padding: "11px 13px",
    fontSize: 15, color: C.ink, background: "#F7F7F7", fontFamily: "inherit",
  },
  fieldLabel: { fontSize: 12.5, fontWeight: 600, color: C.textSec, marginBottom: 8 },

  tagInputRow: { display: "flex", gap: 8 },
  addTagBtn: { padding: "0 16px", borderRadius: 11, border: `0.5px solid ${C.borderStrong}`, background: C.surface, fontSize: 13.5, fontWeight: 500, color: C.textSec },
  draftTag: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 500, background: "#EEEDFE", color: "#534AB7", padding: "4px 6px 4px 10px", borderRadius: 14 },
  draftTagX: { border: "none", background: "rgba(83,74,183,0.15)", color: "#534AB7", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" },

  primaryBtn: { border: "none", background: C.accent, color: "#fff", fontSize: 15, fontWeight: 600, padding: "13px", borderRadius: 12 },

  imageUpload: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    border: `1px dashed ${C.borderStrong}`, borderRadius: 11, padding: "16px",
    fontSize: 14, fontWeight: 500, color: C.textSec, cursor: "pointer", background: "#FAFAF8",
  },
  imageRemove: {
    position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: "50%",
    border: "none", background: "rgba(44,44,42,0.6)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },

  /* calendar */
  calWrap: { paddingBottom: 10 },
  calHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  calNav: { width: 38, height: 38, borderRadius: 10, border: `0.5px solid ${C.border}`, background: C.surface, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center" },
  calTitle: { fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em" },
  calGridHead: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 6 },
  calDow: { textAlign: "center", fontSize: 12, fontWeight: 600, padding: "4px 0" },
  calGrid: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 },
  calEmpty: { aspectRatio: "1 / 1.05" },
  calCell: {
    aspectRatio: "1 / 1.05", border: `0.5px solid ${C.border}`, background: C.surface, borderRadius: 10,
    display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 2px 4px", gap: 4,
  },
  calCellHas: { borderColor: C.borderStrong },
  calCellToday: { background: "#EEEDFE", borderColor: "#CECBF6" },
  calCellSel: { borderColor: C.accent, borderWidth: 1.5 },
  calNum: { fontSize: 13, color: C.textSec, fontWeight: 500 },
  calDots: { display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap", justifyContent: "center" },
  calDotMark: { width: 6, height: 6, borderRadius: "50%" },
  calMore: { fontSize: 9, color: C.textTer, fontWeight: 600 },

  calDetail: { marginTop: 18, display: "flex", flexDirection: "column", gap: 12 },
  calDetailHead: { fontSize: 13.5, fontWeight: 600, color: C.textSec, padding: "0 2px" },
};
