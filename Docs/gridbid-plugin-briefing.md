{\rtf1\ansi\ansicpg1252\cocoartf2868
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 .AppleSystemUIFontMonospaced-Regular;}
{\colortbl;\red255\green255\blue255;\red15\green15\blue15;\red255\green255\blue255;}
{\*\expandedcolortbl;;\cssrgb\c7059\c7059\c7059;\cssrgb\c100000\c100000\c100000;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 # Gridbid Plugin Briefing\
\
## Goal\
\
Gridbid is a first-party GridAI plugin for Swiss real estate agents. It allows agents to create, activate, and manage bidding processes for properties that are already marketed elsewhere.\
\
## V0.1 Scope\
\
Agency-side only.\
\
The plugin must support:\
\
* overview of multiple biddings\
* creation of a new bidding\
* editing a draft bidding\
* activation of a bidding\
* detail page for one bidding\
* public link visible only after activation\
\
## Not in V0.1\
\
* buyer-facing flow\
* public registration UI\
* full order book UI\
* round 2 invitation workflow\
* document upload UX\
* MCP/backend integration\
\
## Core Assumptions\
\
* buyers must register before submitting an offer\
* buyers can revise offers within the same round\
* round 2 is invite-only\
* public link exists only once the bidding is activated\
\
## UX Principles\
\
* simple\
* serious\
* structured\
* Swiss-market appropriate\
* German UI, informal "du"\
\
## Core Views\
\
* \'dcbersicht\
* Neues Bieterverfahren\
* Detailansicht\
\
## Technical Principles\
\
* follow GridAI plugin architecture\
* React as peerDependency\
* Tailwind only\
* strict TypeScript\
* local mock service first\
* no direct REST calls\
* no custom auth logic}