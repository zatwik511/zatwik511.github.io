---
order: 3
navLabel: NeuroMetric
navBlurb: AI-graded exam portal
title: NeuroMetric
summary: AI-powered exam portal.
tech: [Python, Flask, SQLAlchemy, PostgreSQL, Google Gemini, scikit-learn, Bootstrap, Gunicorn, Render]
link: open NeuroMetric | https://neurometric-mtxc.onrender.com/
galaxy: Research
system: NLP
---

<div class="cred-row">
<pre>SCHOOL  (Greenwood High, Std 8)
  Teacher : teacher@test.com / teacher123
  Student : student@test.com / student123</pre>
<pre>UNIVERSITY  (DIT, B.Tech CS Sem 3)
  Teacher : uni.teacher@test.com / teacher123
  Student : uni.student@test.com / student123</pre>
</div>

A full-stack exam portal where teachers create subjective exams and students submit answers that Google Gemini grades instantly, with scores, feedback, and AI-authorship detection. *First visit may take ~30 seconds (free-tier cold start).*

- **AI grading:** Gemini 2.5 Flash scores subjective answers with written feedback, falling back to TF-IDF cosine similarity when the API is unavailable.
- **Academic integrity:** AI-authorship detection on every submission, tab-switch and paste logging during exams, and cross-student plagiarism flags.
- **Multi-tenant:** isolated environments for schools (standard plus subjects) and universities (course plus semester), with role-based teacher and student access.
- **Teacher tools:** manual score overrides, results release, CSV export, and a suspicion dashboard ranking flagged submissions by cheat indicators.
