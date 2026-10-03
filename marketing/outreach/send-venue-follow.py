#!/usr/bin/env python3
"""Send the next 10 venue-follow WhatsApp messages from the Mac app.

Order is venues with the most listings on POP (recurring series plus one-off
seeds). The venue page link is first so the photo card stays on POP, then the
Instagram and Facebook links. Return waits until WhatsApp has had time
to attach the card. Already-sent notes are not edited.

Skips numbers already logged as sent or not on WhatsApp. A send counts only
when WhatsApp stores an outgoing message with no error. If the draft is not
sitting in the compose box, that number is left for the next run.
"""

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
DB = Path.home() / "Library/Group Containers/group.net.whatsapp.WhatsApp.shared/ChatStorage.sqlite"
PER_RUN = 10

def norm(s: str) -> str:
    return " ".join(s.split())

def digits(value: str) -> str:
    return re.sub(r"\D", "", value or "")

def message(name: str, slug: str) -> str:
    # Venue page stays first so WhatsApp's photo card is the POP listing.
    # Instagram and Facebook come after, as their own links.
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
            "process.stdout.write(JSON.stringify(SEED_VENUES.map(v => ({slug:v.slug, name:v.name, phone:v.phone||''}))));",
        ],
        cwd=ROOT,
        text=True,
        stderr=subprocess.DEVNULL,
    )
    return json.loads(raw)

def listing_counts() -> dict[str, int]:
    """How often each venue shows on the calendar. English seeds only, so locales are not triple-counted."""
    counts: dict[str, int] = {}
    for filename in ("recurring.en.json", "fallback.en.json"):
        data = json.loads((ROOT / "src/data/seeds" / filename).read_text())
        events = data if isinstance(data, list) else []
        for event in events:
            slug = event.get("venueSlug")
            if slug:
                counts[slug] = counts.get(slug, 0) + 1
    return counts

def queue_rows():
    counts = listing_counts()
    by_phone: dict[str, list[tuple[str, str]]] = {}
    for venue in seed_venues():
        phone = digits(venue.get("phone") or "")
        if not phone:
            continue
        by_phone.setdefault(phone, []).append((venue["slug"], venue["name"]))
    seen = set()
    rows = []
    for _label, phone in re.findall(r"\[([^\]]+)\]\(https://wa\.me/(\d+)", QUEUE.read_text()):
        if phone in seen:
            continue
        seen.add(phone)
        options = by_phone.get(phone) or []
        if not options:
            continue
        slug, name = max(options, key=lambda item: (counts.get(item[0], 0), item[1]))
        rows.append((name, phone, slug, message(name, slug), counts.get(slug, 0)))
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

def run_js(source: str) -> None:
    subprocess.check_output(["osascript", "-l", "JavaScript", "-e", source], text=True)

def copy_clip() -> str:
    run_js(COPY_JS)
    time.sleep(0.25)
    return subprocess.check_output(["pbpaste"], text=True, errors="replace")

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

def send_one(name: str, phone: str, slug: str, body: str) -> str:
    before = outgoing(slug)
    url = "whatsapp://send?phone=" + phone + "&text=" + urllib.parse.quote(body, safe="")
    subprocess.run(["open", url], check=True)
    matched = False
    for _ in range(5):
        time.sleep(1.8)
        clip = copy_clip()
        if slug in clip and norm(clip) == norm(body):
            matched = True
            break
    if not matched:
        return "deferred"
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

def main() -> None:
    dry = "--dry-run" in sys.argv
    sent = logged("sent")
    skip = logged("not_on_whatsapp")
    todo = [
        row
        for row in queue_rows()
        if row[1] not in sent and row[1] not in skip and not outgoing(row[2]).endswith(" 0")
    ]
    # outgoing() ending in " 0" means a prior message with no error, any status.
    # Re-filter: a row with an error code must stay skipped, not retried.
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
    todo = cleaned
    print(f"queued {len(todo)} already_sent {len(logged('sent'))}")
    if dry:
        for name, phone, slug, _body, count in todo[:PER_RUN]:
            print(f"next\t{count}\t{name}\t{slug}")
        return
    subprocess.run(["bash", "-lc", "pbpaste > /tmp/clip-backup.txt"], check=False)
    sent_now = 0
    try:
        for name, phone, slug, body, _count in todo:
            if sent_now >= PER_RUN:
                break
            result = send_one(name, phone, slug, body)
            if result == "deferred":
                print(f"deferred\t{name}")
                continue
            write_status(phone, name, result)
            print(f"{result}\t{name}")
            if result == "sent":
                sent_now += 1
            time.sleep(0.8)
        print(f"DONE sent {sent_now}")
    finally:
        subprocess.run(["bash", "-lc", "pbcopy < /tmp/clip-backup.txt"], check=False)

if __name__ == "__main__":
    main()
