import {
  CATS,
  STORE,
  brl,
  byId,
  countOf,
  crumb,
  haystack,
  labelOf,
  match,
  norm,
  options,
  parentOf,
  pct,
  photo,
  products,
  subsOf,
  type FilterKey,
  type Product,
} from "@/lib/catalog";
import { HERO } from "@/lib/home";

/**
 * MOTOR DE INTERAÇÕES DA LOJA
 *
 * A página (src/app/page.tsx) entrega o HTML pronto. Este módulo liga o
 * comportamento por cima dele: a câmera que aproxima da peça na parede, os
 * filtros que reorganizam as prateleiras, sacola, favoritos, busca e os
 * efeitos presos à rolagem. É DOM direto de propósito: as animações dependem
 * de medir e mover elementos quadro a quadro.
 *
 * `initStore()` devolve uma função que desfaz tudo (ouvintes, timers).
 *
 * Onde o backend entra: `add`, `renderBag` (cupom, frete e totais) e o botão
 * "Finalizar compra" hoje vivem só no navegador (localStorage).
 */

type Item = Product & {
  i: number;
  opts: { v: string; ok: boolean }[];
  avail: { v: string; ok: boolean }[];
  off: number;
  hay: string;
};
type BagLine = { id: string; size: string; q: number };

const FREE = STORE.freeShipping;
const PIX = STORE.pix;
const PARC = STORE.installments;
const WA = STORE.whatsapp;
const CUPOM = STORE.coupon.code;
const KEY = { fav: "nevoa-fav", bag: "nevoa-bag", seen: "nevoa-seen", age: "nevoa-18" };

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export function initStore(): () => void {
  const P: Item[] = products.map((p, i) => {
    const opts = options(p);
    return { ...p, i, opts, avail: opts.filter((s) => s.ok), off: pct(p), hay: haystack(p) };
  });
  const index = new Map(P.map((p) => [p.id, p]));
  const item = (id: string) => index.get(id);

  const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector(s) as T;
  const $$ = <T extends HTMLElement = HTMLElement>(s: string) => [...document.querySelectorAll(s)] as T[];
  const html = document.documentElement;
  const stage = $("#stage"),
    wall = $("#wall"),
    detail = $("#detail"),
    hero = $("#hero");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ms = (n: number) => (reduce ? 0 : n);

  /* ---------- limpeza: tudo que é ligado aqui é desligado em dispose() ---------- */
  const ac = new AbortController();
  const sig = { signal: ac.signal };
  const on = <K extends keyof (WindowEventMap & DocumentEventMap & HTMLElementEventMap)>(
    t: EventTarget,
    type: K | string,
    fn: (e: never) => void,
    opt: AddEventListenerOptions | boolean = {},
  ) => t.addEventListener(type, fn as EventListener, typeof opt === "boolean" ? { capture: opt, ...sig } : { ...opt, ...sig });
  const intervals: ReturnType<typeof setInterval>[] = [];
  const observers: IntersectionObserver[] = [];

  const store = {
    get<T>(k: string, d: T): T {
      try {
        return (JSON.parse(localStorage.getItem(k) as string) as T) ?? d;
      } catch {
        return d;
      }
    },
    set(k: string, v: unknown) {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch {}
    },
  };

  const priceHTML = (p: Item, short?: boolean) =>
    `<span class="pr${p.was ? " sale" : ""}">${p.was && !short ? `<s>${brl(p.was)}</s>` : ""}${brl(p.price)}</span>`;
  const shot = (p: Item) =>
    `<span class="photo">${p.off ? `<span class="off">-${p.off}%</span>` : ""}<img class="a" src="${photo(p)}" alt="" loading="lazy" decoding="async" draggable="false"><span class="ph">${esc(p.name)}</span></span><span class="shelf"></span>`;
  const card = (p: Item) =>
    `<button class="pcard" type="button" data-open="${p.id}" aria-label="${esc(p.name)}, ${esc(p.sub)}, ${brl(p.price)}">${shot(p)}<span class="cap"><span class="nm">${esc(p.name)}</span>${priceHTML(p)}</span></button>`;

  // foto que não carregou vira um cartão com o nome da peça
  on(
    document,
    "error",
    (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "IMG" && t.classList.contains("a") && t.closest(".photo")) t.closest(".photo")!.parentElement!.classList.add("noimg");
    },
    true,
  );

  let toastT: ReturnType<typeof setTimeout>;
  function toast(msg: string) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ---------- barra de avisos ---------- */
  if (!reduce) {
    const li = $$("#promo li");
    let k = 0;
    intervals.push(
      setInterval(() => {
        li[k].className = "out";
        k = (k + 1) % li.length;
        li[k].className = "on";
        setTimeout(() => li.forEach((x) => x.className === "out" && (x.className = "")), 650);
      }, 4200),
    );
  }

  /* ---------- menu: segundo nível ---------- */
  function menuSub(k: string | null) {
    $("#menu").classList.toggle("sub-on", !!k);
    $$(".m-pane.sub").forEach((p) => {
      const isOn = p.dataset.pane === k;
      p.classList.toggle("on", isOn);
      p.inert = !isOn;
      if (isOn) p.scrollTop = 0;
    });
    $(".m-pane.root").inert = !!k;
    if (k) {
      $("#mTitle").textContent = labelOf(k as FilterKey);
      setTimeout(() => $("#mBack").focus({ preventScroll: true }), 80);
    }
  }
  on(document, "click", (e: MouseEvent) => {
    const t = e.target as HTMLElement;
    const sub = t.closest<HTMLElement>("[data-sub]");
    if (sub) return menuSub(sub.dataset.sub!);
    if (t.closest("#mBack")) return menuSub(null);
    const act = t.closest<HTMLElement>("[data-act]");
    if (act) {
      openLayer(act.dataset.act!);
      if (act.dataset.act === "search") renderSearch();
    }
  });

  /* ---------- herói ---------- */
  const hword = $("#hword"),
    hpanels = $$(".h-panel");
  let hk = 0,
    hTimer: ReturnType<typeof setInterval>;
  function heroSet(k: number) {
    if (k === hk) return;
    hk = k;
    hpanels.forEach((b, i) => b.classList.toggle("is-on", i === k));
    const old = hword.lastElementChild as HTMLElement,
      nu = document.createElement("span");
    nu.textContent = HERO[k][0];
    hword.append(nu);
    [...hword.children].slice(0, -2).forEach((x) => x.remove());
    if (reduce || !nu.animate) {
      old.remove();
      return;
    }
    old.animate([{ transform: "translateY(0)" }, { transform: "translateY(-108%)" }], {
      duration: 520,
      easing: "cubic-bezier(.77,0,.18,1)",
      fill: "forwards",
    }).onfinish = () => old.remove();
    nu.animate([{ transform: "translateY(108%)" }, { transform: "translateY(0)" }], { duration: 640, easing: "cubic-bezier(.2,.7,.2,1)" });
  }
  function heroPlay() {
    clearInterval(hTimer);
    if (!reduce)
      hTimer = setInterval(() => {
        if (!cur && scrollY < innerHeight * 0.7 && !document.hidden) heroSet((hk + 1) % HERO.length);
      }, 2900);
  }
  hpanels.forEach((b, i) => {
    on(b, "pointerenter", () => {
      heroSet(i);
      clearInterval(hTimer);
    });
    on(b, "pointerleave", heroPlay);
    on(b, "focus", () => heroSet(i));
  });
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      hero.classList.add("in");
      if (!reduce)
        hpanels.forEach((b, i) =>
          setTimeout(
            () => {
              b.classList.add("spark");
              setTimeout(() => b.classList.remove("spark"), 950);
            },
            700 + i * 160,
          ),
        );
    }),
  );
  heroPlay();
  function fitHero() {
    // a palavra gigante sempre cabe na coluna, com qualquer fonte
    hword.style.fontSize = "";
    const box = hword.closest(".h-copy")!.clientWidth,
      probe = document.createElement("span");
    probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap";
    hword.append(probe);
    const widest = Math.max(
      ...HERO.map(([w]) => {
        probe.textContent = w;
        return probe.getBoundingClientRect().width;
      }),
    );
    probe.remove();
    if (widest > box) hword.style.fontSize = Math.floor((parseFloat(getComputedStyle(hword).fontSize) * box) / widest) + "px";
  }
  fitHero();
  if (document.fonts?.ready) document.fonts.ready.then(fitHero);

  /* ---------- trilhos: arrastar com o mouse ---------- */
  $$(".rail").forEach((rail) => {
    let down = false,
      sx = 0,
      sl = 0,
      moved = false;
    on(rail, "pointerdown", (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      moved = false;
      sx = e.clientX;
      sl = rail.scrollLeft;
    });
    on(window, "pointermove", (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 6) {
        moved = true;
        rail.classList.add("drag");
      }
      if (moved) rail.scrollLeft = sl - dx;
    });
    on(window, "pointerup", () => {
      if (!down) return;
      down = false;
      setTimeout(() => rail.classList.remove("drag"), 0);
    });
    on(
      rail,
      "click",
      (e: MouseEvent) => {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
          moved = false;
        }
      },
      true,
    );
  });
  on(document, "click", (e: MouseEvent) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>("[data-rail]");
    if (b) {
      const r = $("#ofRail");
      r.scrollBy({ left: +b.dataset.rail! * r.clientWidth * 0.7, behavior: reduce ? "auto" : "smooth" });
    }
  });

  /* ---------- a parede ---------- */
  const tiles = [...wall.children] as HTMLElement[];
  const tileOf = (id: string) => wall.querySelector<HTMLElement>(`[data-id="${id}"]`)!;
  const visible = () => ([...wall.children] as HTMLElement[]).filter((t) => !t.hidden);
  const lightAll = () => tiles.forEach((t) => t.classList.remove("unlit"));
  if ("IntersectionObserver" in window && !reduce) {
    // as prateleiras acendem conforme entram na tela
    const io = new IntersectionObserver(
      (es) => {
        let k = 0;
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          const t = e.target as HTMLElement;
          io.unobserve(t);
          setTimeout(() => {
            t.classList.remove("unlit");
            t.classList.add("spark");
            setTimeout(() => t.classList.remove("spark"), 950);
          }, 70 * k++);
        });
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    tiles.forEach((t) => io.observe(t));
    const io2 = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io2.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -12% 0px" },
    );
    $$(".rv").forEach((el) => io2.observe(el));
    observers.push(io, io2);
  } else lightAll();

  /* ---------- filtros, busca e ordenação (as prateleiras se reorganizam) ---------- */
  let fkey: FilterKey = "tudo",
    fq = "",
    fsort = "padrao";
  function renderChips() {
    const top = parentOf(fkey);
    const keys: FilterKey[] = ["tudo", ...(Object.keys(CATS) as FilterKey[]), "ofertas"];
    $("#chips").innerHTML =
      keys.map((k) => `<button type="button" data-f="${k}" aria-pressed="${k === top}">${labelOf(k)}<sup>${countOf(k)}</sup></button>`).join("") +
      (fq
        ? `<button type="button" class="q" data-clearq aria-label="Limpar busca">Busca: “${esc(fq)}” <svg width="10" height="10" viewBox="0 0 14 14" aria-hidden="true"><path d="m1 1 12 12M13 1 1 13" stroke="currentColor" stroke-width="2"/></svg></button>`
        : "");
    const subs = subsOf(top);
    $("#subchips").innerHTML = subs
      ? [top, ...subs]
          .map((k) => `<button type="button" data-f="${k}" aria-pressed="${k === fkey}">${k === top ? "Tudo de " + labelOf(top).toLowerCase() : labelOf(k)}</button>`)
          .join("")
      : "";
  }
  const sorters: Record<string, (a: Item, b: Item) => number> = {
    padrao: (a, b) => a.i - b.i,
    menor: (a, b) => a.price - b.price,
    maior: (a, b) => b.price - a.price,
    az: (a, b) => a.name.localeCompare(b.name, "pt-BR"),
    off: (a, b) => b.off - a.off || a.i - b.i,
  };
  function apply(animate = true) {
    const q = norm(fq.trim()),
      words = q.split(/\s+/).filter(Boolean);
    const first = animate && !reduce ? new Map(visible().map((t) => [t, t.getBoundingClientRect()])) : null;
    const order = [...P].sort(sorters[fsort]);
    order.forEach((p) => {
      const t = tileOf(p.id);
      t.hidden = !(match(p, fkey) && words.every((w) => p.hay.includes(w)));
      wall.appendChild(t);
    });
    const vis = visible();
    $("#count").textContent = `${vis.length} ${vis.length === 1 ? "peça" : "peças"}${fkey !== "tudo" || fq ? " neste filtro" : ""}.`;
    $("#none").hidden = vis.length > 0;
    $("#noneTxt").textContent = fq ? `Não achamos nada para “${fq}”. Tente outro termo ou veja a loja inteira.` : "Esse filtro está vazio no momento.";
    renderChips();
    if (first)
      vis.forEach((t, i) => {
        t.classList.remove("unlit");
        const a = first.get(t),
          b = t.getBoundingClientRect();
        if (b.top > innerHeight || b.bottom < 0) return;
        if (a) t.animate([{ transform: `translate(${a.left - b.left}px,${a.top - b.top}px)` }, { transform: "none" }], { duration: 620, easing: "cubic-bezier(.2,.7,.2,1)" });
        else
          t.animate(
            [
              { opacity: 0, transform: "translateY(18px)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 460, delay: 100 + Math.min(i, 12) * 30, easing: "ease-out", fill: "backwards" },
          );
      });
    measure();
  }
  function setFilter(k: FilterKey, q?: string) {
    fkey = k;
    if (q !== undefined) fq = q;
    apply();
  }
  function goWall(k?: FilterKey, q?: string) {
    closeLayers();
    const run = () => {
      if (k !== undefined) setFilter(k, q === undefined ? "" : q);
      $("#parede").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    };
    if (cur) {
      close();
      setTimeout(run, ms(far ? 420 : 1100));
    } else run();
  }
  on($("#sort"), "change", (e: Event) => {
    fsort = (e.target as HTMLSelectElement).value;
    apply();
  });

  // depois de um clique no menu, o submenu só volta a abrir quando o mouse se mexe
  let shutAt: null | "wait" | [number, number] = null;
  function shutNav() {
    $("#nav").classList.add("shut");
    shutAt = "wait";
  }
  on(
    window,
    "pointermove",
    (e: PointerEvent) => {
      if (!shutAt) return;
      if (shutAt === "wait") {
        shutAt = [e.clientX, e.clientY];
        return;
      }
      if (Math.hypot(e.clientX - shutAt[0], e.clientY - shutAt[1]) > 28) {
        shutAt = null;
        $("#nav").classList.remove("shut");
      }
    },
    { passive: true },
  );

  /* ---------- câmera ---------- */
  let cur: string | null = null,
    far = false,
    timers: ReturnType<typeof setTimeout>[] = [];
  const later = (fn: () => void, t: number) => timers.push(setTimeout(fn, ms(t)));
  const clearTimers = () => {
    timers.forEach(clearTimeout);
    timers = [];
  };
  const R = 1.25; // proporção da foto na prateleira (4:5)
  function frame() {
    // onde a peça escolhida para na tela
    const vw = innerWidth,
      vh = innerHeight;
    const hdr = Math.max(0, $(".promo").getBoundingClientRect().bottom) + $("#top").offsetHeight;
    let mode: string, H: number, px: number, py: number;
    if (vw >= 1180) {
      mode = "wide";
      H = Math.min(vh * 0.64, vw * 0.5);
      px = vw * 0.44 - H / R / 2;
      py = Math.max(hdr + 20, vh * 0.55 - H / 2);
    } else if (vw >= 760) {
      mode = "mid";
      H = Math.min(vh * 0.56, vw * 0.56);
      px = 40;
      py = Math.max(hdr + 132, vh * 0.58 - H / 2);
    } else {
      mode = "mob";
      py = hdr + 110;
      H = Math.max(170, Math.min(vw * 0.8 * R, vh * 0.42, vh - py - 222));
      px = (vw - H / R) / 2;
    }
    return { mode, T: H / R, H, px, py };
  }
  function aim(tile: HTMLElement, animate: boolean, pan?: boolean) {
    const F = frame();
    html.dataset.layout = F.mode;
    detail.style.setProperty("--px", F.px + "px");
    detail.style.setProperty("--py", F.py + "px");
    detail.style.setProperty("--pt", F.T + "px");
    detail.style.setProperty("--ph", F.H + "px");
    const sr = stage.getBoundingClientRect(),
      ph = tile.querySelector<HTMLElement>(".photo")!;
    const ox = sr.left + wall.offsetLeft,
      oy = sr.top + wall.offsetTop;
    const s = F.T / ph.offsetWidth;
    const lx = tile.offsetLeft + ph.offsetWidth / 2,
      ly = tile.offsetTop + ph.offsetHeight / 2;
    wall.classList.toggle("cam", !!animate);
    wall.classList.toggle("pan", !!pan);
    wall.style.transform = `translate3d(${F.px + F.T / 2 - ox - s * lx}px,${F.py + F.H / 2 - oy - s * ly}px,0) scale(${s})`;
  }

  /* ---------- ficha ---------- */
  let chosen: string | null = null,
    added = false;
  function fitName() {
    // o nome nunca estoura a coluna, com qualquer fonte
    const n = $("#dName");
    n.style.fontSize = "";
    let fs = parseFloat(getComputedStyle(n).fontSize);
    const w = n.parentElement!.clientWidth;
    while (n.scrollWidth > w + 1 && fs > 22) {
      fs -= 2;
      n.style.fontSize = fs + "px";
    }
  }
  function fill(p: Item) {
    const list = visible(),
      i = list.indexOf(tileOf(p.id));
    $("#dCrumb").textContent = crumb(p);
    $("#dName").textContent = p.name;
    $("#dSub").textContent = p.sub;
    $("#dWas").innerHTML = p.was ? `<s>${brl(p.was)}</s><b>-${p.off}%</b>` : "";
    $("#dNow").textContent = brl(p.price);
    const parc = p.price >= 30 ? `<b>${PARC}x de ${brl(p.price / PARC)}</b> sem juros, ou ` : "";
    $("#dTerms").innerHTML = `${parc}<b>${brl(p.price * (1 - PIX))}</b> no Pix`;
    $("#dThumbs").innerHTML = "";
    $("#sizeList").innerHTML = p.opts
      .map((s) => `<li><button type="button" data-v="${esc(s.v)}" ${s.ok ? "" : 'disabled aria-label="' + esc(s.v) + ', esgotado"'}>${esc(s.v)}</button></li>`)
      .join("");
    const optsTxt = p.opts.length ? p.opts.map((s) => (s.ok ? esc(s.v) : `<s>${esc(s.v)}</s>`)).join(", ") : esc(p.unit || "Única");
    const facts: [string, string][] = [
      ["Marca", esc(p.brand)],
      [p.opts.length ? "Opções" : "Apresentação", optsTxt],
      ["Frete", p.price >= FREE ? "Grátis para esta peça" : `Grátis acima de ${brl(FREE)}`],
    ];
    $("#dFacts").innerHTML = facts.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join("");
    $<HTMLAnchorElement>("#dWa").href = WA + "?text=" + encodeURIComponent(`Olá! Tenho uma dúvida sobre: ${p.name} (${p.sub}).`);
    $("#dCount").innerHTML = `<b>${String(i + 1).padStart(2, "0")}</b> de ${String(list.length).padStart(2, "0")}`;
    $("#dFav").dataset.fav = p.id;
    $("#dFav").setAttribute("aria-pressed", String(favs.includes(p.id)));
    chosen = p.avail.length === 1 ? p.avail[0].v : p.opts.length ? null : p.unit || "Única";
    setCta(p, false);
  }
  function setCta(p: Item, done: boolean, size?: string) {
    added = done;
    $("#cta").classList.toggle("done", done);
    $("#sizes").classList.remove("open");
    $("#ctaLbl").textContent = done ? `Na sacola${size ? ", " + size : ""}` : p.avail.length > 1 ? "Escolher opção" : "Adicionar à sacola";
    $("#cta").setAttribute("aria-expanded", "false");
    const note = $("#dNote");
    if (done) note.innerHTML = p.avail.length > 1 ? '<button type="button" id="again">Adicionar outra opção</button>' : "Toque no botão para ver a sacola.";
    else if (p.avail.length === 1) note.textContent = `Só resta a opção ${p.avail[0].v}.`;
    else if (p.opts.some((s) => !s.ok)) note.textContent = "Opções riscadas estão esgotadas.";
    else note.textContent = "";
  }
  const showDetail = (p: Item) => {
    fill(p);
    fitName();
    detail.style.setProperty("--sheet", $("#dPanel").offsetHeight + "px");
    detail.classList.add("show");
  };

  function open(id: string, instant?: boolean) {
    const p = item(id);
    const tile = p && tileOf(id);
    if (!p || !tile) return;
    closeLayers();
    if (tile.hidden) {
      fkey = "tudo";
      fq = "";
      apply(false);
    }
    clearTimers();
    const wasOpen = !!cur,
      prev = cur && tileOf(cur);
    if (!wasOpen) {
      const r = tile.getBoundingClientRect();
      far = !(r.bottom > 60 && r.top < innerHeight - 60);
      if (far) lightAll();
    }
    tile.classList.remove("unlit");
    cur = id;
    if (prev && prev !== tile) prev.classList.remove("is-on");
    tile.classList.add("is-on"); // 1. o LED da prateleira acende
    html.classList.add("zoom");
    wall.classList.add("zoomed");
    detail.classList.remove("show");
    seen(id);
    if (!wasOpen && far && !instant) {
      // aberto de outra seção: a parede surge já enquadrada
      aim(tile, false);
      wall.animate?.(
        [
          { opacity: 0, filter: "blur(6px)" },
          { opacity: 1, filter: "blur(0)" },
        ],
        { duration: ms(650), easing: "ease-out" },
      );
      later(() => showDetail(p), 320);
    } else {
      later(() => aim(tile, !instant, wasOpen), wasOpen || instant ? 0 : 150); // 2. a câmera chega perto
      later(() => showDetail(p), instant ? 0 : wasOpen ? 300 : 640); // 3. a ficha entra
    }
    try {
      history.replaceState(null, "", "#" + id);
    } catch {}
    if (!wasOpen) later(() => $("#back").focus({ preventScroll: true }), 700);
  }
  function close() {
    if (!cur) return;
    clearTimers();
    const tile = tileOf(cur);
    cur = null;
    detail.classList.remove("show");
    $("#sizes").classList.remove("open");
    try {
      history.replaceState(null, "", location.pathname + location.search);
    } catch {}
    shutNav();
    const done = () => {
      html.classList.remove("zoom");
      wall.classList.remove("cam", "pan");
      renderRecent();
      measure();
      tick();
    };
    if (far && wall.animate) {
      const a = wall.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms(260), fill: "forwards" });
      a.onfinish = () => {
        wall.classList.remove("cam", "pan", "zoomed");
        wall.style.transform = "";
        tile.classList.remove("is-on");
        done();
        a.cancel();
      };
      return;
    }
    wall.classList.add("cam");
    wall.classList.remove("pan");
    wall.style.transform = "";
    wall.classList.remove("zoomed");
    later(() => {
      done();
      tile.querySelector<HTMLElement>(".open")!.focus({ preventScroll: true });
    }, 1060);
    later(() => tile.classList.remove("is-on"), 1500); // o LED ainda fica um instante aceso
  }
  function step(d: number) {
    const list = visible(),
      i = list.indexOf(tileOf(cur!));
    open(list[(i + d + list.length) % list.length].dataset.id!);
  }

  on(wall, "click", (e: MouseEvent) => {
    const t0 = e.target as HTMLElement;
    if (t0.closest(".fav")) return;
    const t = t0.closest<HTMLElement>(".tile");
    if (!t) return;
    e.stopPropagation();
    if (t.dataset.id !== cur) open(t.dataset.id!);
  });
  on(stage, "click", (e: MouseEvent) => {
    if (cur && !(e.target as HTMLElement).closest("button,a,select")) close();
  });
  on($("#back"), "click", close);
  on($("#prev"), "click", () => step(-1));
  on($("#next"), "click", () => step(1));

  // deslizar para o lado troca de peça no celular
  let tx: number | null = null,
    ty = 0;
  on(
    stage,
    "touchstart",
    (e: TouchEvent) => {
      if (cur) {
        tx = e.touches[0].clientX;
        ty = e.touches[0].clientY;
      }
    },
    { passive: true },
  );
  on(stage, "touchend", (e: TouchEvent) => {
    if (!cur || tx === null) return;
    const dx = e.changedTouches[0].clientX - tx,
      dy = e.changedTouches[0].clientY - ty;
    tx = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      e.preventDefault();
      step(dx < 0 ? 1 : -1);
    }
  });
  on(
    document,
    "touchmove",
    (e: TouchEvent) => {
      if (cur && !(e.target as HTMLElement).closest(".drawer,.search")) e.preventDefault();
    },
    { passive: false },
  );

  /* ---------- botão de compra ---------- */
  on($("#cta"), "click", () => {
    const p = cur && item(cur);
    if (!p) return;
    if (added) return openLayer("bag");
    if (!chosen) {
      const o = $("#sizes").classList.toggle("open");
      $("#cta").setAttribute("aria-expanded", String(o));
      if (o) $("#sizeList button:not(:disabled)")?.focus();
      return;
    }
    add(p, chosen);
  });
  on($("#sizeList"), "click", (e: MouseEvent) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>("button");
    if (!b || b.disabled) return;
    add(item(cur!)!, b.dataset.v!);
    $("#cta").focus();
  });
  on($("#dNote"), "click", (e: MouseEvent) => {
    if ((e.target as HTMLElement).id === "again") {
      chosen = null;
      setCta(item(cur!)!, false);
      $("#sizes").classList.add("open");
    }
  });
  on(document, "click", (e: MouseEvent) => {
    const t = e.target as HTMLElement;
    if (!t.closest(".cta-wrap") && t.id !== "again") $("#sizes").classList.remove("open");
  });

  /* ---------- favoritos ---------- */
  let favs = store.get<string[]>(KEY.fav, []).filter((id) => byId[id]);
  function renderFavs() {
    $("#favn").textContent = String(favs.length);
    $("#favBtn").classList.toggle("has", favs.length > 0);
    $("#mFavN").textContent = String(favs.length);
    $("#mFavN").classList.toggle("has", favs.length > 0);
    $("#favBtn").setAttribute("aria-label", `Favoritos, ${favs.length}`);
    $$("[data-fav]").forEach((b) => b.setAttribute("aria-pressed", String(favs.includes(b.dataset.fav!))));
    $("#favItems").innerHTML = favs.length
      ? favs
          .map((id) => {
            const p = item(id)!;
            return `<div class="it"><img src="${photo(p, true)}" alt=""><div><div class="nm">${esc(p.name)}</div><div class="sz">${esc(p.sub)}</div><button type="button" class="see" data-open="${id}">Ver peça</button></div><div class="r"><b>${brl(p.price)}</b><button type="button" class="lnk" data-fav="${id}">Remover</button></div></div>`;
          })
          .join("")
      : '<div class="empty"><b>Nada salvo ainda</b>Toque no coração de uma peça para guardá-la aqui.</div>';
  }
  on(
    document,
    "click",
    (e: MouseEvent) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>("[data-fav]");
      if (!b) return;
      e.preventDefault();
      e.stopPropagation();
      const id = b.dataset.fav!,
        isOn = !favs.includes(id);
      favs = isOn ? [...favs, id] : favs.filter((x) => x !== id);
      store.set(KEY.fav, favs);
      renderFavs();
      if (b.classList.contains("fav")) {
        b.classList.remove("pop");
        void b.offsetWidth;
        b.classList.add("pop");
      }
      toast(isOn ? "Salvo nos favoritos" : "Removido dos favoritos");
    },
    true,
  );

  /* ---------- vistos recentemente ---------- */
  let recent: string[] = [];
  try {
    recent = (JSON.parse(sessionStorage.getItem(KEY.seen) || "[]") as string[]).filter((id) => byId[id]);
  } catch {}
  function seen(id: string) {
    recent = [id, ...recent.filter((x) => x !== id)].slice(0, 10);
    try {
      sessionStorage.setItem(KEY.seen, JSON.stringify(recent));
    } catch {}
  }
  function renderRecent() {
    $("#recent").hidden = recent.length < 2;
    $("#rcRail").innerHTML = recent.map((id) => card(item(id)!)).join("");
  }

  /* ---------- sacola ---------- */
  const bag = store.get<BagLine[]>(KEY.bag, []).filter((i) => byId[i.id]);
  let coupon = false;
  function add(p: Item, size: string) {
    const k = bag.find((i) => i.id === p.id && i.size === size);
    if (k) k.q++;
    else bag.push({ id: p.id, size, q: 1 });
    store.set(KEY.bag, bag);
    setCta(p, true, p.opts.length ? size : "");
    fly();
    renderBag();
  }
  function fly() {
    // um ponto de luz sai do botão e cai na sacola
    const btn = $("#bagbtn");
    const bump = () => {
      btn.classList.remove("bump");
      void btn.offsetWidth;
      btn.classList.add("bump");
    };
    if (reduce || !document.body.animate) return bump();
    const a = $("#cta .ic").getBoundingClientRect(),
      b = $("#bagn").getBoundingClientRect();
    const dot = document.createElement("i");
    dot.className = "fly";
    dot.style.left = a.left + a.width / 2 + "px";
    dot.style.top = a.top + a.height / 2 + "px";
    document.body.appendChild(dot);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2),
      dy = b.top + b.height / 2 - (a.top + a.height / 2);
    dot.animate(
      [
        { transform: "translate(0,0) scale(1)" },
        { transform: `translate(${dx * 0.5}px,${dy * 0.92}px) scale(1.2)`, offset: 0.6 },
        { transform: `translate(${dx}px,${dy}px) scale(.4)` },
      ],
      { duration: 720, easing: "cubic-bezier(.5,0,.3,1)" },
    ).onfinish = () => {
      dot.remove();
      bump();
    };
  }
  function renderBag() {
    const n = bag.reduce((a, i) => a + i.q, 0);
    $("#bagn").textContent = String(n);
    $("#bagbtn").classList.toggle("has", n > 0);
    $("#mBagN").textContent = String(n);
    $("#mBagN").classList.toggle("has", n > 0);
    $("#bagbtn").setAttribute("aria-label", `Sacola, ${n} ${n === 1 ? "item" : "itens"}`);
    $("#items").innerHTML = bag.length
      ? bag
          .map((i, k) => {
            const p = item(i.id)!;
            return `
<div class="it"><img src="${photo(p, true)}" alt="">
<div><div class="nm">${esc(p.name)}</div><div class="sz">${esc(p.opts.length ? i.size : p.unit || p.sub)}</div>
<div class="q"><button type="button" data-k="${k}" data-d="-1" aria-label="Diminuir">−</button><span>${i.q}</span><button type="button" data-k="${k}" data-d="1" aria-label="Aumentar">+</button></div></div>
<div class="r"><b>${brl(p.price * i.q)}</b><button type="button" class="lnk" data-k="${k}" data-d="0">Remover</button></div></div>`;
          })
          .join("")
      : '<div class="empty"><b>Sua sacola está vazia</b>Escolha uma peça na parede para começar.</div>';
    const sub = bag.reduce((a, i) => a + byId[i.id].price * i.q, 0),
      off = coupon ? sub * STORE.coupon.rate : 0,
      tot = sub - off;
    const left = FREE - tot;
    $("#shipTxt").textContent = !bag.length ? `Frete grátis acima de ${brl(FREE)}` : left > 0 ? `Faltam ${brl(left)} para o frete grátis` : "Você ganhou frete grátis";
    $("#shipBar").style.width = Math.min(100, (tot / FREE) * 100) + "%";
    $("#totals").innerHTML =
      `<div><dt>Subtotal</dt><dd>${brl(sub)}</dd></div>` +
      (coupon ? `<div><dt>Cupom ${CUPOM}</dt><dd>− ${brl(off)}</dd></div>` : "") +
      `<div><dt>Frete</dt><dd>${bag.length && left <= 0 ? "Grátis" : "Calculado no checkout"}</dd></div><div class="tot"><dt>Total</dt><dd>${brl(tot)}</dd></div><div class="pix"><dt>No Pix</dt><dd>${brl(tot * (1 - PIX))}</dd></div>`;
    $<HTMLButtonElement>("#go").disabled = !bag.length;
    $("#msg").textContent = "";
    $("#waOrder").setAttribute("aria-disabled", String(!bag.length));
    $<HTMLAnchorElement>("#waOrder").href =
      WA +
      "?text=" +
      encodeURIComponent(
        "Olá! Quero fazer este pedido:\n" +
          bag
            .map((i) => {
              const p = item(i.id)!;
              return `${i.q}x ${p.name} (${p.opts.length ? i.size : p.sub}): ${brl(p.price * i.q)}`;
            })
            .join("\n") +
          (coupon ? `\nCupom: ${CUPOM}` : "") +
          `\nTotal: ${brl(tot)}`,
      );
  }
  on($("#items"), "click", (e: MouseEvent) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>("button[data-k]");
    if (!b) return;
    const k = +b.dataset.k!,
      d = +b.dataset.d!,
      was = bag[k];
    if (d === 0 || bag[k].q + d < 1) bag.splice(k, 1);
    else bag[k].q += d;
    store.set(KEY.bag, bag);
    renderBag();
    if (cur && was.id === cur && !bag.some((i) => i.id === cur)) {
      const p = item(cur)!;
      chosen = p.avail.length === 1 ? p.avail[0].v : p.opts.length ? null : chosen;
      setCta(p, false);
    }
  });
  on($("#coupon"), "submit", (e: Event) => {
    e.preventDefault();
    const v = $<HTMLInputElement>("#couponIn").value.trim().toUpperCase();
    coupon = v === CUPOM;
    renderBag();
    $("#msg").textContent = coupon
      ? `Cupom aplicado: ${STORE.coupon.rate * 100}% de desconto.`
      : v
        ? "Esse cupom não existe. Confira o código e tente de novo."
        : "";
  });
  on($("#go"), "click", () => {
    // PONTO DE INTEGRAÇÃO: aqui entra o checkout e o gateway de pagamento.
    $("#msg").textContent = "Este é um protótipo de front-end: o checkout entra na próxima etapa.";
  });

  /* ---------- gavetas e busca ---------- */
  let layer: string | null = null,
    lastFocus: Element | null = null;
  function openLayer(id: string) {
    if (layer) closeLayers(true);
    lastFocus = document.activeElement;
    layer = id;
    if (id === "menu") menuSub(null);
    const el = $("#" + id);
    el.inert = false;
    el.classList.add("open");
    $("#veil").classList.add("open");
    html.classList.add("lock");
    const f = el.querySelector<HTMLElement>("input:not([type=hidden]),[data-close]");
    if (f) setTimeout(() => f.focus(), 60);
  }
  function closeLayers(keep?: boolean) {
    if (!layer) return;
    const el = $("#" + layer);
    el.classList.remove("open");
    el.inert = true;
    layer = null;
    if (!keep) {
      $("#veil").classList.remove("open");
      html.classList.remove("lock");
      (lastFocus as HTMLElement | null)?.focus?.({ preventScroll: true });
    }
  }
  on($("#bagbtn"), "click", () => openLayer("bag"));
  on($("#favBtn"), "click", () => openLayer("favs"));
  on($("#menuBtn"), "click", () => openLayer("menu"));
  on($("#searchBtn"), "click", () => {
    openLayer("search");
    renderSearch();
  });
  on($("#veil"), "click", () => closeLayers());
  on(document, "click", (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-close]")) closeLayers();
  });

  const sIn = $<HTMLInputElement>("#sIn");
  function renderSearch() {
    const q = norm(sIn.value.trim()),
      words = q.split(/\s+/).filter(Boolean);
    const res = q ? P.filter((p) => words.every((w) => p.hay.includes(w))) : [];
    $("#sChips").hidden = !!q;
    $("#sHint").textContent = !q
      ? "Atalhos"
      : res.length
        ? `${res.length} ${res.length === 1 ? "resultado" : "resultados"}`
        : `Nada encontrado para “${sIn.value.trim()}”. Tente “seda”, “narguilé” ou “zomo”.`;
    $("#sRes").innerHTML = res
      .slice(0, 6)
      .map(
        (p) =>
          `<button type="button" data-open="${p.id}"><img src="${photo(p, true)}" alt=""><span class="nm">${esc(p.name)}<span class="sb">${esc(p.sub)}</span></span><b>${brl(p.price)}</b></button>`,
      )
      .join("");
    const all = $("#sAll");
    all.hidden = res.length <= 6;
    all.textContent = `Ver os ${res.length} resultados na parede`;
  }
  on(sIn, "input", renderSearch);
  on($("#sForm"), "submit", (e: Event) => {
    e.preventDefault();
    const v = sIn.value.trim();
    if (v) goWall("tudo", v);
  });
  on($("#sAll"), "click", () => goWall("tudo", sIn.value.trim()));

  /* ---------- cliques globais: abrir peça, ir para a parede, filtros ---------- */
  on(document, "click", (e: MouseEvent) => {
    const t = e.target as HTMLElement;
    const o = t.closest<HTMLElement>("[data-open]");
    if (o) {
      e.preventDefault();
      return open(o.dataset.open!);
    }
    const g = t.closest<HTMLElement>("[data-go]");
    if (g) {
      e.preventDefault();
      (document.activeElement as HTMLElement | null)?.blur?.();
      shutNav();
      return goWall(g.dataset.go as FilterKey);
    }
    const f = t.closest<HTMLElement>("[data-f]");
    if (f) return setFilter(f.dataset.f as FilterKey);
    if (t.closest("[data-clearq]")) return setFilter(fkey, "");
    const j = t.closest<HTMLElement>("[data-jump]");
    if (j) {
      e.preventDefault();
      closeLayers();
      return $(j.dataset.jump!).scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    }
    if (t.closest("[data-soon]")) return toast("Esta página entra na próxima etapa do projeto.");
  });
  on($("#home"), "click", (e: Event) => {
    e.preventDefault();
    if (cur) close();
    scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });
  on($("#up"), "click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
  on(window, "keydown", (e: KeyboardEvent) => {
    if (gateOpen) return;
    if (e.key === "Escape") {
      if (layer) closeLayers();
      else if ($("#sizes").classList.contains("open")) $("#sizes").classList.remove("open");
      else close();
      return;
    }
    if (e.key === "/" && !layer && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName ?? "")) {
      e.preventDefault();
      openLayer("search");
      renderSearch();
      return;
    }
    if (!cur || layer) return;
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
  on($("#copy"), "click", async (e: Event) => {
    const b = e.target as HTMLElement;
    try {
      await navigator.clipboard.writeText(CUPOM);
      b.textContent = "Cupom copiado";
    } catch {
      b.textContent = `O cupom é ${CUPOM}`;
    }
  });
  on($("#news"), "submit", (e: Event) => {
    e.preventDefault();
    const v = $<HTMLInputElement>("#newsIn").value.trim(),
      ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    // PONTO DE INTEGRAÇÃO: enviar o e-mail para o backend.
    $("#newsMsg").textContent = ok
      ? "E-mail válido. Neste protótipo o cadastro ainda não é enviado: ele entra junto com o back-end."
      : "Digite um e-mail completo, como nome@exemplo.com.";
  });

  /* ---------- verificação de idade ---------- */
  const gate = $("#gate");
  let gateOpen = false;
  if (!store.get<boolean>(KEY.age, false)) {
    gateOpen = true;
    gate.inert = false;
    gate.classList.add("open");
    html.classList.add("lock");
    setTimeout(() => $("#gateYes").focus(), 80);
  }
  on($("#gateYes"), "click", () => {
    store.set(KEY.age, true);
    gateOpen = false;
    gate.classList.remove("open");
    gate.inert = true;
    if (!layer) html.classList.remove("lock");
  });
  on($("#gateNo"), "click", () => {
    $("#gateH").textContent = "Volte quando tiver 18";
    $("#gateTxt").textContent = "A venda de produtos de tabacaria é proibida para menores de idade.";
    $("#gateNo").hidden = true;
    $("#gateYes").textContent = "Respondi errado, tenho 18 ou mais";
  });

  /* ---------- animações ligadas ao scroll ---------- */
  const words = $$("#say .w");
  const cats = $("#cats"),
    track = $("#track"),
    cbar = $("#cbar"),
    prog = $("#prog"),
    mv = $("#mv"),
    collage = $("#collage"),
    up = $("#up"),
    say = $("#say");
  let over = 0,
    pinOn = false,
    maxY = 1,
    mqW = 1,
    ticking = false;
  function measure() {
    pinOn = innerWidth >= 760 && !reduce;
    over = pinOn ? Math.max(0, track.scrollWidth - innerWidth) : 0;
    cats.style.height = pinOn && over ? `calc(100vh + ${over}px)` : "";
    if (!pinOn) track.style.transform = "";
    maxY = Math.max(1, html.scrollHeight - innerHeight);
    mqW = $("#run").scrollWidth / 4 || 1;
  }
  function tick() {
    ticking = false;
    if (cur) return;
    const y = scrollY,
      vh = innerHeight;
    prog.style.transform = `scaleX(${clamp(y / maxY, 0, 1)})`;
    up.classList.toggle("show", y > vh * 1.2);
    if (reduce) {
      words.forEach((w) => w.classList.add("on"));
      return;
    }
    if (y < vh * 1.4) hero.style.setProperty("--sy", y.toFixed(1));
    mv.style.transform = `translate3d(${-((y * 0.35) % mqW)}px,0,0)`;
    if (pinOn && over) {
      const p = clamp(-cats.getBoundingClientRect().top / over, 0, 1);
      track.style.transform = `translate3d(${-p * over}px,0,0)`;
      cbar.style.transform = `scaleX(${p})`;
      cats.style.setProperty("--cp", p.toFixed(4));
    }
    const sr = say.getBoundingClientRect();
    if (sr.top < vh && sr.bottom > 0) {
      const n = Math.round(clamp((vh * 0.86 - sr.top) / (vh * 0.5), 0, 1) * words.length);
      words.forEach((w, i) => w.classList.toggle("on", i < n));
    }
    const cr = collage.getBoundingClientRect();
    if (cr.top < vh && cr.bottom > 0 && innerWidth >= 760) collage.style.setProperty("--py2", (cr.top + cr.height / 2 - vh / 2).toFixed(1));
  }
  on(
    window,
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(tick);
      }
    },
    { passive: true },
  );
  let rz = 0;
  on(window, "resize", () => {
    cancelAnimationFrame(rz);
    rz = requestAnimationFrame(() => {
      measure();
      fitHero();
      if (cur) {
        aim(tileOf(cur), false);
        fitName();
        detail.style.setProperty("--sheet", $("#dPanel").offsetHeight + "px");
      } else tick();
    });
  });
  on(window, "load", () => {
    measure();
    tick();
  });

  /* luz que acompanha o cursor na parede */
  if (matchMedia("(hover:hover)").matches && !reduce) {
    let raf = 0;
    const bg = $("#wallbg");
    on(
      window,
      "pointermove",
      (e: PointerEvent) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          bg.style.setProperty("--mx", e.clientX + "px");
          bg.style.setProperty("--my", e.clientY + "px");
        });
      },
      { passive: true },
    );
  }

  apply(false);
  renderFavs();
  renderBag();
  renderRecent();
  measure();
  tick();
  const start = decodeURIComponent(location.hash.slice(1));
  if (byId[start])
    requestAnimationFrame(() => {
      lightAll();
      open(start, true);
    });

  return () => {
    ac.abort();
    intervals.forEach(clearInterval);
    clearInterval(hTimer);
    clearTimeout(toastT);
    clearTimers();
    observers.forEach((o) => o.disconnect());
    html.classList.remove("zoom", "lock");
  };
}
