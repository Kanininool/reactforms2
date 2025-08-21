import chilkat
from datetime import datetime, timedelta

# Unlock Chilkat
glob = chilkat.CkGlobal()
if not glob.UnlockBundle("YourUnlockCode"):
    print(glob.lastErrorText())
    exit()

# Calculate meeting time: 50 weeks from now
meeting_start = datetime.now() + timedelta(weeks=50)
meeting_end = meeting_start + timedelta(hours=1)

# Format times for iCalendar
dtstamp = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
dtstart = meeting_start.strftime("%Y%m%dT%H%M%S")
dtend = meeting_end.strftime("%Y%m%dT%H%M%S")

# Create the iCalendar content
ical = chilkat.CkStringBuilder()
ical.AppendLine("BEGIN:VCALENDAR", True)
ical.AppendLine("VERSION:2.0", True)
ical.AppendLine("PRODID:-//Chilkat Software//Chilkat Python//EN", True)
ical.AppendLine("METHOD:REQUEST", True)
ical.AppendLine("BEGIN:VEVENT", True)
ical.AppendLine(f"UID:meeting-{dtstart}@example.com", True)
ical.AppendLine(f"DTSTAMP:{dtstamp}", True)
ical.AppendLine(f"DTSTART;TZID=Asia/Kolkata:{dtstart}", True)
ical.AppendLine(f"DTEND;TZID=Asia/Kolkata:{dtend}", True)
ical.AppendLine("SUMMARY:Security Sync Meeting", True)
ical.AppendLine("LOCATION:Teams Meeting Room", True)
ical.AppendLine("DESCRIPTION:Please join the security sync meeting to discuss updates.", True)
ical.AppendLine("ORGANIZER;CN=Security Team:mailto:security@example.com", True)

# Add multiple attendees
attendees = [
    ("Srikanth Chandrasekaran", "srikanth@example.com"),
    ("Anita Sharma", "anita@example.com"),
    ("Rahul Verma", "rahul@example.com")
]

for name, email in attendees:
    ical.AppendLine(f"ATTENDEE;CN={name};RSVP=TRUE:mailto:{email}", True)

ical.AppendLine("STATUS:CONFIRMED", True)
ical.AppendLine("SEQUENCE:0", True)
ical.AppendLine("TRANSP:OPAQUE", True)
ical.AppendLine("BEGIN:VALARM", True)
ical.AppendLine("TRIGGER:-PT15M", True)
ical.AppendLine("ACTION:DISPLAY", True)
ical.AppendLine("DESCRIPTION:Reminder for Security Sync Meeting", True)
ical.AppendLine("END:VALARM", True)
ical.AppendLine("END:VEVENT", True)
ical.AppendLine("END:VCALENDAR", True)

# Create the email
email = chilkat.CkEmail()
email.put_Subject("Meeting Invite: Security Sync")
email.put_Body("Please find the meeting invite attached. Accept to add it to your calendar.")
email.put_From("Security Team <security@example.com>")

# Add recipients using AddMultipleTo
to_list = "Srikanth Chandrasekaran <srikanth@example.com>, Anita Sharma <anita@example.com>, Rahul Verma <rahul@example.com>"
email.AddMultipleTo(to_list)

# Attach the .ics file
email.AddStringAttachment("invite.ics", ical.getAsString())

# Send email using local SMTP relay
mailman = chilkat.CkMailMan()
mailman.put_SmtpHost("localhost")  # Replace with your mail relay if needed
mailman.put_SmtpAuthMethod("NONE")

if mailman.SendEmail(email):
    print("Meeting invite sent successfully.")
else:
    print(mailman.lastErrorText())
