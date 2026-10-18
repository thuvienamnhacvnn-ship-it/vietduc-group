"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Logo3D } from "../Logo3D";
import styles from "./HubStage.module.css";

/** Mỗi lĩnh vực mang hành tinh 3D của riêng nó (PLANET_SRC). */
export type HubIcon = "education" | "venture";

/** Hành tinh 3D (video nền trong suốt) của từng lĩnh vực, trong public/brand/3d. */
const PLANET_SRC: Record<HubIcon, string> = {
  education: "/brand/3d/vd-hanh-tinh-giao-duc",
  venture: "/brand/3d/vd-hanh-tinh-khach-san",
};

/**
 * Hai quỹ đạo elip, toạ độ theo khung 1000x920 của sân khấu: nghiêng ngược
 * nhau, chạy ngược chiều, chu kỳ khác nhau để hai hành tinh không bao giờ đi
 * song đôi. Tâm elip đặt thấp hơn tâm địa cầu một chút để hành tinh đi qua
 * phía dưới dòng chữ VIET DUC chứ không che nó.
 */
const ORBITS = [
  { rx: 480, ry: 230, cy: 500, tilt: -7, period: 18, phase: 0.3, dir: 1 },
  { rx: 430, ry: 268, cy: 480, tilt: 8, period: 26, phase: 3.4, dir: -1 },
];
const VB_W = 1000;
const VB_H = 920;
const CX = 500;

export type HubBranch = {
  key: "education" | "venture";
  href: string;
  name: string;
  tagline: string;
  desc: string;
  /** Which mark the satellite carries. */
  icon: HubIcon;
};

type Props = {
  branches: [HubBranch, HubBranch];
  enterLabel: string;
  orbitLabel: string;
  /** The group's channels, shown under the two buttons on a phone. */
  channels?: React.ReactNode;
  /**
   * The wording of the page. It lives inside the stage so the same markup can
   * be ordered two ways: above the orbit on a desktop, below it on a phone,
   * where the mark should be the first thing on the screen.
   */
  heading: React.ReactNode;
};

/**
 * The group mark at the centre with the two business fields circling it.
 *
 * Three things are deliberate:
 *
 *  - The orbit is decoration. Each satellite is a plain link and the two cards
 *    underneath lead to the same two places, so nothing depends on catching a
 *    moving target.
 *  - Motion stops on hover and on focus, so a satellite can be read and clicked
 *    without chasing it, and it never moves at all when the reader has asked
 *    the system for reduced motion.
 *  - The pointer lean is written to custom properties rather than to the
 *    element's own transform, because the orbit animation owns `transform`.
 */
export function HubStage({ branches, enterLabel, orbitLabel, heading, channels }: Props) {
  const [reduced, setReduced] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const spaceRef = useRef<HTMLDivElement>(null);
  const satRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  /** Hành tinh nào đang được rê chuột / focus thì đứng lại. */
  const holdRef = useRef<boolean[]>([false, false]);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  /*
   * Quỹ đạo 3D: hành tinh chạy trên elip, vị trí tính mỗi khung hình.
   * sin(góc) > 0 là nửa elip phía trước: hành tinh to, sáng, nằm trên địa cầu;
   * nửa phía sau thì nhỏ, tối và khuất sau địa cầu. Góc cộng dồn theo thời gian
   * thật nên dừng (rê chuột, cuộn khỏi màn hình) rồi chạy tiếp không bị giật.
   */
  useEffect(() => {
    const space = spaceRef.current;
    if (!space) return;
    let visible = true;
    let raf = 0;
    let last = performance.now();
    const angle = ORBITS.map((o) => o.phase);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(space);

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (visible) {
        const kx = space.clientWidth / VB_W;
        const ky = space.clientHeight / VB_H;
        ORBITS.forEach((o, i) => {
          const node = satRefs.current[i];
          if (!node) return;
          const hold = holdRef.current[i];
          if (!reduced && !hold) angle[i] += (o.dir * dt * 2 * Math.PI) / o.period;
          const c = Math.cos(angle[i]);
          const s = Math.sin(angle[i]);
          const r = (o.tilt * Math.PI) / 180;
          const x = o.rx * c;
          const y = o.ry * s;
          const X = CX + x * Math.cos(r) - y * Math.sin(r);
          const Y = o.cy + x * Math.sin(r) + y * Math.cos(r);
          const depth = (s + 1) / 2; // 0 = xa nhất, 1 = gần nhất
          const scale = 0.68 + 0.42 * depth + (hold ? 0.12 : 0);
          const w = node.offsetWidth;
          node.style.transform = `translate(${(X * kx - w / 2).toFixed(1)}px, ${(Y * ky - w / 2).toFixed(1)}px) scale(${scale.toFixed(3)})`;
          node.style.zIndex = s > 0 ? "4" : "1";
          node.style.filter = `brightness(${(0.68 + 0.32 * depth).toFixed(2)}) drop-shadow(0 ${(6 + 10 * depth).toFixed(0)}px 10px rgba(0, 0, 0, 0.45))`;
        });
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reduced]);

  const hold = (i: number, on: boolean) => () => {
    holdRef.current[i] = on;
  };

  /*
   * Đường quỹ đạo phát sáng (Sếp yêu cầu, 18/10: "đường đó phát sáng chứ không
   * phải là 1 line màu bình thường"): quầng nhoè + nét vàng + lõi sáng + một đốm
   * sáng chạy dọc. Vẽ hai lần — lớp sau nằm dưới địa cầu, lớp trước nằm trên —
   * mỗi lớp giữ một nửa elip qua mặt nạ chuyển mềm, nên chỗ nối không thành vạch.
   */
  const orbitArt = (side: "back" | "front") => {
    const front = side === "front";
    const halo = `${uid}-${side}-halo`;
    const soft = `${uid}-${side}-soft`;
    return (
      <svg
        className={`${styles.paths} ${front ? styles.pathsFront : ""}`}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <filter id={halo} x="-10%" y="-30%" width="120%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id={soft} x="-10%" y="-30%" width="120%" height="160%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          {ORBITS.map((o, i) => (
            <g key={i}>
              <linearGradient
                id={`${uid}-${side}-${i}-g`}
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1={o.cy - 40}
                x2="0"
                y2={o.cy + 40}
              >
                <stop offset="0" stopColor={front ? "#000" : "#fff"} />
                <stop offset="1" stopColor={front ? "#fff" : "#000"} />
              </linearGradient>
              <mask id={`${uid}-${side}-${i}`} maskUnits="userSpaceOnUse" x="-200" y="-400" width="1400" height="1800">
                <rect x="-200" y="-400" width="1400" height="1800" fill={`url(#${uid}-${side}-${i}-g)`} />
              </mask>
            </g>
          ))}
        </defs>
        {ORBITS.map((o, i) => {
          const e = { cx: CX, cy: o.cy, rx: o.rx, ry: o.ry, fill: "none" };
          return (
            <g
              key={i}
              transform={`rotate(${o.tilt} ${CX} ${o.cy})`}
              mask={`url(#${uid}-${side}-${i})`}
              opacity={front ? 1 : 0.5}
            >
              <ellipse {...e} stroke="#f2c66a" strokeWidth={9} strokeOpacity={0.55} filter={`url(#${halo})`} />
              <ellipse {...e} stroke="#ffd98a" strokeWidth={3} strokeOpacity={0.95} />
              <ellipse {...e} stroke="#fffaea" strokeWidth={1.1} />
              <ellipse
                {...e}
                className={styles.spark}
                stroke="#ffffff"
                strokeWidth={4}
                strokeLinecap="round"
                pathLength={1000}
                strokeDasharray="38 962"
                filter={`url(#${soft})`}
                style={{
                  animationDuration: `${o.period / 2}s`,
                  animationDirection: o.dir < 0 ? "reverse" : "normal",
                }}
              />
            </g>
          );
        })}
      </svg>
    );
  };

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const node = stageRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty("--lean-x", `${(x * 14).toFixed(2)}deg`);
    node.style.setProperty("--lean-y", `${(-y * 11).toFixed(2)}deg`);
  }, []);

  const onPointerLeave = useCallback(() => {
    const node = stageRef.current;
    if (!node) return;
    node.style.setProperty("--lean-x", "0deg");
    node.style.setProperty("--lean-y", "0deg");
  }, []);

  return (
    <div
      ref={stageRef}
      className={styles.stage}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {/* Quả địa cầu Việt Đức ở giữa, hai hành tinh lĩnh vực bay quanh trên hai
          quỹ đạo elip phát sáng (mẫu phiên tuxee-4e, Sếp duyệt 18/10). */}
      <div ref={spaceRef} className={styles.space} role="group" aria-label={orbitLabel}>
        {orbitArt("back")}
        <div className={styles.globe}>
          <Logo3D className={styles.globeMedia} src="/brand/3d/vd-dia-cau" width={800} height={800} />
        </div>
        {orbitArt("front")}

        {branches.map((branch, i) => (
          <Link
            key={branch.key}
            ref={(el) => {
              satRefs.current[i] = el;
            }}
            href={branch.href}
            className={styles.satellite}
            onMouseEnter={hold(i, true)}
            onMouseLeave={hold(i, false)}
            onFocus={hold(i, true)}
            onBlur={hold(i, false)}
          >
            <Logo3D className={styles.planet} src={PLANET_SRC[branch.icon]} width={400} height={400} label="" />
            {/* Faded, not removed: the link keeps its name for a screen
                reader whether or not a pointer is over it. */}
            <span className={styles.planetLabel}>{branch.name}</span>
          </Link>
        ))}
      </div>

      <div className={styles.heading}>{heading}</div>

      <div className={styles.choices}>
        {branches.map((branch) => (
          <Link
            key={branch.key}
            href={branch.href}
            className={`${styles.choice} ${
              branch.icon === "education" ? styles.choiceEducation : styles.choiceVenture
            }`}
            title={branch.desc}
          >
            <span className={styles.choiceName}>{branch.name}</span>
            <span className={styles.choiceGo} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor">
                <path d="M5 12h13M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="visually-hidden">{enterLabel}</span>
          </Link>
        ))}
      </div>

      {channels ? <div className={styles.channels}>{channels}</div> : null}
    </div>
  );
}
