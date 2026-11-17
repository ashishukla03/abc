"""
Gramin PocketLab — OpenMotion Scene & Project Generator
File: scripts/generate_openmotion_scenes.py
Generates 8 self-contained HTML+GSAP scenes conforming to OpenMotion scene-contract.md,
plus an interactive master preview player and project descriptor.
"""

import os
import shutil

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PROJECT_DIR = os.path.join(ROOT_DIR, 'openmotion', 'projects', 'gramin_pocketlab_overview')
SCENES_DIR = os.path.join(PROJECT_DIR, 'scenes')
ASSETS_DIR = os.path.join(ROOT_DIR, 'openmotion', 'assets')
APPDATA_OPENMOTION = os.path.expandvars(r'%APPDATA%\OpenMotion\projects\gramin_pocketlab_overview')

os.makedirs(SCENES_DIR, exist_ok=True)

# Common HTML template wrapper
def render_scene(scene_id, title, subtitle, badge_text, badge_color, main_content_html, gsap_script, duration=4.0):
    return f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Gramin PocketLab — {title}</title>
    <style>
      *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
      html, body {{
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #F5F7FB;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: #162033;
      }}
      .frame {{
        position: relative;
        width: 1920px;
        height: 1080px;
        overflow: hidden;
        background: #F5F7FB;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 50px 80px;
        -webkit-font-smoothing: antialiased;
      }}
      /* Ambient subtle background grid */
      .bg-grid {{
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background-size: 60px 60px;
        background-image:
          linear-gradient(to right, rgba(22, 32, 51, 0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(22, 32, 51, 0.04) 1px, transparent 1px);
        pointer-events: none;
        z-index: 0;
      }}
      .scene-header {{
        position: relative;
        z-index: 10;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #E5E7EB;
        padding-bottom: 20px;
      }}
      .brand-lockup {{
        display: flex;
        align-items: center;
        gap: 16px;
      }}
      .brand-badge {{
        background: {badge_color};
        color: #FFFFFF;
        font-weight: 700;
        font-size: 16px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 8px 18px;
        border-radius: 9999px;
      }}
      .brand-title {{
        font-size: 26px;
        font-weight: 800;
        color: #162033;
      }}
      .scene-tag {{
        font-size: 16px;
        font-weight: 600;
        color: #596579;
        background: #FFFFFF;
        padding: 6px 14px;
        border-radius: 8px;
        border: 1px solid #D9E0EB;
      }}
      .scene-content {{
        position: relative;
        z-index: 10;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px 0;
      }}
      .scene-footer {{
        position: relative;
        z-index: 10;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #E5E7EB;
        padding-top: 16px;
        color: #596579;
        font-size: 16px;
      }}
      .footer-caption {{
        font-weight: 600;
        color: #162033;
        background: #FFFFFF;
        padding: 8px 18px;
        border-radius: 8px;
        border-left: 4px solid {badge_color};
      }}
      /* Responsive Content Utilities */
      .card {{
        background: #FFFFFF;
        border-radius: 16px;
        border: 1px solid #D9E0EB;
        box-shadow: 0 10px 25px -5px rgba(22, 32, 51, 0.06);
        padding: 32px;
      }}
      .screenshot-container {{
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid #D9E0EB;
        box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        background: #FFFFFF;
      }}
      .screenshot-img {{
        width: 100%;
        height: auto;
        display: block;
      }}
    </style>
    <!-- GSAP for timeline seeking -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  </head>
  <body>
    <div class="frame" id="frame">
      <div class="bg-grid"></div>

      <header class="scene-header">
        <div class="brand-lockup">
          <span class="brand-badge">{badge_text}</span>
          <span class="brand-title">Gramin PocketLab</span>
        </div>
        <div class="scene-tag">16:9 • 1920×1080 • Scene: {scene_id}</div>
      </header>

      <main class="scene-content">
        {main_content_html}
      </main>

      <footer class="scene-footer">
        <div class="footer-caption">{subtitle}</div>
        <div class="footer-meta">Offline-First STEM Learning Ecosystem • Classes 5–12</div>
      </footer>
    </div>

    <script>
      const tl = gsap.timeline({{ paused: true }});
      {gsap_script}

      // OpenMotion Scene Contract
      window.__SCENE_TIMELINE__ = tl;
      window.__SCENE_DURATION__ = {duration};
    </script>
  </body>
</html>
"""

# 1. Scene 1: Product Identity & Purpose
s1_html = """
<div class="card" style="width: 1000px; text-align: center; padding: 60px 50px;">
  <div class="badge-pill" style="display: inline-block; background: #E6F5F4; color: #087E79; font-weight: 700; font-size: 18px; padding: 8px 24px; border-radius: 9999px; margin-bottom: 24px;">
    FOUNDATIONAL STEM PLATFORM
  </div>
  <h1 class="hero-title" style="font-size: 56px; font-weight: 900; line-height: 1.15; color: #162033; margin-bottom: 20px;">
    Offline-First STEM Micro-Labs<br />for Rural Classrooms
  </h1>
  <p class="hero-desc" style="font-size: 24px; color: #596579; max-width: 800px; margin: 0 auto 36px;">
    Empowering students in Grades 6–8 with interactive, inquiry-based physics, chemistry, biology, and mathematics simulations on budget mobile devices.
  </p>
  <div class="feature-pills" style="display: flex; justify-content: center; gap: 20px;">
    <span class="pill" style="background: #F0F4F8; padding: 12px 22px; border-radius: 12px; font-weight: 600; font-size: 18px; color: #162033;">🟢 Offline Service Worker</span>
    <span class="pill" style="background: #F0F4F8; padding: 12px 22px; border-radius: 12px; font-weight: 600; font-size: 18px; color: #162033;">🔇 Zero Autoplay Audio</span>
    <span class="pill" style="background: #F0F4F8; padding: 12px 22px; border-radius: 12px; font-weight: 600; font-size: 18px; color: #162033;">📱 360px Mobile Responsive</span>
  </div>
</div>
"""
s1_gsap = """
tl.fromTo('.badge-pill', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }, 0.2);
tl.fromTo('.hero-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.4);
tl.fromTo('.hero-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.7);
tl.fromTo('.pill', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out' }, 1.0);
"""

# 2. Scene 2: Actual Learner Journey
s2_html = """
<div style="display: flex; gap: 40px; align-items: center; width: 100%; max-width: 1700px;">
  <div style="flex: 1;">
    <h2 class="journey-title" style="font-size: 42px; font-weight: 800; color: #162033; margin-bottom: 16px;">
      7-Step Active Learning Cycle
    </h2>
    <p class="journey-desc" style="font-size: 20px; color: #596579; margin-bottom: 28px;">
      Every topic guides the learner from hypothesis to evidence-based reflection, ensuring scientific depth without cognitive overload.
    </p>
    <div class="steps-list" style="display: flex; flex-direction: column; gap: 12px;">
      <div class="step-item" style="background: #FFFFFF; border-left: 6px solid #275DDB; padding: 12px 20px; border-radius: 8px; font-weight: 700; font-size: 18px;">
        1. Mission Brief (S1) &rarr; Prediction Hypothesis (S2)
      </div>
      <div class="step-item active-step" style="background: #EBF1FD; border-left: 6px solid #087E79; padding: 12px 20px; border-radius: 8px; font-weight: 700; font-size: 18px; color: #087E79;">
        2. Interactive Micro-Lab Exploration (S3) [FAIL-CLOSED]
      </div>
      <div class="step-item" style="background: #FFFFFF; border-left: 6px solid #8B3E98; padding: 12px 20px; border-radius: 8px; font-weight: 700; font-size: 18px;">
        3. Concept Review (S4) & Formative Diagnostic (S5)
      </div>
      <div class="step-item" style="background: #FFFFFF; border-left: 6px solid #18794E; padding: 12px 20px; border-radius: 8px; font-weight: 700; font-size: 18px;">
        4. Transfer Exit Ticket (S6) & Mastery Celebration (S7)
      </div>
    </div>
  </div>
  <div style="flex: 1.2;">
    <div class="screenshot-container map-preview">
      <img src="../../assets/screenshot_01_map.png" alt="Mission Map" class="screenshot-img" />
    </div>
  </div>
</div>
"""
s2_gsap = """
tl.fromTo('.journey-title', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.2);
tl.fromTo('.journey-desc', { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.4);
tl.fromTo('.step-item', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'power2.out' }, 0.6);
tl.fromTo('.map-preview', { scale: 0.9, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.5);
"""

# 3. Scene 3: Mathematics Water Share Challenge
s3_html = """
<div style="display: flex; gap: 40px; align-items: center; width: 100%; max-width: 1700px;">
  <div style="flex: 1;">
    <div style="background: #EBF1FD; color: #275DDB; font-weight: 800; font-size: 16px; padding: 6px 16px; border-radius: 9999px; display: inline-block; margin-bottom: 16px;">
      MIDDLE STAGE MATHEMATICS • RATIOS & FRACTIONS
    </div>
    <h2 class="math-title" style="font-size: 40px; font-weight: 800; color: #162033; margin-bottom: 16px;">
      Water Share Challenge
    </h2>
    <p class="math-desc" style="font-size: 20px; color: #596579; margin-bottom: 24px;">
      Students divide village canal irrigation water fairly according to plot sizes, strictly enforcing volume conservation and ratio proportionality.
    </p>
    <div style="background: #FFFFFF; border: 1px solid #D9E0EB; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
      <div style="font-weight: 700; color: #162033; font-size: 18px; margin-bottom: 10px;">Enforced Invariants:</div>
      <ul style="padding-left: 20px; color: #596579; font-size: 16px; line-height: 1.6;">
        <li><strong>Volume Conservation:</strong> Plot A + Plot B + Plot C = Exactly 12 Units</li>
        <li><strong>Proportional Ratio:</strong> 1 : 2 : 3 partition &rarr; 2, 4, 6 units</li>
        <li><strong>Input Clamping:</strong> Negative inputs guarded; reactive status indicator</li>
      </ul>
    </div>
  </div>
  <div style="flex: 1.3;">
    <div class="screenshot-container math-preview">
      <img src="../../assets/screenshot_02_math.png" alt="Mathematics Water Share Lab" class="screenshot-img" />
    </div>
  </div>
</div>
"""
s3_gsap = """
tl.fromTo('.math-title', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.2);
tl.fromTo('.math-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.4);
tl.fromTo('.math-preview', { scale: 0.92, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.4);
"""

# 4. Scene 4: Biology Food Web Explorer
s4_html = """
<div style="display: flex; gap: 40px; align-items: center; width: 100%; max-width: 1700px;">
  <div style="flex: 1;">
    <div style="background: #E8F5EE; color: #18794E; font-weight: 800; font-size: 16px; padding: 6px 16px; border-radius: 9999px; display: inline-block; margin-bottom: 16px;">
      MIDDLE STAGE BIOLOGY • LIVING ORGANISMS & HABITATS
    </div>
    <h2 class="bio-title" style="font-size: 40px; font-weight: 800; color: #162033; margin-bottom: 16px;">
      Food Web Explorer
    </h2>
    <p class="bio-desc" style="font-size: 20px; color: #596579; margin-bottom: 24px;">
      Clarifying directional energy flow in ecosystems and modeling trophic disruption when apex predators or primary producers fluctuate.
    </p>
    <div style="background: #FFFFFF; border: 1px solid #D9E0EB; border-radius: 12px; padding: 20px;">
      <div style="font-weight: 700; color: #162033; font-size: 18px; margin-bottom: 10px;">Scientific & A11y Standards:</div>
      <ul style="padding-left: 20px; color: #596579; font-size: 16px; line-height: 1.6;">
        <li><strong>Directional Energy Arrows:</strong> Explicit A &rarr; B denotes energy transfer</li>
        <li><strong>3 Discrete Scenarios:</strong> Balanced, Drought, Remove-Snakes</li>
        <li><strong>Full A11y Parity:</strong> Semantic data table for TalkBack screen readers</li>
      </ul>
    </div>
  </div>
  <div style="flex: 1.3;">
    <div class="screenshot-container bio-preview">
      <img src="../../assets/screenshot_03_biology.png" alt="Biology Food Web Explorer" class="screenshot-img" />
    </div>
  </div>
</div>
"""
s4_gsap = """
tl.fromTo('.bio-title', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.2);
tl.fromTo('.bio-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.4);
tl.fromTo('.bio-preview', { scale: 0.92, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.4);
"""

# 5. Scene 5: Chemistry pH Color Lab
s5_html = """
<div style="display: flex; gap: 40px; align-items: center; width: 100%; max-width: 1700px;">
  <div style="flex: 1;">
    <div style="background: #F5EBF7; color: #8B3E98; font-weight: 800; font-size: 16px; padding: 6px 16px; border-radius: 9999px; display: inline-block; margin-bottom: 16px;">
      MIDDLE STAGE CHEMISTRY • ACIDS, BASES & SALTS
    </div>
    <h2 class="chem-title" style="font-size: 40px; font-weight: 800; color: #162033; margin-bottom: 16px;">
      pH Color Lab
    </h2>
    <p class="chem-desc" style="font-size: 20px; color: #596579; margin-bottom: 24px;">
      Testing natural and synthetic indicators against household solutions with strict water safety boundaries.
    </p>
    <div style="background: #FFFFFF; border: 1px solid #D9E0EB; border-radius: 12px; padding: 20px;">
      <div style="font-weight: 700; color: #162033; font-size: 18px; margin-bottom: 10px;">Gated Testing & Safety Boundary:</div>
      <ul style="padding-left: 20px; color: #596579; font-size: 16px; line-height: 1.6;">
        <li><strong>Explicit Gating:</strong> Requires beaker & indicator selection + Dip Paper trigger</li>
        <li><strong>Indicators:</strong> Turmeric paper (natural) & Universal Indicator (spectrum)</li>
        <li><strong>Water Safety Notice:</strong> Neutrality (pH 7.0) does NOT establish biological potability</li>
      </ul>
    </div>
  </div>
  <div style="flex: 1.3;">
    <div class="screenshot-container chem-preview">
      <img src="../../assets/screenshot_04_chemistry.png" alt="Chemistry pH Color Lab" class="screenshot-img" />
    </div>
  </div>
</div>
"""
s5_gsap = """
tl.fromTo('.chem-title', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.2);
tl.fromTo('.chem-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.4);
tl.fromTo('.chem-preview', { scale: 0.92, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.4);
"""

# 6. Scene 6: Physics Sound Detective
s6_html = """
<div style="display: flex; gap: 40px; align-items: center; width: 100%; max-width: 1700px;">
  <div style="flex: 1;">
    <div style="background: #E6F5F4; color: #087E79; font-weight: 800; font-size: 16px; padding: 6px 16px; border-radius: 9999px; display: inline-block; margin-bottom: 16px;">
      MIDDLE STAGE PHYSICS • SOUND, WAVES & FREQUENCY
    </div>
    <h2 class="phys-title" style="font-size: 40px; font-weight: 800; color: #162033; margin-bottom: 16px;">
      Sound Detective
    </h2>
    <p class="phys-desc" style="font-size: 20px; color: #596579; margin-bottom: 24px;">
      Flagship Web Audio synthesis with live oscilloscope waveform visualization and strict acoustic safety ceilings.
    </p>
    <div style="background: #FFFFFF; border: 1px solid #D9E0EB; border-radius: 12px; padding: 20px;">
      <div style="font-weight: 700; color: #162033; font-size: 18px; margin-bottom: 10px;">Scientific Waveform Accuracy:</div>
      <ul style="padding-left: 20px; color: #596579; font-size: 16px; line-height: 1.6;">
        <li><strong>Waveform Calibrations:</strong> 220 Hz = 2.2 cycles; 440 Hz = 4.4 cycles in 10 ms</li>
        <li><strong>Acoustic Safety:</strong> Software gain clamped &le; 0.70; zero autoplay policy</li>
        <li><strong>Scientific Clarity:</strong> Separates software gain from physical sound pressure</li>
      </ul>
    </div>
  </div>
  <div style="flex: 1.3;">
    <div class="screenshot-container phys-preview">
      <img src="../../assets/screenshot_05_physics.png" alt="Physics Sound Detective Lab" class="screenshot-img" />
    </div>
  </div>
</div>
"""
s6_gsap = """
tl.fromTo('.phys-title', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.2);
tl.fromTo('.phys-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.4);
tl.fromTo('.phys-preview', { scale: 0.92, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.4);
"""

# 7. Scene 7: Honest Statement of Product Scope
s7_html = """
<div style="width: 100%; max-width: 1500px;">
  <div style="text-align: center; margin-bottom: 36px;">
    <span style="background: #FEF3C7; color: #B45309; font-weight: 800; font-size: 16px; padding: 6px 20px; border-radius: 9999px; text-transform: uppercase;">
      Independent Audit & Release Transparency
    </span>
    <h2 class="scope-title" style="font-size: 42px; font-weight: 800; color: #162033; margin-top: 12px;">
      Honest Product Scope & Quality Gates
    </h2>
  </div>

  <div style="display: flex; gap: 30px;">
    <div class="scope-card" style="flex: 1; background: #FFFFFF; border-top: 6px solid #18794E; border-radius: 12px; padding: 28px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-left: 1px solid #D9E0EB; border-right: 1px solid #D9E0EB; border-bottom: 1px solid #D9E0EB;">
      <h3 style="color: #18794E; font-size: 22px; font-weight: 800; margin-bottom: 16px;">
        &check; Implemented & Verified in Runtime (Sprint 1)
      </h3>
      <ul style="color: #162033; font-size: 18px; line-height: 1.8; list-style: none;">
        <li>&bull; <strong>4 Middle Stage STEM Labs:</strong> Math, Bio, Chem, Phys hardened</li>
        <li>&bull; <strong>72 Automated Tests:</strong> 10 unit/integration suites (100% pass)</li>
        <li>&bull; <strong>Offline Ready:</strong> Service Worker controller caching shell & data</li>
        <li>&bull; <strong>Accessibility:</strong> 48px touch targets, focus rings, reduced-motion</li>
      </ul>
    </div>

    <div class="scope-card" style="flex: 1; background: #FFFFFF; border-top: 6px solid #B45309; border-radius: 12px; padding: 28px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-left: 1px solid #D9E0EB; border-right: 1px solid #D9E0EB; border-bottom: 1px solid #D9E0EB;">
      <h3 style="color: #B45309; font-size: 22px; font-weight: 800; margin-bottom: 16px;">
        &hourglass_flowing_sand; Retained in Specification (Deferred Scope)
      </h3>
      <ul style="color: #596579; font-size: 18px; line-height: 1.8; list-style: none;">
        <li>&bull; <strong>Classes 5–12 Expansion:</strong> Senior Secondary curriculum roadmap</li>
        <li>&bull; <strong>Physical Hardware Fleet:</strong> On-device low-RAM physical testing</li>
        <li>&bull; <strong>Official Board Review:</strong> Native Kannada translation accreditation</li>
        <li>&bull; <strong>Legal / Statutory:</strong> DPDP Act audit & external WCAG certifications</li>
      </ul>
    </div>
  </div>
</div>
"""
s7_gsap = """
tl.fromTo('.scope-title', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.2);
tl.fromTo('.scope-card', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out' }, 0.4);
"""

# 8. Scene 8: Strong Closing Brand Moment
s8_html = """
<div class="card" style="width: 1000px; text-align: center; padding: 60px 40px;">
  <div class="closing-badge" style="display: inline-flex; align-items: center; justify-content: center; width: 90px; height: 90px; border-radius: 24px; background: #087E79; color: #FFFFFF; font-size: 44px; margin-bottom: 24px; box-shadow: 0 10px 25px rgba(8, 126, 121, 0.3);">
    &xcup;
  </div>
  <h1 class="closing-title" style="font-size: 52px; font-weight: 900; color: #162033; margin-bottom: 16px;">
    Gramin PocketLab
  </h1>
  <p class="closing-sub" style="font-size: 26px; color: #087E79; font-weight: 700; margin-bottom: 24px;">
    Empowering Every Village Classroom Offline
  </p>
  <p class="closing-tagline" style="font-size: 20px; color: #596579; max-width: 700px; margin: 0 auto 36px;">
    No complex installation. No mandatory network. Zero tracking.<br />
    Scientific inquiry built for budget smartphones and local school labs.
  </p>
  <div class="closing-cta" style="display: inline-block; background: #275DDB; color: #FFFFFF; font-weight: 800; font-size: 20px; padding: 14px 36px; border-radius: 12px; box-shadow: 0 6px 20px rgba(39, 93, 219, 0.3);">
    Start Exploring STEM Missions &rarr;
  </div>
</div>
"""
s8_gsap = """
tl.fromTo('.closing-badge', { scale: 0.5, opacity: 0, rotation: -20 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(2)' }, 0.2);
tl.fromTo('.closing-title', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.4);
tl.fromTo('.closing-sub', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.6);
tl.fromTo('.closing-tagline', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.8);
tl.fromTo('.closing-cta', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }, 1.0);
"""

scenes = [
    ("scene_01_identity", "Product Identity & Purpose", "Gramin PocketLab: Offline-First STEM Micro-Labs for Rural Students", "OVERVIEW", "#087E79", s1_html, s1_gsap),
    ("scene_02_journey", "Actual Learner Journey", "Structured 7-Step Active Learning: Brief → Predict → Explore → Diagnose → Exit", "PEDAGOGY", "#275DDB", s2_html, s2_gsap),
    ("scene_03_mathematics", "Mathematics: Water Share Challenge", "Mathematics: 12-Unit Canal Water Conservation and 1:2:3 Ratio Partition", "MATHEMATICS", "#275DDB", s3_html, s3_gsap),
    ("scene_04_biology", "Biology: Food Web Explorer", "Biology: Directional Energy Flow and Trophic Disturbance Scenarios", "BIOLOGY", "#18794E", s4_html, s4_gsap),
    ("scene_05_chemistry", "Chemistry: pH Color Lab", "Chemistry: Turmeric & Universal Indicators — Distilled Water Neutrality vs Potability", "CHEMISTRY", "#8B3E98", s5_html, s5_gsap),
    ("scene_06_physics", "Physics: Sound Detective", "Physics: Sound Waveforms — 220 Hz vs 440 Hz in 10 ms Window with Gain Ceiling", "PHYSICS", "#087E79", s6_html, s6_gsap),
    ("scene_07_scope", "Honest Statement of Product Scope", "Current Scope: 4 Hardened Middle Stage STEM Labs; Classes 5–12 in Design", "AUDIT", "#B45309", s7_html, s7_gsap),
    ("scene_08_closing", "Strong Closing Brand Moment", "Gramin PocketLab: Empowering Every Village Classroom Offline", "COMMUNITY", "#087E79", s8_html, s8_gsap)
]

for s_id, s_title, s_sub, s_badge, s_color, s_content, s_gsap in scenes:
    file_path = os.path.join(SCENES_DIR, f"{s_id}.html")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(render_scene(s_id, s_title, s_sub, s_badge, s_color, s_content, s_gsap))
    print(f"Generated {file_path}")

# Master Player HTML stitching all 8 scenes
player_html = """<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Gramin PocketLab Overview — OpenMotion Master Player</title>
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        background: #0F172A;
        color: #F8FAFC;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
        padding: 24px;
      }
      .player-header {
        width: 100%;
        max-width: 1280px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      .viewport-stage {
        width: 100%;
        max-width: 1280px;
        aspect-ratio: 16 / 9;
        background: #000;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        position: relative;
      }
      iframe {
        width: 1920px;
        height: 1080px;
        border: none;
        transform-origin: top left;
      }
      .controls-bar {
        width: 100%;
        max-width: 1280px;
        background: #1E293B;
        border-radius: 12px;
        padding: 16px 24px;
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .scrub-row {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .scrub-slider {
        flex: 1;
        cursor: pointer;
        height: 8px;
        accent-color: #275DDB;
      }
      .btn-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .btn {
        background: #275DDB;
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 10px 20px;
        font-weight: 700;
        cursor: pointer;
        font-size: 16px;
      }
      .btn:hover { background: #1A46A8; }
      .scene-selector {
        background: #0F172A;
        color: #F8FAFC;
        border: 1px solid #334155;
        border-radius: 6px;
        padding: 8px 12px;
        font-size: 14px;
      }
      .captions-box {
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid #334155;
        border-radius: 8px;
        padding: 10px 16px;
        font-size: 16px;
        color: #F8FAFC;
        font-weight: 600;
        text-align: center;
        min-height: 44px;
      }
    </style>
  </head>
  <body>
    <div class="player-header">
      <div>
        <h1 style="font-size: 24px; font-weight: 800;">Gramin PocketLab — 32s Overview (OpenMotion)</h1>
        <p style="color: #94A3B8; font-size: 14px;">16:9 • 1920×1080 • 8-Scene Sequence</p>
      </div>
      <div style="background: #18794E; color: #fff; padding: 6px 14px; border-radius: 9999px; font-size: 14px; font-weight: 700;">
        OpenMotion Contract Verified
      </div>
    </div>

    <div class="viewport-stage" id="stage">
      <iframe id="scene-frame" src="scenes/scene_01_identity.html"></iframe>
    </div>

    <div class="controls-bar">
      <div class="scrub-row">
        <span id="time-display" style="font-family: monospace; font-size: 16px; width: 80px;">00:00 / 00:32</span>
        <input type="range" id="scrubber" class="scrub-slider" min="0" max="32" step="0.05" value="0" />
      </div>

      <div class="btn-row">
        <div style="display: flex; gap: 12px; align-items: center;">
          <button class="btn" id="btn-play">Play</button>
          <button class="btn" id="btn-restart" style="background: #475569;">Restart</button>
          <select class="scene-selector" id="scene-select">
            <option value="0">Scene 1: Identity & Purpose (0-4s)</option>
            <option value="1">Scene 2: Learner Journey (4-8s)</option>
            <option value="2">Scene 3: Mathematics Water Share (8-12s)</option>
            <option value="3">Scene 4: Biology Food Web (12-16s)</option>
            <option value="4">Scene 5: Chemistry pH Lab (16-20s)</option>
            <option value="5">Scene 6: Physics Sound Detective (20-24s)</option>
            <option value="6">Scene 7: Product Scope (24-28s)</option>
            <option value="7">Scene 8: Closing Brand Moment (28-32s)</option>
          </select>
        </div>
        <div style="font-size: 14px; color: #94A3B8;">
          Audio: None (Autonomous Readability Verified)
        </div>
      </div>

      <div class="captions-box" id="captions">
        Gramin PocketLab: Offline-First STEM Micro-Labs for Rural Students
      </div>
    </div>

    <script>
      const scenes = [
        { file: "scenes/scene_01_identity.html", caption: "Gramin PocketLab: Offline-First STEM Micro-Labs for Rural Students" },
        { file: "scenes/scene_02_journey.html", caption: "Structured 7-Step Active Learning: Brief → Predict → Explore → Diagnose → Exit" },
        { file: "scenes/scene_03_mathematics.html", caption: "Mathematics: 12-Unit Canal Water Conservation and 1:2:3 Ratio Partition" },
        { file: "scenes/scene_04_biology.html", caption: "Biology: Directional Energy Flow and Trophic Disturbance Scenarios" },
        { file: "scenes/scene_05_chemistry.html", caption: "Chemistry: Turmeric & Universal Indicators — Distilled Water Neutrality vs Potability" },
        { file: "scenes/scene_06_physics.html", caption: "Physics: Sound Waveforms — 220 Hz vs 440 Hz in 10 ms Window with Gain Ceiling" },
        { file: "scenes/scene_07_scope.html", caption: "Current Scope: 4 Hardened Middle Stage STEM Labs; Classes 5–12 in Design" },
        { file: "scenes/scene_08_closing.html", caption: "Gramin PocketLab: Empowering Every Village Classroom Offline" }
      ];

      const stage = document.getElementById('stage');
      const iframe = document.getElementById('scene-frame');
      const scrubber = document.getElementById('scrubber');
      const timeDisplay = document.getElementById('time-display');
      const captions = document.getElementById('captions');
      const btnPlay = document.getElementById('btn-play');
      const btnRestart = document.getElementById('btn-restart');
      const sceneSelect = document.getElementById('scene-select');

      let currentGlobalTime = 0;
      let currentSceneIdx = -1;
      let isPlaying = false;
      let animFrame = null;
      let lastTimestamp = null;

      function resizeFrame() {
        const stageW = stage.clientWidth;
        const scale = stageW / 1920;
        iframe.style.transform = `scale(${scale})`;
      }
      window.addEventListener('resize', resizeFrame);
      resizeFrame();

      function loadScene(idx, seekLocalTime = 0) {
        if (currentSceneIdx !== idx) {
          currentSceneIdx = idx;
          sceneSelect.value = String(idx);
          iframe.src = scenes[idx].file;
          captions.textContent = scenes[idx].caption;
          iframe.onload = () => {
            seekInIframe(seekLocalTime);
          };
        } else {
          seekInIframe(seekLocalTime);
        }
      }

      function seekInIframe(localSec) {
        try {
          const win = iframe.contentWindow;
          if (win && win.__SCENE_TIMELINE__) {
            win.__SCENE_TIMELINE__.seek(localSec, false);
          }
        } catch (_) {}
      }

      function setGlobalTime(t) {
        currentGlobalTime = Math.max(0, Math.min(32, t));
        scrubber.value = currentGlobalTime;
        const mm = String(Math.floor(currentGlobalTime / 60)).padStart(2, '0');
        const ss = String(Math.floor(currentGlobalTime % 60)).padStart(2, '0');
        timeDisplay.textContent = `${mm}:${ss} / 00:32`;

        const sceneIdx = Math.min(7, Math.floor(currentGlobalTime / 4));
        const sceneLocal = currentGlobalTime - (sceneIdx * 4);
        loadScene(sceneIdx, sceneLocal);
      }

      scrubber.addEventListener('input', (e) => {
        pause();
        setGlobalTime(parseFloat(e.target.value));
      });

      sceneSelect.addEventListener('change', (e) => {
        pause();
        setGlobalTime(parseInt(e.target.value) * 4);
      });

      function play() {
        if (currentGlobalTime >= 32) setGlobalTime(0);
        isPlaying = true;
        btnPlay.textContent = 'Pause';
        lastTimestamp = performance.now();
        animFrame = requestAnimationFrame(tick);
      }

      function pause() {
        isPlaying = false;
        btnPlay.textContent = 'Play';
        if (animFrame) cancelAnimationFrame(animFrame);
      }

      function tick(now) {
        if (!isPlaying) return;
        const deltaSec = (now - lastTimestamp) / 1000;
        lastTimestamp = now;
        const nextTime = currentGlobalTime + deltaSec;
        if (nextTime >= 32) {
          setGlobalTime(32);
          pause();
        } else {
          setGlobalTime(nextTime);
          animFrame = requestAnimationFrame(tick);
        }
      }

      btnPlay.addEventListener('click', () => {
        if (isPlaying) pause(); else play();
      });

      btnRestart.addEventListener('click', () => {
        pause();
        setGlobalTime(0);
        play();
      });

      // Initial load
      setGlobalTime(0);
    </script>
  </body>
</html>
"""

player_path = os.path.join(PROJECT_DIR, 'player.html')
with open(player_path, 'w', encoding='utf-8') as f:
    f.write(player_html)
print(f"Generated {player_path}")

# Sync to AppData OpenMotion projects
try:
    if os.path.exists(os.path.dirname(APPDATA_OPENMOTION)):
        shutil.rmtree(APPDATA_OPENMOTION, ignore_errors=True)
        shutil.copytree(PROJECT_DIR, APPDATA_OPENMOTION)
        print(f"Synchronized project to: {APPDATA_OPENMOTION}")
except Exception as e:
    print(f"AppData synchronization note: {e}")
