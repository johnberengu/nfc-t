--
-- PostgreSQL database dump
--

\restrict FfibyvOMGOgp9mt3y07H3m24xls45Ww3UjTn2gCHRflBtRPj8bt9E3QcGWgN3gs

-- Dumped from database version 14.19 (Ubuntu 14.19-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.19 (Ubuntu 14.19-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: nfc
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO nfc;

--
-- Name: checkins; Type: TABLE; Schema: public; Owner: nfc
--

CREATE TABLE public.checkins (
    id character varying NOT NULL,
    full_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(20),
    department character varying(50) NOT NULL,
    staff character varying(100),
    purpose character varying(255),
    "timestamp" timestamp without time zone,
    status character varying(20),
    decline_reason character varying(255),
    decline_category character varying(100),
    approved_by character varying(100),
    declined_by character varying(100),
    appointment_date character varying(20),
    appointment_time character varying(20),
    updated_at timestamp without time zone,
    is_inside boolean
);


ALTER TABLE public.checkins OWNER TO nfc;

--
-- Name: staff; Type: TABLE; Schema: public; Owner: nfc
--

CREATE TABLE public.staff (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(128) NOT NULL,
    role character varying(50)
);


ALTER TABLE public.staff OWNER TO nfc;

--
-- Name: staff_id_seq; Type: SEQUENCE; Schema: public; Owner: nfc
--

CREATE SEQUENCE public.staff_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.staff_id_seq OWNER TO nfc;

--
-- Name: staff_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nfc
--

ALTER SEQUENCE public.staff_id_seq OWNED BY public.staff.id;


--
-- Name: staff id; Type: DEFAULT; Schema: public; Owner: nfc
--

ALTER TABLE ONLY public.staff ALTER COLUMN id SET DEFAULT nextval('public.staff_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: nfc
--

COPY public.alembic_version (version_num) FROM stdin;
fefbe225071c
\.


--
-- Data for Name: checkins; Type: TABLE DATA; Schema: public; Owner: nfc
--

COPY public.checkins (id, full_name, email, phone, department, staff, purpose, "timestamp", status, decline_reason, decline_category, approved_by, declined_by, appointment_date, appointment_time, updated_at, is_inside) FROM stdin;
a5bc6ed8-6323-4ffd-9369-a86a901bb319	Test User	test@example.com	1234567890	Engineering	John Smith	Testing	2025-11-23 21:02:57.447263	pending	\N	\N	\N	\N	\N	\N	\N	\N
0caf5fc9-67c5-4fa9-9d5c-c4a5a8c84158	el	e@w	0723	Engineering	John Smith	hh	2025-11-23 21:29:29.045	pending	\N	\N	\N	\N	\N	\N	\N	\N
83b2dae0-1d85-4728-aa5d-47e3a55af1e1	el	e@w	0723	Engineering	John Smith	h	2025-11-23 22:07:56.001	pending	\N	\N	\N	\N	\N	\N	\N	\N
12368b10-77ab-45a0-af65-745dae171980	el	e@w	0723	Engineering	John Smith	ik	2025-11-23 22:18:05.426	pending	\N	\N	\N	\N	\N	\N	\N	\N
7add8640-a3f3-4520-9f07-d5de3cbb80eb	el	e@w	0723	Sales	Robert Wilson	g	2025-11-23 22:27:37.097	pending	\N	\N	\N	\N	\N	\N	\N	\N
27146580-63a8-42eb-82a8-d79544ff7107	el	h@e	073	Finance	Michelle Lewis	rth	2025-11-23 22:27:59.941	pending	\N	\N	\N	\N	\N	\N	\N	\N
ffcade95-8404-40a4-b766-d6001bb85994	el	e@b	0711111111	Sales	Lisa Anderson	ert	2025-11-24 05:20:59.694	pending	\N	\N	\N	\N	\N	\N	\N	\N
3d51c36d-6cc6-4a2f-a6dc-8fb372c227d7	el	e@b	0711111111	HR	Maria Rodriguez	ertyu	2025-11-24 05:33:21.348	pending	\N	\N	\N	\N	\N	\N	\N	\N
4e82160b-927b-4211-b42b-b4975b0fdbbf	el	e@b	0711111111	HR	Anna Kim	qtyu	2025-11-24 05:40:31.403	pending	\N	\N	\N	\N	\N	\N	\N	\N
c24ff281-c2c7-4db6-be72-e4f0dd07e77b	el	e@b	0711111111	Sales	Lisa Anderson	wertyu	2025-11-24 05:58:42.688	pending	\N	\N	\N	\N	\N	\N	2025-11-24 05:58:42.718802	f
27ef7cb0-96e6-48ad-835a-ac93970e488a	el	e@b	0711111111	Sales	Lisa Anderson	wertyu	2025-11-24 05:58:43.67	pending	\N	\N	\N	\N	\N	\N	2025-11-24 05:58:43.677487	f
725b4e09-b207-45c6-8bca-00ab4037bb00	el	e@b	0711111111	Marketing	Chris Garcia	drtyu	2025-11-24 06:17:35.501	approved	\N	\N	\N	\N	\N	\N	2025-11-24 06:18:09.02473	t
84255658-abce-4f99-841f-1c60f0931e06	el	e@b	0711111111	Sales	Robert Wilson	erth	2025-11-24 06:12:37.222	declined	\N	\N	\N	\N	\N	\N	2025-11-24 06:18:31.939711	f
fe7e4771-d79e-4df3-a596-5b28c674a81b	el	e@b	0711111111	HR	James Thompson	dfgh	2025-11-24 06:02:18.541	declined	\N	\N	\N	\N	\N	\N	2025-11-24 06:18:58.266437	f
e5560517-5b0b-443b-a0d4-bf0b505186b7	el	e@b	0711111111	HR	James Thompson	dfgh	2025-11-24 06:12:13.775	approved	\N	\N	\N	\N	\N	\N	2025-11-24 06:19:35.74807	t
67e79e77-26e4-40e1-bed7-f527ecf36308	John Doe	john@example.com	123456789	IT	\N	\N	2025-11-24 06:08:54.275419	approved	\N	\N	\N	\N	\N	\N	2025-11-24 06:20:22.592983	t
b5853d12-b9ee-4613-b3e8-eee8fa82c91a	el	e@b	0711111111	HR	Anna Kim	ui	2025-11-24 06:34:01.203	approved	\N	\N	\N	\N	\N	\N	2025-11-24 06:34:58.243102	t
b182bdd2-d9f7-4827-a453-3468f8c01f34	el	e@w	0723	Sales	David Brown	gihojpkl	2025-11-23 22:36:20.167	approved	\N	\N	\N	\N	\N	\N	2025-11-24 06:35:33.800703	t
cbe108f5-b513-4822-ac4d-f52e32152600	el	e@b	0711111111	HR	James Thompson	sdfgh	2025-11-24 08:47:36.434	approved	\N	\N	\N	\N	\N	\N	2025-11-24 14:01:54.348472	t
32e8e965-3d39-402c-90e4-fe07716d543e	el	elieli9elibw@gmail.com	0711111111	Engineering	Sarah Johnson	qewrtyui	2025-11-24 14:13:13.796	approved	\N	\N	\N	\N	\N	\N	2025-11-24 14:13:41.761135	t
497352d1-8a61-4f48-85b4-d53143606747	el	eli452043@gmail.com	0711111111	Sales	David Brown	wertyui	2025-11-24 14:30:05.968763	approved	\N	\N	\N	\N	\N	\N	2025-11-24 14:30:40.744036	t
b0c2b2a3-1867-42ed-b910-988ba7df683d	el	e@b	0711111111	Sales	David Brown	wysu	2025-11-24 06:32:25.892	approved	\N	\N	\N	\N	\N	\N	2025-11-25 04:44:36.156061	t
d86fe055-7f5f-4f20-a9cb-673f0281cbb1	el	e@b	0711111111	HR	Maria Rodriguez	retyhj	2025-11-24 05:59:44.659	approved	\N	\N	\N	\N	\N	\N	2025-11-25 05:00:48.029599	t
63d51c1f-b19f-4a08-a35a-c1da4a08ba80	el	e@b	0711111111	HR	Maria Rodriguez	retyhj	2025-11-24 05:59:43.117	approved	\N	\N	\N	\N	\N	\N	2025-11-25 05:13:23.431606	t
2cc4fe1a-189c-409c-908a-70ad83b5001d	el	elieli9elibw@gmail.com	0711111111	Marketing	Amanda Martinez	dsfghjh	2025-11-25 05:14:04.223793	approved	\N	\N	\N	\N	\N	\N	2025-11-25 05:15:06.812998	t
8730e63f-beaf-4efd-b674-8c65e350f2e6	eu	elieli9elibw@gmail.com	0711111111	Engineering	John Smith	erdtfyguhjk	2025-11-25 08:04:55.014706	approved	\N	\N	\N	\N	\N	\N	2025-11-25 08:06:49.038116	t
16ab7b52-0e7e-43ed-98d1-c60416973eef	el	elieli9elibw@gmail.com	0711111111	Marketing	Kevin Lee	yhkjml	2025-11-25 09:23:04.936055	approved	\N	\N	\N	\N	\N	\N	2025-11-25 09:23:53.540997	t
f89f953b-ab07-4018-b5e9-10764de48e77	el	e@b	0711111111	HR	Maria Rodriguez	retyhj	2025-11-24 05:59:04.792	declined	\N	\N	\N	\N	\N	\N	2025-11-25 09:25:12.861175	f
31716ed9-a86c-44b1-b0c5-dcf7e8d319af	el	elieli9elibw@gmail.com	0711111111	Marketing	Chris Garcia	wertyu	2025-11-25 10:04:01.262519	pending	\N	\N	\N	\N	\N	\N	2025-11-25 10:04:01.262524	f
5ee1afeb-6b23-4251-9265-dad3a81cb82f	el	eli452043@gmail.com	0723	Sales	Robert Wilson	ertyu	2025-11-25 10:17:42.274938	pending	\N	\N	\N	\N	\N	\N	2025-11-25 10:17:42.274943	f
8601f808-9a03-4283-8e5f-e8d2cde2b4d6	el	elieli9elibw@gmail.com	0711111111	HR	Maria Rodriguez	ertyu	2025-11-25 10:27:18.076719	pending	\N	\N	\N	\N	\N	\N	2025-11-25 10:27:18.076723	f
258f245e-ab40-455a-b2ba-1fa400c30422	el	eli452043@gmail.com	0711111111	Sales	Lisa Anderson	sfdgfhj	2025-11-25 10:27:49.467074	pending	\N	\N	\N	\N	\N	\N	2025-11-25 10:27:49.467082	f
b201972e-b110-4208-8f93-a1356b72190b	gjh	e@w	0711111111	Marketing	Amanda Martinez	fhg	2025-11-25 10:29:36.827874	pending	\N	\N	\N	\N	\N	\N	2025-11-25 10:29:36.827878	f
01f37c4d-6cff-4535-9eb4-abe6ac37746c	eu	eli452043@gmail.com	0711111111	Sales	Robert Wilson	sdfg	2025-11-25 10:34:14.912005	pending	\N	\N	\N	\N	\N	\N	2025-11-25 10:34:14.91201	f
f64a1957-76a2-4f70-872b-70a5516c38af	el	e@w	0711111111	Sales	Lisa Anderson	rty	2025-11-25 10:38:05.029067	pending	\N	\N	\N	\N	\N	\N	2025-11-25 10:38:05.029071	f
3cb13827-92fc-4b21-a5ee-e0a4f8d0827b	el	e@w	0711111111	Sales	Lisa Anderson	fgh	2025-11-25 10:36:18.30933	approved	\N	\N	\N	\N	\N	\N	2025-11-25 10:39:10.700327	t
ed878edc-ec26-41e0-866d-aca7887e1a3b	el	e@w	0711111111	Sales	David Brown	sdfg	2025-11-25 10:35:43.588564	approved	\N	\N	\N	\N	\N	\N	2025-11-25 13:53:04.471817	t
\.


--
-- Data for Name: staff; Type: TABLE DATA; Schema: public; Owner: nfc
--

COPY public.staff (id, name, email, password_hash, role) FROM stdin;
\.


--
-- Name: staff_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nfc
--

SELECT pg_catalog.setval('public.staff_id_seq', 1, false);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: nfc
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: checkins checkins_pkey; Type: CONSTRAINT; Schema: public; Owner: nfc
--

ALTER TABLE ONLY public.checkins
    ADD CONSTRAINT checkins_pkey PRIMARY KEY (id);


--
-- Name: staff staff_email_key; Type: CONSTRAINT; Schema: public; Owner: nfc
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_email_key UNIQUE (email);


--
-- Name: staff staff_pkey; Type: CONSTRAINT; Schema: public; Owner: nfc
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict FfibyvOMGOgp9mt3y07H3m24xls45Ww3UjTn2gCHRflBtRPj8bt9E3QcGWgN3gs

