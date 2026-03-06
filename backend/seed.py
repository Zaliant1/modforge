"""
Seed the local MySQL database with dummy data for development.

Usage:
    cd backend
    python seed.py

Drops and recreates all tables, then inserts sample records.
"""

import random
from datetime import datetime, timedelta, timezone

from core.database import engine, SessionLocal, create_tables
from models import (
    Base, User, Project, ProjectVersion, ProjectUser,
    ViewEvent, DownloadEvent, ProjectRating,
    Issue, Assignment, Comment, ActivityLog, IssueUpvote,
)


def seed():
    # Reset tables
    Base.metadata.drop_all(bind=engine)
    create_tables()
    print("Tables created.")

    db = SessionLocal()

    # ── Users (100) ────────────────────────────────────────────────────
    usernames = [
        "AliceTheModder", "BobBuilder", "CharlieTester", "DianaVisitor", "EveContributor",
        "FrankForge", "GraceGPU", "HankHacker", "IrisIndie", "JackJolt",
        "KaraKernel", "LiamLua", "MonaMesh", "NateNode", "OliviaOps",
        "PaulPixel", "QuinnQuest", "RubyRender", "SamShader", "TinaTexture",
        "UriahUnity", "VioletVoxel", "WesleyWeb", "XenaXR", "YuriYaml",
        "ZaraZbuffer", "AidanAlpha", "BellaBeta", "CalebCode", "DaisyDebug",
        "EthanEngine", "FionaFrame", "GavinGit", "HollyHex", "IvanInput",
        "JuneJavascript", "KyleKerning", "LunaLinux", "MilesModular", "NoraNetwork",
        "OscarOpenGL", "PiperPatch", "QuincyQuery", "RileyRust", "SophiaSVG",
        "TylerThread", "UnaUniform", "VictorVertex", "WillowWasm", "XavierXML",
        "YaraYield", "ZekeZip", "AmberAsset", "BlakeBlend", "CoraClang",
        "DerekDiff", "EllaEmit", "FinnFlag", "GemmaGlyph", "HugoHash",
        "IdaIndex", "JoelJSON", "KimKotlin", "LeoLayout", "MiaMerge",
        "NicoNginx", "OpalOctet", "PeteProxy", "QuillaQueue", "RexRebase",
        "StellaStack", "TobyToken", "UlaUDP", "VanceVector", "WrenWidget",
        "XylaXHR", "YatesYAML", "ZoeyZero", "ArcherAPI", "BrooksBuild",
        "ClaraCLI", "DeanDelta", "ElsieEcho", "FlintFlux", "GigiGraph",
        "HarperHeap", "IngoInit", "JadaJIT", "KaiKernel", "LaylaParse",
        "MaxMutex", "NellNode", "OttoORM", "PaigePool", "ReedReact",
        "SkylarSQL", "TateTCP", "UmiURI", "ValVoid", "WyattWrap",
    ]
    # Real user first
    zaliant = User(discord_id="500343640871403520", username="Zaliant", avatar_url="", is_donor=True)
    users = [zaliant]
    for i, name in enumerate(usernames):
        users.append(User(
            discord_id=f"{100000000000000001 + i}",
            username=name,
            avatar_url="",
            is_donor=i % 7 == 0,
        ))
    db.add_all(users)
    db.flush()

    # Named aliases for project owners
    alice, bob, charlie, diana, eve = users[1], users[2], users[3], users[4], users[5]

    # ── Projects ───────────────────────────────────────────────────────
    now = datetime.now(timezone.utc)

    project_data = [
        # (name, game, about, categories, is_public, owner, days_ago)
        # Zaliant's projects (mix of public/private)
        ("BetterHUD", "Skyrim", "A complete overhaul of the Skyrim HUD with modern design elements.", ["UI", "Gameplay", "Visuals"], True, zaliant, 60),
        ("RealisticWeather", "Minecraft", "Adds dynamic weather systems including storms, fog, and seasonal changes.", ["Environment", "Graphics"], True, zaliant, 30),
        ("Internal Toolkit", None, "Shared internal tools for the team — no game attachment.", ["Tooling"], False, zaliant, 10),
        ("Z-Framework", None, "Core modding framework and shared utilities.", ["Tooling", "API"], False, zaliant, 85),
        ("SkyUI Lite", "Skyrim", "Minimal inventory UI overhaul focused on performance.", ["UI", "Performance"], True, zaliant, 50),
        ("ModForge Test Suite", None, "End-to-end test harness for ModForge platform.", ["Tooling"], False, zaliant, 15),
        # Other owners (mix of public/private)
        ("ImmersiveArmors", "Skyrim", "Adds over 50 new lore-friendly armor sets distributed across Skyrim.", ["Items", "Gameplay"], True, charlie, 90),
        ("BetterFoliage", "Minecraft", "Enhanced leaves, grass, and tree rendering with wind sway animations.", ["Graphics", "Environment"], True, alice, 75),
        ("QuickLoot", "Fallout 4", "Skyrim-style quick loot menu for Fallout 4.", ["UI", "Gameplay"], True, bob, 55),
        ("DarkSoulsHUD", "Elden Ring", "Replaces the default HUD with a Dark Souls inspired layout.", ["UI", "Visuals"], True, eve, 45),
        ("CraftingOverhaul", "Minecraft", "Reworks the crafting system with a searchable recipe browser.", ["UI", "Gameplay", "Items"], True, charlie, 40),
        ("WeatherReborn", "Skyrim", "Complete weather system overhaul with volumetric fog and dynamic clouds.", ["Environment", "Graphics", "Visuals"], True, diana, 35),
        ("PerformanceTuner", "Cyberpunk 2077", "Auto-configures graphics settings based on hardware benchmarks.", ["Performance", "Tooling"], True, alice, 28),
        ("MapMarkers+", "Skyrim", "Adds hundreds of new discoverable map markers for hidden locations.", ["UI", "Gameplay"], True, bob, 25),
        ("Team Asset Pipeline", None, "Internal asset processing and validation tools.", ["Tooling"], False, alice, 23),
        ("ReShade Preset Pack", "Elden Ring", "Curated collection of ReShade presets for cinematic screenshots.", ["Visuals", "Graphics"], True, eve, 22),
        ("AutoSort Inventory", "Fallout 4", "Automatically categorizes and sorts inventory items.", ["UI", "Items", "Gameplay"], True, charlie, 20),
        ("NPC Dialogue Expansion", "Skyrim", "Adds branching dialogue trees to over 200 generic NPCs.", ["Gameplay", "Audio"], True, diana, 18),
        ("Shader Toolkit", None, "Internal shader compilation and testing pipeline.", ["Tooling", "Graphics"], False, bob, 15),
        ("Texture Upscaler", "Minecraft", "AI-upscaled textures from 16x to 256x with faithful style.", ["Graphics", "Visuals"], True, alice, 14),
        ("Combat Animations", "Elden Ring", "Motion-captured combat animation replacements.", ["Gameplay", "Visuals"], True, eve, 12),
        ("Sound Overhaul", "Skyrim", "Replaces ambient and combat sounds with high-fidelity recordings.", ["Audio", "Environment"], True, bob, 8),
        ("Building Plus", "Minecraft", "Expanded building blocks and placement tools for creative mode.", ["Items", "Gameplay", "UI"], True, charlie, 6),
        ("Photo Mode", "Cyberpunk 2077", "Advanced photo mode with pose editor, lighting tools, and filters.", ["UI", "Visuals", "Tooling"], True, diana, 4),
        ("Companion Framework", "Fallout 4", "Framework for creating custom companions with full affinity systems.", ["Gameplay", "Tooling"], True, alice, 3),
        ("Fast Travel Overhaul", "Skyrim", "Replaces fast travel with a carriage and ship network.", ["Gameplay", "UI"], True, eve, 2),
        ("Mod Manager Lite", None, "Lightweight mod load-order manager for development testing.", ["Tooling"], False, charlie, 1),
    ]

    projects = []
    for name, game, about, categories, is_public, owner, days_ago in project_data:
        p = Project(
            name=name, game=game, about=about, picture="",
            categories=categories, is_public=is_public,
            owner_id=owner.discord_id,
            created_at=now - timedelta(days=days_ago),
        )
        projects.append(p)
    db.add_all(projects)
    db.flush()

    # ── Versions ───────────────────────────────────────────────────────
    all_versions = []
    version_by_project = {}
    for p in projects:
        age_days = max(1, (now - p.created_at).days) if p.created_at else 30
        # Released version
        v_released = ProjectVersion(
            project_id=p.id, name="1.0.0", description="Initial release",
            status="released",
            released_at=p.created_at + timedelta(days=max(1, age_days // 3)),
            created_at=p.created_at + timedelta(days=1),
        )
        # Current version
        v_current = ProjectVersion(
            project_id=p.id, name="1.1.0", description="Bug fixes and improvements",
            status="current",
            released_at=now - timedelta(days=max(1, age_days // 5)),
            created_at=p.created_at + timedelta(days=max(2, age_days // 2)),
        )
        # Upcoming version for some projects
        v_upcoming = ProjectVersion(
            project_id=p.id, name="2.0.0", description="Major update planned",
            status="upcoming", released_at=None,
            created_at=now - timedelta(days=2),
        )
        all_versions.extend([v_released, v_current])
        if age_days > 20:
            all_versions.append(v_upcoming)
        version_by_project[p.id] = v_current

    db.add_all(all_versions)
    db.flush()

    # ── Project Members ────────────────────────────────────────────────
    rng = random.Random(42)
    contributor_pool = users  # all 101 users
    added_members = set()  # (project_id, user_id) to avoid duplicates

    member_rows = []

    def add_member(project_id, user_id, role):
        pair = (project_id, user_id)
        if pair not in added_members:
            added_members.add(pair)
            member_rows.append(ProjectUser(project_id=project_id, user_id=user_id, role=role))

    # Owner memberships for every project
    for p in projects:
        add_member(p.id, p.owner_id, "owner")

    # Add Zaliant as maintainer or contributor on ~15 projects he doesn't own
    zaliant_member_projects = [p for p in projects if p.owner_id != zaliant.discord_id]
    rng.shuffle(zaliant_member_projects)
    for i, p in enumerate(zaliant_member_projects[:15]):
        role = "maintainer" if i < 5 else "contributor"
        add_member(p.id, zaliant.discord_id, role)

    # Sprinkle 3-8 additional members per project from the full user pool
    for p in projects:
        extra_count = rng.randint(3, 8)
        candidates = [u for u in contributor_pool if u.discord_id != p.owner_id]
        chosen = rng.sample(candidates, min(extra_count, len(candidates)))
        for u in chosen:
            role = rng.choice(["maintainer", "contributor", "contributor", "contributor"])
            add_member(p.id, u.discord_id, role)

    db.add_all(member_rows)
    db.flush()

    # ── Issues (20-50 per project) ────────────────────────────────────
    issue_summaries = [
        "Crash on startup with specific hardware config",
        "UI element overlaps dialogue box",
        "Add color-blind accessibility mode",
        "Texture flickering in low-light scenes",
        "Performance drops below 30fps in dense areas",
        "Save file corruption after extended sessions",
        "Add keyboard shortcut customization",
        "Missing translation strings for German locale",
        "Audio desync after alt-tabbing",
        "Memory leak when loading large assets",
        "Add dark mode option for menus",
        "Incorrect collision detection on slopes",
        "Animation stuttering during transitions",
        "Add export/import settings feature",
        "Font rendering blurry on 4K displays",
        "Hotkey conflicts with other popular mods",
        "Add search functionality to browser",
        "Items disappear from inventory randomly",
        "Water reflections broken on AMD GPUs",
        "Add batch processing support",
        "Mouse cursor offset in ultrawide resolutions",
        "NPC pathing breaks near custom objects",
        "Add undo/redo support",
        "Particle effects cause frame drops",
        "Configuration file not saving on exit",
        "Add drag-and-drop reordering",
        "Shadow rendering artifacts at dawn/dusk",
        "Compatibility issue with latest game patch",
        "Add auto-update notification system",
        "Scroll position resets after navigation",
        "LOD transitions are too aggressive",
        "Add multi-language support",
        "Controller input not recognized on launch",
        "Z-fighting on overlapping surfaces",
        "Add preset sharing via clipboard",
        "Sound effects cut off abruptly",
        "Minimap icons misaligned after zoom",
        "Add changelog viewer in-app",
        "Loading screen hangs at 95 percent",
        "Tooltip text overflows container bounds",
        "Add night mode for HUD elements",
        "Character model T-poses during cutscenes",
        "Add progress indicator for long operations",
        "Dropdown menu renders behind other panels",
        "AI behavior breaks in custom scenarios",
        "Add thumbnail previews for items",
        "Keybindings reset after game update",
        "Weather transitions are too abrupt",
        "Add sorting options to list views",
        "Mod conflicts not detected automatically",
    ]

    task_templates = [
        "Investigate root cause",
        "Write unit tests for the fix",
        "Update related documentation",
        "Implement the fix",
        "Review and test on all platforms",
        "Check for regression in related features",
        "Update the changelog",
        "Design mockup for new UI",
        "Refactor affected module",
        "Performance benchmark before and after",
        "Add error handling for edge cases",
        "Create migration script",
        "Verify fix with reporter",
        "Update API schema if needed",
        "Test with different hardware configs",
    ]

    comment_bodies = [
        "I can reproduce this consistently. Steps: launch, open settings, toggle option.",
        "This seems related to the issue fixed in v1.0.2 — might be a regression.",
        "Confirmed on my end as well. Running Windows 11 with latest drivers.",
        "I think the root cause is in the rendering pipeline, not the asset loader.",
        "Workaround: disable VSync and restart. Not ideal but unblocks for now.",
        "PR is up for review. Changed the initialization order to fix the race condition.",
        "Tested the fix locally, works for me. Can someone else verify?",
        "This is a duplicate of issue #12, but the description here is more detailed.",
        "Low priority in my opinion — only affects a very specific edge case.",
        "The proposed solution looks good. One suggestion: add a null check on line 47.",
        "I spent 3 hours debugging this. The problem was a missing await on the async call.",
        "Closing as resolved. The fix went out in the latest nightly build.",
        "Reopening — the fix only addressed part of the problem. Still crashes on Linux.",
        "Added a regression test to prevent this from happening again.",
        "Can we get an ETA on this? It's blocking our content update.",
        "Nice catch! This was also causing the memory leak reported separately.",
        "I'll pick this up tomorrow. Should be a straightforward fix.",
        "Documentation updated to warn users about this edge case.",
        "Does anyone know if this affects the mobile version too?",
        "Patch submitted. Also cleaned up some related dead code while I was in there.",
    ]

    types = ["bug", "suggestion"]
    priorities = ["low", "medium", "high"]
    statuses = ["reported", "in_progress", "completed", "wont_fix"]
    os_options = [[], ["windows"], ["windows", "linux"], ["windows", "macos"], ["macos", "linux"], ["windows", "linux", "macos"]]

    all_issues = []
    all_assignments = []
    all_comments = []
    upvote_pairs = set()

    for p in projects:
        version = version_by_project.get(p.id)
        version_id = version.id if version else None
        categories = p.categories or ["General"]
        project_age_days = max(1, (now - p.created_at).days) if p.created_at else 30

        issue_count = rng.randint(20, 50)
        for i in range(issue_count):
            summary = issue_summaries[(hash(p.name) + i) % len(issue_summaries)]
            reporter = contributor_pool[rng.randint(0, len(contributor_pool) - 1)]
            days_ago = rng.randint(0, min(project_age_days, 90))
            issue_type = rng.choice(types)
            status = rng.choices(statuses, weights=[30, 20, 30, 20])[0]

            # Archived flag — only completed/wont_fix can be archived
            # ~60% of completed and ~70% of wont_fix issues get archived
            archived = False
            if status == "completed":
                archived = rng.random() < 0.6
            elif status == "wont_fix":
                archived = rng.random() < 0.7

            issue = Issue(
                project_id=p.id,
                summary=f"{summary} (#{i + 1})",
                author_id=reporter.discord_id,
                version_id=version_id,
                category=rng.choice(categories),
                type=issue_type,
                priority=rng.choice(priorities),
                status=status,
                operating_systems=rng.choice(os_options),
                description="",
                upvotes=0,
                archived=archived,
                is_visitor_issue=rng.random() < 0.15,
                created_at=now - timedelta(days=days_ago, hours=rng.randint(0, 23)),
            )
            all_issues.append(issue)

    db.add_all(all_issues)
    db.flush()

    # ── Assignments (1-7 per issue) ────────────────────────────────────
    # Build a lookup of project members for realistic assignee selection
    members_by_project = {}
    for mr in member_rows:
        members_by_project.setdefault(mr.project_id, []).append(mr.user_id)
    # Ensure owner is always in the pool
    for p in projects:
        members_by_project.setdefault(p.id, [])
        if p.owner_id not in members_by_project[p.id]:
            members_by_project[p.id].append(p.owner_id)

    for issue in all_issues:
        assignment_count = rng.randint(1, 7)
        tasks = rng.sample(task_templates, min(assignment_count, len(task_templates)))
        member_pool = members_by_project.get(issue.project_id, [])

        for task in tasks:
            assignee_id = rng.choice(member_pool)
            done = rng.random() < 0.5

            all_assignments.append(Assignment(
                issue_id=issue.id,
                assignee_id=assignee_id,
                task=task,
                done=done,
            ))

    db.add_all(all_assignments)
    db.flush()

    # ── Comments (1-5 per issue) ───────────────────────────────────────
    for issue in all_issues:
        comment_count = rng.randint(1, 5)
        for c in range(comment_count):
            commenter = contributor_pool[rng.randint(0, len(contributor_pool) - 1)]
            body = comment_bodies[rng.randint(0, len(comment_bodies) - 1)]
            days_after_issue = rng.randint(0, 5)
            comment_time = issue.created_at + timedelta(days=days_after_issue, hours=rng.randint(1, 12))
            if comment_time > now:
                comment_time = now - timedelta(hours=rng.randint(1, 24))
            all_comments.append(Comment(
                issue_id=issue.id,
                author_id=commenter.discord_id,
                body=body,
                created_at=comment_time,
            ))

    db.add_all(all_comments)
    db.flush()

    # ── Upvotes ────────────────────────────────────────────────────────
    upvote_rows = []
    for issue in all_issues:
        voter_count = rng.randint(0, 4)
        voters = rng.sample(contributor_pool, min(voter_count, len(contributor_pool)))
        for voter in voters:
            pair = (issue.id, voter.discord_id)
            if pair not in upvote_pairs:
                upvote_pairs.add(pair)
                upvote_rows.append(IssueUpvote(issue_id=issue.id, user_id=voter.discord_id))
                issue.upvotes += 1
    db.add_all(upvote_rows)
    db.flush()

    # ── View / Download Events ─────────────────────────────────────────
    view_count = 0
    download_count = 0
    for idx, p in enumerate(projects):
        num_views = rng.randint(5, 25)
        for i in range(num_views):
            db.add(ViewEvent(
                project_id=p.id,
                client_token=f"viewer-p{idx}-{i:04d}",
                created_at=now - timedelta(hours=rng.randint(1, 720)),
            ))
            view_count += 1
        num_downloads = rng.randint(2, 12)
        for i in range(num_downloads):
            db.add(DownloadEvent(
                project_id=p.id,
                client_token=f"dl-p{idx}-{i:04d}",
                created_at=now - timedelta(hours=rng.randint(1, 720)),
            ))
            download_count += 1
    db.flush()

    # ── Ratings ────────────────────────────────────────────────────────
    ratings = []
    rated_pairs = set()
    for p in projects:
        if not p.game or not p.is_public:
            continue
        num_ratings = rng.randint(2, 8)
        candidates = [u for u in users if u.discord_id != p.owner_id]
        raters = rng.sample(candidates, min(num_ratings, len(candidates)))
        for rater in raters:
            pair = (p.id, rater.discord_id)
            if pair not in rated_pairs:
                rated_pairs.add(pair)
                ratings.append(ProjectRating(
                    project_id=p.id, user_id=rater.discord_id,
                    stars=rng.randint(2, 5),
                    created_at=now - timedelta(days=rng.randint(1, 60)),
                ))
    db.add_all(ratings)
    db.flush()

    # ── Activity Log ───────────────────────────────────────────────────
    activity = []
    for p in projects:
        activity.append(ActivityLog(
            project_id=p.id, user_id=p.owner_id, action="project_created",
            detail=f"Created project {p.name}", created_at=p.created_at,
        ))
        activity.append(ActivityLog(
            project_id=p.id, user_id=p.owner_id, action="version_published",
            detail="Released version 1.0.0",
            created_at=p.created_at + timedelta(days=1),
        ))
    db.add_all(activity)

    db.commit()
    db.close()
    print("Seed complete. Inserted:")
    print(f"  {len(users)} users")
    print(f"  {len(projects)} projects")
    print(f"  {len(all_versions)} versions")
    print(f"  {len(all_issues)} issues")
    print(f"  {len(all_assignments)} assignments")
    print(f"  {len(all_comments)} comments")
    print(f"  {len(upvote_rows)} upvotes")
    print(f"  {view_count} view events")
    print(f"  {download_count} download events")
    print(f"  {len(ratings)} ratings")
    print(f"  {len(activity)} activity log entries")


if __name__ == "__main__":
    seed()
