import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { z } from 'zod';
import DeliveryStatusSelect, {
    type DeliveryStatus,
} from '../components/DeliveryStatusSelect';

import {
    deliverySchema,
    type DeliveryInput,
} from '../schemas/delivery';

type Delivery = DeliveryInput & {
    id: number;
    status: DeliveryStatus;
};

type Props = {
    deliveries: Delivery[];
};

function DeliveryIllustration() {
    return (
        <svg viewBox="0 0 560 380" role="img" aria-label="Decorative floating parcel above an orbital delivery route" className="ff-art">
            <defs>
                <linearGradient id="ff-box-top" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#ffcfaf" /><stop offset="1" stopColor="#ff9b66" />
                </linearGradient>
                <linearGradient id="ff-box-side" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#fd8d54" /><stop offset="1" stopColor="#e76536" />
                </linearGradient>
            </defs>
            <circle cx="285" cy="190" r="145" fill="#e9e4ff" />
            <circle cx="285" cy="190" r="115" fill="none" stroke="#d3c8ff" strokeDasharray="3 9" />
            <ellipse cx="285" cy="266" rx="190" ry="66" fill="none" stroke="#b9a9f3" strokeWidth="1.5" transform="rotate(-15 285 266)" />
            <ellipse cx="285" cy="266" rx="190" ry="66" fill="none" stroke="#7358d8" strokeWidth="2" strokeDasharray="6 13" transform="rotate(-15 285 266)" className="ff-dash" />
            <ellipse cx="283" cy="288" rx="80" ry="17" fill="#b4a3e6" opacity=".22" className="ff-shadow" />
            <g className="ff-parcel">
                <path d="M190 149L282 101L379 150L285 202Z" fill="url(#ff-box-top)" />
                <path d="M190 149L285 202V295L190 241Z" fill="url(#ff-box-side)" />
                <path d="M285 202L379 150V241L285 295Z" fill="#ffb17c" />
                <path d="M224 131L319 183L339 172L244 120Z" fill="#fff2df" opacity=".9" />
                <path d="M319 183V222L339 211V172Z" fill="#fff2df" opacity=".9" />
                <path d="M210 207L249 229V251L210 229Z" fill="#fff3e7" />
                <path d="M217 218L242 232M217 224L234 234" stroke="#b07860" strokeWidth="2" />
                <path d="M349 231V213M343 221L349 213L355 215" fill="none" stroke="#9b4b2d" strokeWidth="2" strokeLinecap="round" />
            </g>
            <g className="ff-pin">
                <circle cx="435" cy="122" r="27" fill="#fff" />
                <path d="M435 107C416 107 420 128 435 140C450 128 454 107 435 107Z" fill="#7860d8" />
                <circle cx="435" cy="119" r="5" fill="white" />
            </g>
            <g className="ff-satellite">
                <rect x="63" y="174" width="126" height="49" rx="16" fill="#fff" />
                <circle cx="87" cy="198" r="12" fill="#e2f5eb" />
                <path d="M82 198L86 202L93 194" fill="none" stroke="#28855f" strokeWidth="2" />
                <text x="107" y="195" fontSize="9" fill="#8b879c" fontFamily="system-ui">NEXT STOP</text>
                <text x="107" y="210" fontSize="11" fill="#343047" fontWeight="600" fontFamily="system-ui">Possibilities.</text>
            </g>
            <g fill="#937de0">
                <path d="M147 90V106M139 98H155" stroke="#937de0" strokeWidth="2" />
                <circle cx="411" cy="285" r="5" />
                <circle cx="168" cy="290" r="3" />
                <path d="M353 53V65M347 59H359" stroke="#937de0" strokeWidth="2" />
            </g>
        </svg>
    );
}

const dashboardStyles = `
.ff-app{--ink:#292638;--muted:#7b778c;--purple:#7255cf;--line:#e9e5ef;color:var(--ink);background:#f8f7fb;min-height:100vh;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;padding:0 28px 36px}
.ff-app *{box-sizing:border-box}.ff-shell{max-width:1250px;margin:auto}.ff-nav{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:23px 0;border-bottom:1px solid var(--line)}
.ff-brand{font-size:23px;font-weight:800;letter-spacing:-1px;display:flex;align-items:center;gap:10px}.ff-logo{display:grid;place-items:center;background:var(--ink);color:#dfd1ff;border-radius:13px;width:37px;height:37px;font-size:22px}.ff-brand small{color:var(--purple)}
.ff-navlinks{display:flex;align-items:center;gap:7px}.ff-navlinks a{font-size:12px;text-decoration:none;color:var(--muted);padding:10px 15px;border-radius:20px}.ff-navlinks a:first-child{background:#ebe5fa;color:#6247bd}.ff-tag{font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:var(--muted)}
.ff-heading{display:flex;justify-content:space-between;align-items:end;gap:16px;padding:34px 0 24px}.ff-heading h1{font-size:clamp(24px,3vw,36px);font-weight:650;letter-spacing:-1.5px;margin:6px 0}.ff-heading p{font-size:13px;color:var(--muted);margin:8px 0 0}.ff-motion{font-size:11px;border:1px solid #ddd7e9;background:white;padding:9px 13px;border-radius:20px;cursor:pointer;white-space:nowrap}
.ff-hero{position:relative;display:grid;grid-template-columns:1fr 1fr;align-items:center;background:#eee9fc;border:1px solid #e8e0fa;border-radius:28px;overflow:hidden;min-height:330px}.ff-hero:before{content:'';position:absolute;width:280px;height:280px;border:1px solid #d9cff3;border-radius:50%;left:-170px;top:95px}.ff-hero-copy{padding:38px 0 38px 42px;z-index:1}.ff-pill{display:inline-flex;gap:7px;align-items:center;background:#fff9;border:1px solid #fff;font-size:10px;font-weight:600;letter-spacing:1.2px;padding:7px 11px;border-radius:20px}.ff-pill i{width:6px;height:6px;background:#9272e7;border-radius:50%}.ff-hero h2{font-size:clamp(31px,4vw,51px);line-height:1.08;font-weight:650;letter-spacing:-2px;margin:22px 0 15px}.ff-hero h2 em{font-family:Georgia,serif;font-weight:400;color:#7659c2}.ff-hero p{color:#787087;font-size:13px;line-height:1.8;max-width:320px}.ff-cta{display:inline-flex;align-items:center;gap:28px;background:var(--ink);color:white!important;text-decoration:none;padding:13px 18px;border-radius:12px;font-size:12px;margin-top:20px;transition:transform .2s,background .2s}.ff-cta:hover{transform:translateY(-2px);background:#4e3d74}.ff-art{width:100%;height:100%;max-height:350px;overflow:visible}
.ff-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:22px 0}.ff-stat{background:white;border:1px solid var(--line);border-radius:20px;padding:21px;display:flex;justify-content:space-between;gap:12px;transition:transform .2s,box-shadow .2s}.ff-stat:hover{transform:translateY(-3px);box-shadow:0 12px 24px #39304e08}.ff-stat p{font-size:11px;color:var(--muted);margin:0}.ff-stat strong{display:block;font-size:34px;font-weight:600;letter-spacing:-1.5px;margin:8px 0}.ff-stat small{font-size:10px;color:var(--muted)}.ff-stat-icon{display:grid;place-items:center;border-radius:14px;width:43px;height:43px;font-size:19px;flex-shrink:0}.ff-lilac{background:#f0ebfd;color:#8060d8}.ff-peach{background:#fff0e6;color:#d6824d}.ff-mint{background:#e9f6ed;color:#4f9470}
.ff-workspace{display:grid;grid-template-columns:350px minmax(0,1fr);gap:22px;align-items:start}.ff-panel{border:1px solid var(--line);border-radius:23px;background:white;padding:25px;scroll-margin-top:20px}.ff-section-head{display:flex;justify-content:space-between;align-items:start;gap:12px}.ff-panel h2{font-size:18px;font-weight:650;letter-spacing:-.5px;margin:7px 0}.ff-panel .ff-sub{font-size:11px;color:var(--muted);line-height:1.7;margin:7px 0}.ff-step{display:grid;place-items:center;border:1px solid var(--line);border-radius:11px;width:32px;height:32px;font-size:11px;color:#9a91ac}.ff-app form label{font-size:11px;font-weight:600}.ff-app form input,.ff-app form textarea,.ff-search{width:100%;background:#faf9fc;border:1px solid #e8e3ef;border-radius:11px;padding:12px;font-size:12px;color:var(--ink);transition:border-color .2s,box-shadow .2s}.ff-app input:focus,.ff-app textarea:focus,.ff-app select:focus{outline:2px solid #9c82e2;outline-offset:2px}.ff-app form button[type=submit]{background:var(--purple);font-size:12px;border-radius:11px;transition:background .2s,transform .2s}.ff-app form button[type=submit]:hover{background:#6244bc;transform:translateY(-1px)}.ff-help{border-top:1px dashed var(--line);margin-top:22px;padding-top:16px;font-size:10px;line-height:1.8;color:var(--muted)}
.ff-tools{margin:20px 0 17px}.ff-filters{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}.ff-filter{border:1px solid transparent;background:transparent;color:var(--muted);font-size:10px;border-radius:8px;padding:7px 10px;cursor:pointer}.ff-filter[aria-pressed=true]{background:#f0ebfa;color:#6e4ebe;border-color:#e3d9f7}.ff-count{background:#f3f0f8;color:#8c81a0;padding:5px 9px;border-radius:8px;font-size:10px}
.ff-list{list-style:none;padding:0;margin:0;display:grid;gap:12px}.ff-delivery{border:1px solid var(--line);border-radius:15px;padding:17px;transition:border-color .2s,box-shadow .2s}.ff-delivery:hover{border-color:#cdbced;box-shadow:0 6px 18px #7255cf08}.ff-card-top{display:flex;align-items:center;justify-content:space-between;gap:10px}.ff-id{font:10px ui-monospace,monospace;color:#9b92aa;letter-spacing:1px}.ff-badge{font-size:9px;font-weight:600;letter-spacing:.2px;padding:5px 8px;border-radius:7px}.ff-badge-pending{background:#fff4df;color:#a47728}.ff-badge-assigned{background:#f0eafa;color:#805abb}.ff-badge-in_transit{background:#eaf1ff;color:#547cc2}.ff-badge-delivered{background:#e9f5ed;color:#4a8b64}.ff-delivery h3{font-size:14px;font-weight:650;margin:13px 0 6px}.ff-address{white-space:pre-line;overflow-wrap:anywhere;color:var(--muted);font-size:11px;line-height:1.8;margin:0}.ff-status-control{border-top:1px solid #f0edf5;margin-top:14px;padding-top:2px}.ff-status-control label{font-size:10px;color:var(--muted)}.ff-status-control select{font-size:11px;padding:7px 9px;border-radius:8px;border-color:var(--line)}.ff-status-control p{font-size:10px}
.ff-empty{text-align:center;padding:40px 12px}.ff-empty-orb{display:grid;place-items:center;width:58px;height:58px;border-radius:20px;background:#f1ebfc;color:#9c80dd;font-size:28px;margin:auto auto 15px;transform:rotate(-8deg)}.ff-empty h3{font-size:14px;margin:10px 0}.ff-empty p{font-size:11px;color:var(--muted);line-height:1.8}.ff-footer{display:flex;justify-content:space-between;gap:10px;padding-top:26px;font-size:10px;color:#a69eb4}
@keyframes ff-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes ff-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}@keyframes ff-shadow{0%,100%{opacity:.22;transform:scaleX(1)}50%{opacity:.12;transform:scaleX(.8)}}@keyframes ff-dash{to{stroke-dashoffset:-76}}
.ff-enter{animation:ff-rise .6s ease-out both}.ff-parcel{animation:ff-float 5s ease-in-out infinite}.ff-satellite{animation:ff-float 6s ease-in-out infinite;animation-delay:-2s}.ff-pin{animation:ff-float 5.5s ease-in-out infinite;animation-delay:-3s}.ff-shadow{animation:ff-shadow 5s ease-in-out infinite;transform-origin:283px 288px}.ff-dash{animation:ff-dash 5s linear infinite}.ff-paused *{animation-play-state:paused!important}
@media(max-width:950px){.ff-workspace{grid-template-columns:310px minmax(0,1fr)}.ff-hero-copy{padding-left:28px}.ff-tag{display:none}}
@media(max-width:720px){.ff-app{padding:0 16px 26px}.ff-navlinks{display:none}.ff-heading{align-items:start}.ff-heading h1{letter-spacing:-1px}.ff-hero{grid-template-columns:1fr}.ff-hero-copy{padding:28px 28px 0}.ff-art{height:230px}.ff-workspace{grid-template-columns:1fr}.ff-stats{gap:8px}.ff-stat{padding:15px 11px}.ff-stat-icon{display:none}.ff-stat strong{font-size:28px}.ff-stat small{font-size:9px}.ff-panel{padding:21px}.ff-footer{flex-direction:column}.ff-motion{font-size:10px;padding:8px 10px}}
@media(prefers-reduced-motion:reduce){.ff-app *{animation:none!important;transition:none!important}.ff-cta:hover,.ff-stat:hover,.ff-app form button[type=submit]:hover{transform:none}}
`;

export default function Dashboard({ deliveries }: Props) {
    const customerRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLTextAreaElement>(null);
    const [notice, setNotice] = useState('');
    const [search, setSearch] = useState('');
    const [paused, setPaused] = useState('');
    const [filter, setFilter] = useState('all');
    const completed = deliveries.filter((item) => item.status === 'delivered').length;
    const query = search.trim().toLowerCase();
    const visibleDeliveries = deliveries.filter((item) =>
        `${item.id} ${item.customer_name} ${item.delivery_address}`
            .toLowerCase().includes(query) && (filter === 'all' || item.status === filter),
    );

    const form = useForm<DeliveryInput>({
        customer_name: '',
        delivery_address: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (form.processing) return;

        setNotice('');
        form.clearErrors();

        const result = deliverySchema.safeParse(form.data);

        if (!result.success) {
            const errors = z.flattenError(result.error).fieldErrors;

            if (errors.customer_name?.[0]) {
                form.setError('customer_name', errors.customer_name[0]);
            }

            if (errors.delivery_address?.[0]) {
                form.setError(
                    'delivery_address',
                    errors.delivery_address[0],
                );
            }

            if (errors.customer_name) {
                customerRef.current?.focus();
            } else {
                addressRef.current?.focus();
            }

            return;
        }

        // Submit the trimmed values produced by Zod.
        form.transform(() => result.data);

        form.post('/deliveries', {
            preserveScroll: true,

            onSuccess: () => {
                form.reset();
                setNotice('Delivery saved successfully.');
                customerRef.current?.focus();
            },

            onError: () => {
                setNotice('The server rejected the form. Check the fields.');
            },
        });
    }

    const labels: Record<DeliveryStatus, string> = {
        pending: 'Pending', assigned: 'Assigned',
        in_transit: 'In transit', delivered: 'Delivered',
    };

    return (
        <>
            <Head title="FleetFlow — A little more flow" />
            <style>{dashboardStyles}</style>
            <div className={`ff-app ${paused ? 'ff-paused' : ''}`}>
                <div className="ff-shell">
                    <header className="ff-nav">
                        <a href="#overview" className="ff-brand" aria-label="FleetFlow overview">
                            <span className="ff-logo" aria-hidden="true">↗</span>
                            fleetflow<small>.</small>
                        </a>
                        <nav className="ff-navlinks" aria-label="Page sections">
                            <a href="#overview">Overview</a>
                            <a href="#delivery-board">Deliveries</a>
                            <a href="#new-delivery">Create new +</a>
                        </nav>
                        <span className="ff-tag">Small details. Better journeys.</span>
                    </header>
                    <main id="overview">
                        <div className="ff-heading ff-enter">
                            <div>
                                <span className="ff-tag" style={{display:'block'}}>YOUR DELIVERY STUDIO</span>
                                <h1>A little more flow.</h1>
                                <p>Less busywork. More moving forward.</p>
                            </div>
                            <button type="button" className="ff-motion" aria-pressed={paused} onClick={() => setPaused(!paused)}>
                                {paused ? 'Play illustration ▷' : 'Pause illustration Ⅱ'}
                            </button>
                        </div>
                        <section className="ff-hero ff-enter" aria-labelledby="hero-heading">
                            <div className="ff-hero-copy">
                                <span className="ff-pill"><i aria-hidden="true" /> BUILT TO MOVE</span>
                                <h2 id="hero-heading">Good things.<br /><em>On their way.</em></h2>
                                <p>From a new request to a happy arrival. Give every delivery a beautifully simple journey.</p>
                                <a className="ff-cta" href="#new-delivery">Create a delivery <span aria-hidden="true">↗</span></a>
                            </div>
                            <DeliveryIllustration />
                        </section>
                        <section aria-label="Delivery summary" className="ff-stats">
                            {[
                                {label:'All deliveries',value:deliveries.length,detail:'Every journey starts here',icon:'◈',tone:'ff-lilac'},
                                {label:'In progress',value:deliveries.length-completed,detail:'Not yet marked delivered',icon:'↗',tone:'ff-peach'},
                                {label:'Delivered',value:completed,detail:'Arrived at the destination',icon:'✓',tone:'ff-mint'},
                            ].map((item,index) => (
                                <article key={item.label} className="ff-stat ff-enter" style={{animationDelay:`${index*80}ms`}}>
                                    <div><p>{item.label}</p><strong>{item.value}</strong><small>{item.detail}</small></div>
                                    <span aria-hidden="true" className={`ff-stat-icon ${item.tone}`}>{item.icon}</span>
                                </article>
                            ))}
                        </section>
                        <div className="ff-workspace">
                            <section className="ff-panel" id="new-delivery" aria-labelledby="create-heading">
                                <div className="ff-section-head">
                                    <div><span className="ff-tag" style={{display:'block'}}>MAKE THE FIRST MOVE</span><h2 id="create-heading">Something to send?</h2></div>
                                    <span className="ff-step" aria-hidden="true">01</span>
                                </div>
                                <p className="ff-sub">A name, a place, and you’re on your way.</p>
                                {notice && <p role="status" className="mt-4 rounded-lg bg-violet-50 p-3 text-sm text-violet-900">{notice}</p>}
                        <form
                            onSubmit={submit}
                            noValidate
                            className="mt-6 space-y-5"
                        >
                            <div>
                                <label
                                    htmlFor="customer_name"
                                    className="block font-medium"
                                >
                                    Customer name
                                </label>

                                <input
                                    ref={customerRef}
                                    id="customer_name"
                                    name="customer_name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={form.data.customer_name}
                                    onChange={(event) => {
                                        form.setData(
                                            'customer_name',
                                            event.target.value,
                                        );
                                        form.clearErrors('customer_name');
                                        setNotice('');
                                    }}
                                    aria-invalid={
                                        !!form.errors.customer_name
                                    }
                                    aria-describedby={
                                        form.errors.customer_name
                                            ? 'customer-error'
                                            : undefined
                                    }
                                    className="mt-1 w-full rounded-lg
                                               border border-slate-300 p-3
                                               bg-slate-50 transition focus:bg-white focus:outline-emerald-600"
                                />

                                {form.errors.customer_name && (
                                    <p
                                        id="customer-error"
                                        role="alert"
                                        className="mt-1 text-sm text-red-600"
                                    >
                                        {form.errors.customer_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="delivery_address"
                                    className="block font-medium"
                                >
                                    Delivery address
                                </label>

                                <textarea
                                    ref={addressRef}
                                    id="delivery_address"
                                    name="delivery_address"
                                    autoComplete="street-address"
                                    required
                                    rows={3}
                                    value={form.data.delivery_address}
                                    onChange={(event) => {
                                        form.setData(
                                            'delivery_address',
                                            event.target.value,
                                        );
                                        form.clearErrors('delivery_address');
                                        setNotice('');
                                    }}
                                    aria-invalid={
                                        !!form.errors.delivery_address
                                    }
                                    aria-describedby={
                                        form.errors.delivery_address
                                            ? 'address-error'
                                            : undefined
                                    }
                                    className="mt-1 w-full rounded-lg
                                               border border-slate-300 p-3
                                               bg-slate-50 transition focus:bg-white focus:outline-emerald-600"
                                />

                                {form.errors.delivery_address && (
                                    <p
                                        id="address-error"
                                        role="alert"
                                        className="mt-1 text-sm text-red-600"
                                    >
                                        {form.errors.delivery_address}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={form.processing}
                                className="w-full rounded-xl bg-emerald-800
                                           px-5 py-3 font-medium text-white
                                           hover:bg-emerald-900
                                           disabled:cursor-wait
                                           disabled:opacity-50"
                            >
                                {form.processing
                                    ? 'Saving…'
                                    : 'Create delivery ↗'}
                            </button>
                        </form>
                                <p className="ff-help">Your delivery starts as pending. Update its progress from the delivery board.</p>
                            </section>
                            <section className="ff-panel" id="delivery-board" aria-labelledby="board-heading">
                                <div className="ff-section-head">
                                    <div><span className="ff-tag" style={{display:'block'}}>THE BIG PICTURE</span><h2 id="board-heading">Your delivery board</h2></div>
                                    <span className="ff-count">{visibleDeliveries.length} results</span>
                                </div>
                                <div className="ff-tools">
                                    <label htmlFor="delivery-search" className="sr-only">Search deliveries</label>
                                    <input id="delivery-search" type="search" className="ff-search" placeholder="Search by name, address, or ID…" value={search} onChange={(event) => setSearch(event.target.value)} />
                                    <div className="ff-filters" role="group" aria-label="Filter by delivery status">
                                        {[['all','All deliveries'],...Object.entries(labels)].map(([value,label]) => (
                                            <button key={value} type="button" className="ff-filter" aria-pressed={filter===value} onClick={() => setFilter(value)}>{label}</button>
                                        ))}
                                    </div>
                                </div>
                                {visibleDeliveries.length===0 ? (
                                    <div className="ff-empty">
                                        <span className="ff-empty-orb" aria-hidden="true">◇</span>
                                        <h3>{deliveries.length===0 ? 'A fresh start. A new journey.' : 'Nothing on this route yet.'}</h3>
                                        <p>{deliveries.length===0 ? 'Create your first delivery using the form.' : 'Try a different search or status filter.'}</p>
                                    </div>
                                ) : (
                                    <ul className="ff-list">
                                        {visibleDeliveries.map((delivery) => (
                                            <li key={delivery.id} className="ff-delivery">
                                                <div className="ff-card-top">
                                                    <span className="ff-id">FF / {String(delivery.id).padStart(4,'0')}</span>
                                                    <span className={`ff-badge ff-badge-${delivery.status}`}>{labels[delivery.status]}</span>
                                                </div>
                                                <h3>{delivery.customer_name}</h3>
                                                <p className="ff-address">{delivery.delivery_address}</p>
                                                <div className="ff-status-control"><DeliveryStatusSelect deliveryId={delivery.id} status={delivery.status} /></div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        </div>
                    </main>
                    <footer className="ff-footer"><span>FleetFlow · A better way from here to there.</span><span>Thoughtfully organized. Always moving.</span></footer>
                </div>
            </div>
        </>
    );
}