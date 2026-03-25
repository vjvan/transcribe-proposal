#!/usr/bin/env python3
"""Generate a demo proposal PPTX with fake data for README screenshots."""
import json
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'python'))
from generate_pptx import ProposalGenerator

demo_analysis = {
    "title": "Demo: Pet Salon Booking System",
    "subtitle": "LINE LIFF Booking + CRM Dashboard + Automation",
    "background": "A growing pet grooming business with 3 locations needs a digital booking system. Currently relying on phone reservations and manual spreadsheets, the business faces scheduling conflicts and has no unified view of customer data across branches.",
    "goals": [
        "Enable customers to book grooming appointments directly in LINE",
        "Unified CRM dashboard for all 3 locations",
        "Automated reminders to boost rebooking rates",
        "Build customer data assets for marketing decisions"
    ],
    "architecture": {
        "flow": "LINE App > LIFF Booking > Cloud API > Database",
        "tech_stack": [
            {"name": "LINE LIFF", "description": "In-app booking interface, no separate app download required"},
            {"name": "Cloud API", "description": "Serverless backend handling bookings and customer logic"},
            {"name": "Database", "description": "Cloud database with real-time sync across locations"},
            {"name": "Automation", "description": "Workflow engine for notifications, reminders, and marketing"},
            {"name": "Push Notifications", "description": "Automated LINE messages for booking confirmations"},
            {"name": "CRM Dashboard", "description": "Web-based management console for all locations"}
        ]
    },
    "features": [
        {
            "category": "Booking Frontend",
            "items": [
                "Service catalog (grooming packages)",
                "Time slot selection by location and date",
                "Booking confirmation and cancellation",
                "Booking history and rebooking"
            ]
        },
        {
            "category": "CRM Dashboard",
            "items": [
                "Order management across locations",
                "Customer profiles with pet info",
                "Revenue analytics and trends",
                "Multi-role access (owner, staff)"
            ]
        },
        {
            "category": "Automation",
            "items": [
                "Booking confirmation push",
                "Day-before reminder",
                "Rebooking cycle reminders",
                "Inactive customer re-engagement"
            ]
        },
        {
            "category": "Marketing",
            "items": [
                "LINE rich menu design",
                "Cross-sell recommendations",
                "Targeted push by segments"
            ]
        }
    ],
    "pricing": {
        "plans": [
            {
                "name": "Plan A",
                "label": "Plan A: Core Booking System",
                "total": 80000,
                "currency": "NT$",
                "recommended": False,
                "items": [
                    {"name": "LIFF Frontend", "description": "Booking UI, service catalog, history", "price": 25000},
                    {"name": "Database Design", "description": "Customer, booking, service, location tables", "price": 10000},
                    {"name": "CRM Dashboard", "description": "Order management, basic reports", "price": 30000},
                    {"name": "Automation", "description": "Booking notifications, reminders", "price": 10000},
                    {"name": "Testing & Launch", "description": "QA, client review, deployment", "price": 5000}
                ],
                "summary": "LIFF booking, basic CRM, automation",
                "fit": "Get the booking flow running first"
            },
            {
                "name": "Plan B",
                "label": "Plan B: Full System + Marketing",
                "total": 120000,
                "currency": "NT$",
                "recommended": True,
                "items": [
                    {"name": "LIFF Frontend", "description": "Booking UI, service catalog, history", "price": 25000},
                    {"name": "Database Design", "description": "Customer, booking, service, location tables", "price": 10000},
                    {"name": "CRM Dashboard", "description": "Advanced analytics, multi-location dashboard", "price": 35000},
                    {"name": "Automation", "description": "Full workflow: reminders, re-engagement, segments", "price": 20000},
                    {"name": "Marketing Module", "description": "Rich menu, cross-sell, targeted push", "price": 25000},
                    {"name": "Testing & Launch", "description": "QA, client review, deployment", "price": 5000}
                ],
                "summary": "Everything in Plan A + advanced analytics + marketing integration",
                "fit": "Build system and marketing simultaneously"
            }
        ]
    },
    "maintenance": [
        {"name": "Basic", "description": "Monitoring, bug fixes, hosting", "price": "NT$ 3,000/mo"},
        {"name": "Advanced", "description": "Basic + 4 hours/month feature updates", "price": "NT$ 5,000/mo"}
    ],
    "timeline": [
        {"phase": "Requirements", "content": "Service details, database schema, UI alignment", "duration": "3-5 days"},
        {"phase": "Phase 1: Core", "content": "LIFF frontend + database + basic CRM", "duration": "2-3 weeks"},
        {"phase": "Phase 2: Automation", "content": "Workflow engine + analytics + multi-location", "duration": "1-2 weeks"},
        {"phase": "Phase 3: Marketing", "content": "Rich menu + recommendations + segmented push (Plan B only)", "duration": "1 week"},
        {"phase": "Testing & Launch", "content": "Client review, fixes, go-live", "duration": "3-5 days"}
    ],
    "timeline_summary": "Plan A: ~4-5 weeks | Plan B: ~5-7 weeks (from requirements sign-off)",
    "payment_terms": [
        "40% upon contract signing",
        "30% after Phase 1 acceptance",
        "30% after full launch acceptance"
    ],
    "payment_note": "Payment schedule is negotiable",
    "service_terms": [
        "Quote valid for 30 days",
        "Source code and database owned by client",
        "First month post-launch: free warranty (bug fixes)",
        "New features beyond scope quoted separately",
        "Cloud service costs (hosting, etc.) paid by client",
        "LINE Official Account fees paid by client"
    ],
    "why_us": [
        {"title": "Proven Track Record", "description": "Successfully built similar LIFF + CRM systems for the food industry"},
        {"title": "Domain Expertise", "description": "Deep understanding of service booking workflows"},
        {"title": "AI Automation", "description": "Replace repetitive manual tasks with intelligent automation"},
        {"title": "Long-term Partner", "description": "Ongoing maintenance and feature evolution as your business grows"}
    ]
}

demo_config = {
    "slide_size": {"width": 13.333, "height": 7.5},
    "colors": {
        "primary": "#E67E22",
        "dark": "#1A1A1A",
        "gray": "#555555",
        "light_gray": "#999999",
        "white": "#FFFFFF",
        "bg_light": "#FAFAFA",
        "bg_warm": "#FEF9F4"
    },
    "fonts": {"primary": "PingFang TC"},
    "company": {
        "name": "Your Name",
        "title": "Consultant",
        "website": "example.com"
    },
    "proposal": {"validity_days": 30}
}

output = os.path.join(os.path.dirname(__file__), '..', 'demo-proposal.pptx')
gen = ProposalGenerator(demo_analysis, demo_config, output)
gen.generate()
print(f"Demo PPTX generated: {output}")
