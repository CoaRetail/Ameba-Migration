"use client";
import { useEffect, useRef, useState } from "react";
import { DOMAIN_TYPES, PLANS, SERVICES, validate, type Errors, type FieldKey } from "@/lib/leads";
import { trackGenerateLead } from "@/lib/analytics";

declare global {
  interface Window { turnstile?: any }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
const newId = () => crypto.randomUUID();
const err = (m?: string) => (m ? <span role="alert" style={{ color: "#B3282D", fontSize: 13 }}>{m}</span> : null);

function Turnstile({ onToken, resetKey }: { onToken: (t: string) => void; resetKey: number }) {
  const box = useRef<HTMLDivElement>(null);
  const wid = useRef<string | null>(null);
  useEffect(() => {
    if (!SITE_KEY) return;
    const render = () => {
      if (!box.current || !window.turnstile || wid.current) return;
      wid.current = window.turnstile.render(box.current, {
        sitekey: SITE_KEY,
        callback: (t: string) => onToken(t),
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    };
    if (window.turnstile) render();
    else if (!document.getElementById("cf-turnstile")) {
      const s = document.createElement("script");
      s.id = "cf-turnstile";
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.onload = render;
      document.head.appendChild(s);
    } else document.getElementById("cf-turnstile")!.addEventListener("load", render);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (resetKey > 0 && wid.current && window.turnstile) { window.turnstile.reset(wid.current); onToken(""); }
  }, [resetKey]); // eslint-disable-line react-hooks/exhaustive-deps
  return <div ref={box} />;
}

export default function ContactForm({ plan, setPlan }: { plan: string; setPlan: (v: string) => void }) {
  const [f, setF] = useState({ company: "", name: "", email: "", phone: "", url: "", domainType: "", service: "", message: "", hp: "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [notice, setNotice] = useState("");
  const [token, setToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const submissionId = useRef("");
  useEffect(() => { submissionId.current = newId(); }, []);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (new URLSearchParams(window.location.search).get("preview") === "success") setStatus("done");
  }, []);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<any>) => setF((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    const payload = { ...f, plan, consent, submissionId: submissionId.current };
    const v = validate(payload);
    delete v.submissionId;
    if (!token) (v as any).turnstile = "「ロボットではありません」の確認を完了してください。";
    setErrors(v);
    if (Object.keys(v).length) return;
    setStatus("sending"); setNotice("");
    const q = new URLSearchParams(window.location.search);
    try {
      const r = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, turnstileToken: token, utm: { source: q.get("utm_source") || "", medium: q.get("utm_medium") || "", campaign: q.get("utm_campaign") || "" } }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok) {
        trackGenerateLead(plan);
        setStatus("done");
        return;
      }
      if (j.code === "validation" && j.errors) setErrors(j.errors);
      setNotice(j.code === "rate_limited" ? "送信が集中しています。しばらくしてからもう一度お試しください。" : "送信できませんでした。入力内容はそのままです。時間をおいて、もう一度お試しください。");
    } catch {
      setNotice("送信できませんでした。入力内容はそのままです。通信環境をご確認のうえ、もう一度お試しください。");
    }
    setStatus("failed"); setResetKey((k) => k + 1);
  }

  if (status === "done")
    return (
      <div role="status" style={{ background: "#fff", color: "#101B30", borderRadius: 16, padding: 28, textAlign: "center" }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 20 }}>送信が完了しました</h3>
        <p style={{ margin: 0, fontSize: 14, color: "#46536B" }}>お問い合わせありがとうございます。内容を確認のうえ、ご連絡します。</p>
      </div>
    );

  const sending = status === "sending";
  const E = errors as Errors & { turnstile?: string };
  const bad = (k: FieldKey) => (E[k] ? true : undefined);
  const row = { display: "flex", flexWrap: "wrap", gap: 16 } as const;
  return (
    <form onSubmit={submit} noValidate style={{ background: "#fff", color: "#101B30", borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
      <h3 style={{ margin: 0, fontSize: 20 }}>無料で移行について相談する</h3>
      <div style={row}>
        <div className="fld"><label htmlFor="f1">会社名・店舗名（任意）</label><input id="f1" value={f.company} onChange={set("company")} autoComplete="organization" aria-invalid={bad("company")} />{err(E.company)}</div>
        <div className="fld"><label htmlFor="f2">お名前（必須）</label><input id="f2" value={f.name} onChange={set("name")} autoComplete="name" aria-invalid={bad("name")} />{err(E.name)}</div>
      </div>
      <div style={row}>
        <div className="fld"><label htmlFor="f3">メールアドレス（必須）</label><input id="f3" type="email" value={f.email} onChange={set("email")} autoComplete="email" aria-invalid={bad("email")} />{err(E.email)}</div>
        <div className="fld"><label htmlFor="f4">電話番号（任意）</label><input id="f4" type="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" aria-invalid={bad("phone")} />{err(E.phone)}</div>
      </div>
      <div className="fld" style={{ flex: "0 0 auto" }}><label htmlFor="f5">現在のホームページURL（必須）</label><input id="f5" type="url" placeholder="https://" value={f.url} onChange={set("url")} aria-invalid={bad("url")} />{err(E.url)}</div>
      <div style={row}>
        <div className="fld"><label htmlFor="f6">ドメイン利用状況（必須）</label>
          <select id="f6" value={f.domainType} onChange={set("domainType")} aria-invalid={bad("domainType")}><option value="">選択してください</option>{DOMAIN_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}</select>{err(E.domainType)}</div>
        <div className="fld"><label htmlFor="f7">希望する移行内容（任意）</label>
          <select id="f7" value={f.service} onChange={set("service")}><option value="">選択してください</option>{SERVICES.map((d) => <option key={d} value={d}>{d}</option>)}</select>{err(E.service)}</div>
      </div>
      <div className="fld" style={{ flex: "0 0 auto" }}><label htmlFor="f9">希望プラン</label>
        <select id="f9" value={plan} onChange={(e) => setPlan(e.target.value)}>{PLANS.map((d) => <option key={d} value={d}>{d}</option>)}</select>{err(E.plan)}</div>
      <div className="fld" style={{ flex: "0 0 auto" }}><label htmlFor="f8">お問い合わせ内容（必須）</label><textarea id="f8" rows={4} value={f.message} onChange={set("message")} aria-invalid={bad("message")} />{err(E.message)}</div>
      {/* Honeypot：人間には見えない入力欄 */}
      <div aria-hidden="true" style={{ position: "absolute", left: -9999, height: 0, overflow: "hidden" }}>
        <label>Website<input tabIndex={-1} autoComplete="off" value={f.hp} onChange={set("hp")} /></label>
      </div>
      <div>
        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14 }}>
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ width: 24, height: 24, flex: "0 0 auto" }} />
          <span><a href="https://www.coaretail.com/lp_privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#101B30", textDecoration: "underline" }}>プライバシーポリシー</a>に基づく個人情報の取り扱いに同意します</span>
        </label>
        {err(E.consent)}
      </div>
      {SITE_KEY ? <div><Turnstile onToken={setToken} resetKey={resetKey} />{err(E.turnstile)}</div> : null}
      <button type="submit" disabled={sending || !SITE_KEY} style={{ background: "#FF8A24", color: "#101B30", font: "inherit", fontWeight: 700, fontSize: 18, padding: "16px 32px", border: 0, borderRadius: 10, minHeight: 48, opacity: sending || !SITE_KEY ? 0.6 : 1, cursor: sending ? "wait" : "pointer" }}>
        {sending ? "送信中…" : "送信する"}
      </button>
      {notice && <p role="alert" style={{ margin: 0, fontSize: 14, color: "#B3282D" }}>{notice}</p>}
    </form>
  );
}
