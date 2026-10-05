#!/usr/bin/env python3
"""Venue-follow outreach helpers (WhatsApp path kept; Instagram is primary).

As of 2026-10-05 outreach is Instagram-only via the Cursor browser (@popeventdr
DMs). Do not run WhatsApp batch sends unless Stefan asks. Use this script to
refresh venue-contacts.csv / IG queue, or --check-only for number audits.

Legacy WhatsApp flow (only if re-enabled):
1. Open the chat. If WhatsApp never puts our draft in compose (the usual
   “phone number is not on WhatsApp” case), dismiss the alert, log
   not_on_whatsapp, and hand the venue to Instagram if it has a handle.
2. Only press Return for drafts that actually opened. After send, a non-zero
   WhatsApp error also means not_on_whatsapp → Instagram handoff.
3. “deferred” is only when the compose box has different text (you are typing
   in another chat). Those stay for the next run and are not marked missing.

Order is most listings on POP first. Venue URL stays first so the photo card
is the POP listing; Instagram and Facebook links follow.
"""

from __future__ import annotations

import csv
import json
import re
import subprocess
import sys
import time
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
QUEUE = ROOT / "marketing/outreach/drafts/venue-follow-whatsapp.md"
LOG = ROOT / "marketing/outreach/venue-follow-sent.txt"
IG_QUEUE = ROOT / "marketing/outreach/venue-follow-ig-queue.txt"
CONTACTS = ROOT / "marketing/outreach/venue-contacts.csv"
DB = Path.home() / "Library/Group Containers/group.net.whatsapp.WhatsApp.shared/ChatStorage.sqlite"
PER_RUN = 10
OPEN_TRIES = 4
OPEN_SLEEP = 1.2


def norm(s: str) -> str:
    return " ".join(s.split())


def digits(value: str) -> str:
    return re.sub(r"\D", "", value or "")


def message(name: str, slug: str) -> str:
    return (
        f"https://pop-event.com/es/venue/{slug}\n\n"
        f"Hola, equipo de {name} \U0001f44b\n\n"
        "Soy Stefan, de POP Events. Ya los tenemos en el calendario de la Costa Norte.\n\n"
        "\u00bfNos siguen en @popeventdr? Instagram y Facebook. "
        "As\u00ed ven cu\u00e1ndo publicamos su noche, y si etiquetan algo nuevo lo subimos.\n\n"
        "https://instagram.com/popeventdr\n"
        "https://facebook.com/popeventdr\n\n"
        "Gracias."
    )


def seed_venues() -> list[dict]:
    raw = subprocess.check_output(
        [
            "node",
            "--experimental-strip-types",
            "-e",
            "import { SEED_VENUES } from './src/lib/venues-seed.ts';"
            "process.stdout.write(JSON.stringify(SEED_VENUES.map(v => ("
            "{slug:v.slug, name:v.name, phone:v.phone||'', instagram:v.instagram||'', city:v.city||''})"
            ")));",
        ],
        cwd=ROOT,
        text=True,
        stderr=subprocess.DEVNULL,
    )
    return json.loads(raw)


def listing_counts() -> dict[str, int]:
    counts: dict[str, int] = {}
    for filename in ("recurring.en.json", "fallback.en.json"):
        data = json.loads((ROOT / "src/data/seeds" / filename).read_text())
        events = data if isinstance(data, list) else []
        for event in events:
            slug = event.get("venueSlug")
            if slug:
                counts[slug] = counts.get(slug, 0) + 1
    return counts


def venues_by_phone() -> dict[str, list[dict]]:
    by_phone: dict[str, list[dict]] = {}
    for venue in seed_venues():
        phone = digits(venue.get("phone") or "")
        if phone:
            by_phone.setdefault(phone, []).append(venue)
    return by_phone


def queue_rows():
    counts = listing_counts()
    by_phone = venues_by_phone()
    seen = set()
    rows = []
    for _label, phone in re.findall(r"\[([^\]]+)\]\(https://wa\.me/(\d+)", QUEUE.read_text()):
        if phone in seen:
            continue
        seen.add(phone)
        options = by_phone.get(phone) or []
        if not options:
            continue
        venue = max(options, key=lambda item: (counts.get(item["slug"], 0), item["name"]))
        slug, name = venue["slug"], venue["name"]
        rows.append(
            (
                name,
                phone,
                slug,
                message(name, slug),
                counts.get(slug, 0),
                venue.get("instagram") or "",
            )
        )
    rows.sort(key=lambda row: (-row[4], row[0].lower()))
    return rows


def log_rows():
    if not LOG.exists():
        return []
    return [line.split("\t") for line in LOG.read_text().splitlines() if line.strip()]


def logged(status: str) -> set[str]:
    return {cols[1] for cols in log_rows() if len(cols) >= 4 and cols[3] == status}


def write_status(phone: str, name: str, status: str) -> None:
    rows = [cols for cols in log_rows() if len(cols) < 2 or cols[1] != phone]
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    rows.append([stamp, phone, name, status])
    LOG.parent.mkdir(parents=True, exist_ok=True)
    LOG.write_text("".join("\t".join(cols) + "\n" for cols in rows))


def queue_ig(handle: str, name: str, slug: str, reason: str) -> None:
    if not handle:
        return
    existing = set()
    if IG_QUEUE.exists():
        for line in IG_QUEUE.read_text().splitlines():
            cols = line.split("\t")
            if cols and cols[0]:
                existing.add(cols[0])
    if handle in existing:
        return
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    with IG_QUEUE.open("a") as fh:
        fh.write(f"{handle}\t{name}\t{slug}\t{reason}\t{stamp}\n")


def refresh_contacts_csv() -> None:
    """Rebuild the contact table so IG outreach tracks not_on_whatsapp."""
    counts = listing_counts()
    sent = logged("sent")
    missing = logged("not_on_whatsapp")
    by_phone = venues_by_phone()
    # Best venue per phone for status lookup.
    phone_status: dict[str, str] = {}
    for phone in sent:
        phone_status[phone] = "sent"
    for phone in missing:
        phone_status[phone] = "not_on_whatsapp"

    rows = []
    for venue in seed_venues():
        phone = digits(venue.get("phone") or "")
        ig = venue.get("instagram") or ""
        if phone:
            status = phone_status.get(phone) or "not-sent"
            # Shared numbers: if any sibling on this phone was sent, mark sent.
            if phone in by_phone and phone in sent:
                status = "sent"
            elif phone in missing:
                status = "not_on_whatsapp"
        else:
            status = "no-number"
        ig_yes = ""
        if ig and status in {"not_on_whatsapp", "no-number"}:
            ig_yes = "yes"
            queue_ig(ig, venue["name"], venue["slug"], status)
        rows.append(
            {
                "name": venue["name"],
                "city": venue.get("city") or "",
                "slug": venue["slug"],
                "whatsapp": venue.get("phone") or "",
                "instagram": ig,
                "whatsapp_status": status,
                "instagram_outreach": ig_yes,
                "listings": counts.get(venue["slug"], 0),
            }
        )
    rows.sort(key=lambda r: (0 if r["instagram_outreach"] == "yes" else 1, r["name"].lower()))
    with CONTACTS.open("w", newline="") as fh:
        writer = csv.DictWriter(
            fh,
            fieldnames=[
                "name",
                "city",
                "slug",
                "whatsapp",
                "instagram",
                "whatsapp_status",
                "instagram_outreach",
            ],
        )
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row[k] for k in writer.fieldnames})


COPY_JS = """
const se = Application('System Events');
const proc = se.processes.byName('WhatsApp');
proc.frontmost = true;
delay(0.2);
se.keystroke('a', { using: 'command down' });
delay(0.15);
se.keystroke('c', { using: 'command down' });
"""

RETURN_JS = """
const se = Application('System Events');
const proc = se.processes.byName('WhatsApp');
proc.frontmost = true;
delay(0.2);
se.keyCode(124);
delay(0.15);
se.keyCode(36);
"""

DISMISS_JS = """
const se = Application('System Events');
const proc = se.processes.byName('WhatsApp');
proc.frontmost = true;
delay(0.15);
se.keyCode(53);
delay(0.2);
se.keyCode(36);
delay(0.15);
se.keyCode(53);
"""


def run_js(source: str) -> None:
    subprocess.check_output(["osascript", "-l", "JavaScript", "-e", source], text=True)


def dismiss_alert() -> None:
    try:
        run_js(DISMISS_JS)
    except subprocess.CalledProcessError:
        pass


def clear_clip() -> None:
    subprocess.run(["bash", "-lc", "printf '' | pbcopy"], check=False)


def copy_clip() -> str:
    run_js(COPY_JS)
    time.sleep(0.25)
    return subprocess.check_output(["pbpaste"], text=True, errors="replace")


def looks_like_other_draft(clip: str, slug: str, body: str) -> bool:
    """True only when compose clearly holds a different chat draft."""
    text = clip.strip()
    if not text or norm(text) == norm(body):
        return False
    if slug in text and "pop-event.com" in text:
        return True
    # User typing in another thread: real sentences, not an empty/failed open.
    if "pop-event.com" in text:
        return True
    if len(text) > 40 and "\n" in text:
        return True
    return False


def outgoing(slug: str) -> str:
    q = (
        "SELECT m.ZMESSAGESTATUS || ' ' || m.ZMESSAGEERRORSTATUS "
        "FROM ZWAMESSAGE m "
        f"WHERE m.ZISFROMME = 1 AND m.ZTEXT LIKE '%/es/venue/{slug}%' "
        "ORDER BY m.ZMESSAGEDATE DESC LIMIT 1;"
    )
    return subprocess.check_output(["sqlite3", str(DB), q], text=True).strip()


def preview_title(slug: str) -> str:
    q = (
        "SELECT ifnull(mi.ZTITLE,'') FROM ZWAMESSAGE m "
        "LEFT JOIN ZWAMEDIAITEM mi ON mi.ZMESSAGE = m.Z_PK "
        f"WHERE m.ZISFROMME = 1 AND m.ZMESSAGEERRORSTATUS = 0 "
        f"AND m.ZTEXT LIKE '%/es/venue/{slug}%' "
        "ORDER BY m.ZMESSAGEDATE DESC LIMIT 1;"
    )
    return subprocess.check_output(["sqlite3", str(DB), q], text=True).strip()


def send_one(name: str, phone: str, slug: str, body: str, instagram: str) -> str:
    before = outgoing(slug)
    clear_clip()
    url = "whatsapp://send?phone=" + phone + "&text=" + urllib.parse.quote(body, safe="")
    subprocess.run(["open", url], check=True)
    matched = False
    last_clip = ""
    for _ in range(OPEN_TRIES):
        time.sleep(OPEN_SLEEP)
        last_clip = copy_clip()
        if slug in last_clip and norm(last_clip) == norm(body):
            matched = True
            break
    if not matched:
        dismiss_alert()
        if looks_like_other_draft(last_clip, slug, body):
            return "deferred"
        # Failed open is almost always WhatsApp's "number not on WhatsApp" alert.
        queue_ig(instagram, name, slug, "not_on_whatsapp")
        return "not_on_whatsapp"

    # Deselect so the photo card can load, then confirm the draft was not replaced.
    run_js(RETURN_JS.replace("se.keyCode(36);", "'deselected';"))
    time.sleep(15)
    if norm(copy_clip()) != norm(body):
        return "deferred"
    run_js(RETURN_JS)
    status = ""
    for _ in range(8):
        time.sleep(1.0)
        status = outgoing(slug)
        if status and status != before:
            break
    if not status or status == before:
        return "deferred"
    msg_status, err = status.split()
    if err != "0" or msg_status == "0":
        time.sleep(1.5)
        status = outgoing(slug) or status
        msg_status, err = status.split()
        if err != "0":
            dismiss_alert()
            queue_ig(instagram, name, slug, "not_on_whatsapp")
            return "not_on_whatsapp"
        if msg_status == "0":
            return "deferred"
    title = ""
    for _ in range(4):
        title = preview_title(slug)
        if title:
            break
        time.sleep(1.0)
    if not title:
        print(f"no-preview\t{name}")
    return "sent"


def run_limit() -> int:
    if "--limit" in sys.argv:
        index = sys.argv.index("--limit")
        return max(1, int(sys.argv[index + 1]))
    return PER_RUN


def main() -> None:
    dry = "--dry-run" in sys.argv
    check_only = "--check-only" in sys.argv
    limit = run_limit()
    sent = logged("sent")
    skip = logged("not_on_whatsapp")
    todo = [
        row
        for row in queue_rows()
        if row[1] not in sent and row[1] not in skip and not outgoing(row[2]).endswith(" 0")
    ]
    cleaned = []
    for row in todo:
        prior = outgoing(row[2])
        if not prior:
            cleaned.append(row)
            continue
        msg_status, err = prior.split()
        if err == "0" and msg_status != "0":
            write_status(row[1], row[0], "sent")
            continue
        write_status(row[1], row[0], "not_on_whatsapp")
        queue_ig(row[5], row[0], row[2], "not_on_whatsapp")
    todo = cleaned
    print(f"queued {len(todo)} already_sent {len(logged('sent'))} skip_missing {len(logged('not_on_whatsapp'))}")
    if dry:
        for name, phone, slug, _body, count, ig in todo[:limit]:
            print(f"next\t{count}\t{name}\t{slug}\tig=@{ig or '-'}")
        return

    subprocess.run(["bash", "-lc", "pbpaste > /tmp/clip-backup.txt"], check=False)
    sent_now = 0
    missing_now = 0
    try:
        for name, phone, slug, body, _count, ig in todo:
            if sent_now >= limit:
                break
            if check_only:
                # Open briefly; mark missing without sending.
                clear_clip()
                url = "whatsapp://send?phone=" + phone + "&text=" + urllib.parse.quote(body, safe="")
                subprocess.run(["open", url], check=True)
                matched = False
                last_clip = ""
                for _ in range(OPEN_TRIES):
                    time.sleep(OPEN_SLEEP)
                    last_clip = copy_clip()
                    if slug in last_clip and norm(last_clip) == norm(body):
                        matched = True
                        break
                if matched:
                    # Clear the unsent draft so it is not left sitting there.
                    run_js(
                        """
const se = Application('System Events');
const proc = se.processes.byName('WhatsApp');
proc.frontmost = true;
delay(0.15);
se.keystroke('a', { using: 'command down' });
delay(0.1);
se.keyCode(51);
"""
                    )
                    print(f"on_whatsapp\t{name}")
                else:
                    dismiss_alert()
                    if looks_like_other_draft(last_clip, slug, body):
                        print(f"deferred\t{name}")
                        continue
                    write_status(phone, name, "not_on_whatsapp")
                    queue_ig(ig, name, slug, "not_on_whatsapp")
                    missing_now += 1
                    print(f"not_on_whatsapp\t{name}\tig=@{ig or '-'}")
                continue

            result = send_one(name, phone, slug, body, ig)
            if result == "deferred":
                print(f"deferred\t{name}")
                continue
            write_status(phone, name, result)
            print(f"{result}\t{name}" + (f"\tig=@{ig}" if result == "not_on_whatsapp" and ig else ""))
            if result == "sent":
                sent_now += 1
            elif result == "not_on_whatsapp":
                missing_now += 1
            time.sleep(0.8)
        refresh_contacts_csv()
        print(f"DONE sent {sent_now} not_on_whatsapp {missing_now}")
    finally:
        dismiss_alert()
        subprocess.run(["bash", "-lc", "pbcopy < /tmp/clip-backup.txt"], check=False)


if __name__ == "__main__":
    main()
