#!/bin/bash
# One reminder, the next time an agent chat starts in this project on or after
# 7 Oct 2026 (Santo Domingo). Silent before that, and silent after it has fired.
today="${REMINDER_TODAY:-$(TZ=America/Santo_Domingo date +%Y-%m-%d)}"
marker="${HOME}/.cursor/pop-analytics-key-events-reminded"

if [[ "$today" < "2026-10-07" || -f "$marker" ]]; then
  echo '{}'
  exit 0
fi

mkdir -p "${HOME}/.cursor"
touch "$marker"

cat <<'EOF'
{"additional_context":"Remind the user at the start of your first reply, before any other work: the Analytics follow-up is due. In Google Analytics open Admin → Data display → Events. When save_event, share, get_directions, and click_ticket are listed, star those four. Unstar click so the Home key-events number stops counting every outbound click. Realtime already showed save_event and view_event. Say this once, briefly. Do not repeat it after this session."}
EOF
