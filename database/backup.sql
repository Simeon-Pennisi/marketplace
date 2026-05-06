--
-- PostgreSQL database dump
--

\restrict 4zi7bPrfPkJTXxhNKJYIJH6HD48XIdcZ4chh5rbdjZQsIndDCcQg1Uy6tPvvBsF

-- Dumped from database version 18.3 (Debian 18.3-1.pgdg12+1)
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: marketplace_demo_postgres_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO marketplace_demo_postgres_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: favorites; Type: TABLE; Schema: public; Owner: marketplace_demo_postgres_user
--

CREATE TABLE public.favorites (
    user_id integer NOT NULL,
    listing_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.favorites OWNER TO marketplace_demo_postgres_user;

--
-- Name: listings; Type: TABLE; Schema: public; Owner: marketplace_demo_postgres_user
--

CREATE TABLE public.listings (
    id integer NOT NULL,
    seller_id integer NOT NULL,
    title character varying(200) NOT NULL,
    price_cents integer NOT NULL,
    condition character varying(20) NOT NULL,
    category character varying(50) NOT NULL,
    brand character varying(100),
    technical_specs text,
    image_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true,
    CONSTRAINT listings_condition_check CHECK (((condition)::text = ANY ((ARRAY['new'::character varying, 'like_new'::character varying, 'good'::character varying, 'fair'::character varying])::text[])))
);


ALTER TABLE public.listings OWNER TO marketplace_demo_postgres_user;

--
-- Name: listings_id_seq; Type: SEQUENCE; Schema: public; Owner: marketplace_demo_postgres_user
--

CREATE SEQUENCE public.listings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.listings_id_seq OWNER TO marketplace_demo_postgres_user;

--
-- Name: listings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER SEQUENCE public.listings_id_seq OWNED BY public.listings.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: marketplace_demo_postgres_user
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    listing_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price_cents integer NOT NULL,
    line_total_cents integer NOT NULL
);


ALTER TABLE public.order_items OWNER TO marketplace_demo_postgres_user;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: marketplace_demo_postgres_user
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO marketplace_demo_postgres_user;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: marketplace_demo_postgres_user
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    buyer_id integer NOT NULL,
    subtotal_cents integer NOT NULL,
    tax_cents integer NOT NULL,
    shipping_cents integer NOT NULL,
    total_cents integer NOT NULL,
    status character varying(20) DEFAULT 'paid_simulated'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT orders_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'paid_simulated'::character varying, 'shipped'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.orders OWNER TO marketplace_demo_postgres_user;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: marketplace_demo_postgres_user
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO marketplace_demo_postgres_user;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: marketplace_demo_postgres_user
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    listing_id integer NOT NULL,
    user_id integer NOT NULL,
    rating integer NOT NULL,
    comment text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO marketplace_demo_postgres_user;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: marketplace_demo_postgres_user
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO marketplace_demo_postgres_user;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: marketplace_demo_postgres_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100),
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO marketplace_demo_postgres_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: marketplace_demo_postgres_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO marketplace_demo_postgres_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: listings id; Type: DEFAULT; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER TABLE ONLY public.listings ALTER COLUMN id SET DEFAULT nextval('public.listings_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: marketplace_demo_postgres_user
--

COPY public.favorites (user_id, listing_id, created_at) FROM stdin;
2	1	2026-02-19 19:31:29.861997+00
\.


--
-- Data for Name: listings; Type: TABLE DATA; Schema: public; Owner: marketplace_demo_postgres_user
--

COPY public.listings (id, seller_id, title, price_cents, condition, category, brand, technical_specs, image_url, created_at, updated_at, is_active) FROM stdin;
2	1	Lenovo ThinkPad X1 Carbon	89999	good	laptop	Lenovo	Intel i7, 16GB RAM, 512GB SSD, 14 inch FHD	https://placehold.co/400x300?text=ThinkPad+X1	2026-02-19 19:31:29.857935+00	2026-02-19 19:31:29.857935+00	t
3	1	Audio-Technica Studio Headphones	7999	like_new	audio	Audio-Technica	Closed-back, over-ear, great for mixing and casual listening	https://placehold.co/400x300?text=Headphones	2026-02-19 19:31:29.857935+00	2026-02-19 19:31:29.857935+00	t
4	3	Dell Speakers	8900	like_new	audio	Dell	Good condition Dell speakers. Have to sell because I'm moving	https://dellspeakers.com	2026-02-26 14:37:11.389211+00	2026-02-26 14:37:11.389211+00	t
5	1	Dell 27" 144Hz Monitor	19999	like_new	monitor	Dell	27 inch, 144Hz, 1ms response, 2560x1440	https://placehold.co/400x300?text=Dell+Monitor	2026-03-03 10:25:07.654228+00	2026-03-03 10:25:07.654228+00	t
6	1	Lenovo ThinkPad X1 Carbon	89999	good	laptop	Lenovo	Intel i7, 16GB RAM, 512GB SSD, 14 inch FHD	https://placehold.co/400x300?text=ThinkPad+X1	2026-03-03 10:25:07.654228+00	2026-03-03 10:25:07.654228+00	t
7	1	Audio-Technica Studio Headphones	7999	like_new	audio	Audio-Technica	Closed-back, over-ear, great for mixing and casual listening	https://placehold.co/400x300?text=Headphones	2026-03-03 10:25:07.654228+00	2026-03-03 10:25:07.654228+00	t
9	1	Dell 27" 144Hz Monitor	19999	like_new	monitor	Dell	27 inch, 144Hz, 1ms response, 2560x1440	https://placehold.co/400x300?text=Dell+Monitor	2026-03-03 10:49:23.362831+00	2026-03-03 10:49:23.362831+00	t
10	1	Lenovo ThinkPad X1 Carbon	89999	good	laptop	Lenovo	Intel i7, 16GB RAM, 512GB SSD, 14 inch FHD	https://placehold.co/400x300?text=ThinkPad+X1	2026-03-03 10:49:23.362831+00	2026-03-03 10:49:23.362831+00	t
11	1	Audio-Technica Studio Headphones	7999	like_new	audio	Audio-Technica	Closed-back, over-ear, great for mixing and casual listening	https://placehold.co/400x300?text=Headphones	2026-03-03 10:49:23.362831+00	2026-03-03 10:49:23.362831+00	t
13	1	Lenovo ThinkPad X1 Carbon	89999	good	laptop	Lenovo	Intel i7, 16GB RAM, 512GB SSD, 14 inch FHD	https://placehold.co/400x300?text=ThinkPad+X1	2026-03-03 11:13:43.556512+00	2026-03-03 11:13:43.556512+00	t
14	1	Audio-Technica Studio Headphones	7999	like_new	audio	Audio-Technica	Closed-back, over-ear, great for mixing and casual listening	https://placehold.co/400x300?text=Headphones	2026-03-03 11:13:43.556512+00	2026-03-03 11:13:43.556512+00	t
12	1	Dell 24" 144Hz Monitor	14999	good	monitor	Dell	Smaller 24 inch, 144Hz, 1ms response, 2560x1440	https://placehold.co/400x300?text=Dell+Monitor	2026-03-03 11:13:43.556512+00	2026-03-03 11:13:43.556512+00	t
15	1	White Laptop	39995	like_new	laptop	Gateway	Good condition Gateway laptop. Has a CD drive	https://www.pexels.com/photo/laptop-on-white-desk-8003992/	2026-04-15 05:21:22.706994+00	2026-04-15 05:21:22.706994+00	t
16	4	Universal Power Cord	1997	new	accessories	Wire Tech	90W power cord for all laptops	https://powercordimage.com	2026-04-21 14:02:09.305306+00	2026-04-21 14:02:09.305306+00	t
17	4	Dell Monitor	8999	fair	monitor	Dell	Large 34" Dell monitor, works well	https://dellmonitorImage.com	2026-04-21 14:38:25.762059+00	2026-04-21 14:38:25.762059+00	t
18	4	Bose speakers	5999	good	audio	Bose	good speakers	https://speakerImage.com	2026-04-21 14:47:30.202653+00	2026-04-21 14:47:30.202653+00	t
1	1	Dell 22" 88Hz Monitor	8999	like_new	monitor	Dell	22 inch, 88Hz, 1ms response, 2560x1440	https://placehold.co/400x300?text=Dell+Monitor	2026-02-19 19:31:29.857935+00	2026-02-19 19:31:29.857935+00	t
8	4	Demo Listing	7999	fair	monitor	Any Brand	Test listing description	https://validurl.com	2026-03-03 10:28:04.280506+00	2026-03-03 10:28:04.280506+00	t
19	4	Macintosh Monitor	39995	new	monitor	Macintosh	Vintage Macintosh monitor	https://macmonitorimage.com	2026-04-29 08:24:28.847934+00	2026-04-29 08:24:28.847934+00	t
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: marketplace_demo_postgres_user
--

COPY public.order_items (id, order_id, listing_id, quantity, unit_price_cents, line_total_cents) FROM stdin;
1	1	1	1	19999	19999
2	1	2	1	89999	89999
3	2	1	1	19999	19999
4	2	2	1	89999	89999
5	3	1	1	19999	19999
6	3	2	1	89999	89999
7	4	1	1	19999	19999
8	4	2	1	89999	89999
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: marketplace_demo_postgres_user
--

COPY public.orders (id, buyer_id, subtotal_cents, tax_cents, shipping_cents, total_cents, status, created_at) FROM stdin;
1	2	109998	11000	1500	122498	paid_simulated	2026-02-19 19:31:29.868614+00
2	2	109998	11000	1500	122498	paid_simulated	2026-03-03 10:25:07.664217+00
3	2	109998	11000	1500	122498	paid_simulated	2026-03-03 10:49:23.373642+00
4	2	109998	11000	1500	122498	paid_simulated	2026-03-03 11:13:43.568003+00
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: marketplace_demo_postgres_user
--

COPY public.reviews (id, listing_id, user_id, rating, comment, created_at) FROM stdin;
1	1	2	5	Great condition, works perfectly!	2026-02-19 19:31:29.864477+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: marketplace_demo_postgres_user
--

COPY public.users (id, name, email, password_hash, created_at, updated_at) FROM stdin;
3	Render User	renderuser@email.com	$2b$12$OWCVq4zR4hyGMtxE7WKRuepFlGkMRUhj5gCuChYFMVFMA8lz0qz2K	2026-02-26 14:35:35.151633+00	2026-02-26 14:35:35.151633+00
4	Demo User	demo@techmarket.dev	$2b$10$mrN0bmMVgty6IhP4wDjwneadsVa93ttEW9vwInU7sVvS8UgTdP2Ym	2026-03-03 10:25:07.324954+00	2026-03-03 10:25:07.324954+00
1	Alice Seller	alice@example.com	$2b$10$4a6KMpD7lEGjQa43OnuNSugyvuFmFukQP69yL/4U3xvrigNvtBR8W	2026-02-19 19:31:29.772018+00	2026-02-19 19:31:29.772018+00
2	Bob Buyer	bob@example.com	$2b$10$8B7FDSz2smFHWLi2iCGDxO1vgfzde1ZwO7jAd/g0RhGFYA4Am1fJm	2026-02-19 19:31:29.772018+00	2026-02-19 19:31:29.772018+00
\.


--
-- Name: listings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marketplace_demo_postgres_user
--

SELECT pg_catalog.setval('public.listings_id_seq', 19, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marketplace_demo_postgres_user
--

SELECT pg_catalog.setval('public.order_items_id_seq', 8, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marketplace_demo_postgres_user
--

SELECT pg_catalog.setval('public.orders_id_seq', 4, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marketplace_demo_postgres_user
--

SELECT pg_catalog.setval('public.reviews_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marketplace_demo_postgres_user
--

SELECT pg_catalog.setval('public.users_id_seq', 12, true);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (user_id, listing_id);


--
-- Name: listings listings_pkey; Type: CONSTRAINT; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_listing_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_listing_id_user_id_key UNIQUE (listing_id, user_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: listings listings_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders orders_buyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.users(id);


--
-- Name: reviews reviews_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: marketplace_demo_postgres_user
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO marketplace_demo_postgres_user;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO marketplace_demo_postgres_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO marketplace_demo_postgres_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO marketplace_demo_postgres_user;


--
-- PostgreSQL database dump complete
--

\unrestrict 4zi7bPrfPkJTXxhNKJYIJH6HD48XIdcZ4chh5rbdjZQsIndDCcQg1Uy6tPvvBsF

