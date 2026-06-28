# Timeline Module Roadmap

This roadmap captures the improvements needed to make the Timeline module valuable for military, emergency management, and government exercise planning, conduct, evaluation, and after-action review.

## Research Basis

- FEMA HSEEP describes a common exercise management approach across design and development, conduct, evaluation, and improvement planning. Timeline should support each phase, not only live viewing.
  - Source: https://www.fema.gov/emergency-managers/national-preparedness/exercises/hseep
- FEMA PrepToolkit describes the MSEL as an online timeline of expected actions and scripted events injected into exercise play. Timeline should therefore treat planned injects, expected actions, and contingency injects as first-class records.
  - Source: https://preptoolkit.fema.gov/web/help/exercise-builder-guides/-/knowledge_base/msel/msel-overview
- PrepToolkit's MSEL area includes dashboard views by date, exercise objective, principal objective, status, category, and key events. Timeline needs comparable filtering and operational dashboards.
  - Source: https://preptoolkit.fema.gov/web/help/hseep-trusted-agent/-/asset_publisher/f4zjFt3Ld49w/article/id/18478513
- HSEEP-oriented MSEL guidance identifies event categories such as inject, contingency inject, expected action, and other. Timeline should preserve these categories and support ad hoc/contingency control during exercise play.
  - Source: https://preptoolkit.fema.gov/web/help/hseep-msel-author/-/asset_publisher/S0oicpWQKEUn/article/id/37556947
- Controller/evaluator guidance emphasizes that MSEL injects include implementer/controller information, expected player actions, attachments, and details that should not necessarily be visible to players. Timeline needs role-aware views.
  - Source: https://zahp.org/wp-content/uploads/2022/03/Controller-Evaluator-Handbook.docx.pdf
- AAR/IP guidance emphasizes observations, capability analysis, root causes, corrective actions, and improvement tracking. Timeline should feed directly into AAR evidence and corrective action workflows.
  - Source: https://des.mt.gov/Preparedness/EKL0146-SM-January-2022-Final.pdf
- Army AAR modernization examples emphasize real-time data collection, visualization for exercise control, and reuse of collected data in the AAR. Timeline should support live collection and replay.
  - Source: https://mwi.westpoint.edu/updating-the-after-action-review-jpmrcs-data-assessment-tool-and-the-next-generation-of-data-driven-lethality/

## Updated Product Direction

Timeline should become three connected tools:

1. MSEL control board for planned and contingency exercise control.
2. Live exercise common activity log for controllers, evaluators, and leadership.
3. AAR evidence workbench for selecting, tagging, analyzing, and exporting key moments.

## Priority Improvements

1. Exercise-scoped timeline model
   - Add `exerciseId` to timeline queries and eventually source records.
   - Prevent mixing artifacts from different exercises in the same workspace.
   - Support exercise clock time and real-world timestamp side by side.

2. MSEL-native event model
   - Distinguish contextual injects, expected actions, contingency injects, information updates, and ad hoc controller events.
   - Preserve inject number, scenario time, delivery method, originator, recipient/player cell, responsible controller, objective, capability, and expected action.

3. Role-aware timeline views
   - Controller view: full MSEL, implementer notes, contingency injects, release controls.
   - Evaluator view: expected actions, EEG/objective prompts, observation capture.
   - Player view: only released/player-visible events.
   - Leadership view: summarized status, late items, unresolved issues, key events.

4. Operational dashboard controls
   - Add filters by date, exercise objective, principal objective, status, category, key event, actor, source, and responsible controller.
   - Add counts for pending, released, completed, late, skipped, and flagged events.

5. Live exercise execution behavior
   - Add current-time marker, jump to now, pause auto-scroll, new-item indicator, auto-refresh/subscriptions, and exercise clock controls.
   - Support release/send/skip/hold status changes for MSEL injects.

6. Rich item detail drawer
   - Replace the simple bottom detail strip with a right-side drawer.
   - Show full content, controller notes, attachments, expected action, actual response, related observations, command acknowledgements, chat/media, map links, audit history, and AAR flags.

7. Related-activity grouping
   - Group command responses, observations, media posts, chat messages, and map events under the inject/event they relate to.
   - Show parent-child chains so controllers can understand whether an inject drove the expected activity.

8. Evaluator observation capture
   - Let evaluators add an observation directly from a timeline event.
   - Include objective/capability, strength/area for improvement, issue severity, supporting evidence, and recommended corrective action.

9. AAR/hot wash evidence workflow
   - Let users flag timeline items as AAR evidence.
   - Tag items as strength, issue, decision, delay, missed expected action, safety concern, or corrective action candidate.
   - Promote selected items into hot wash and AAR/IP reports.

10. Replay and reconstruction
    - Add replay mode that walks through exercise play chronologically.
    - Allow reviewers to compare planned MSEL time, actual release time, and actual participant response time.

11. Map and location correlation
    - Link location-enabled observations, participant positions, map annotations, and incident areas into timeline items.
    - Add "view on map" and synchronized map/timeline review.

12. Search, zoom, and usability polish
    - Add keyword search, zoom levels, compact/detail density, sticky lane labels, better collision handling, and keyboard navigation.
    - Add empty/error/loading states that explain missing exercise selection, source failures, and filtered-out data.

13. Export and reporting
    - Export filtered timeline views to PDF, CSV, and JSON.
    - Export AAR-selected evidence with timestamps, source links, actor, objective, and corrective action status.

14. Data integrity and audit
    - Audit release, edit, skip, delete, flag, export, and AAR promotion actions.
    - Preserve immutable event history for exercise reconstruction.

15. Test coverage
    - Add unit and end-to-end coverage for exercise scoping, role filtering, date filters, MSEL status changes, AAR flagging, and source-failure handling.

## Suggested Build Order

1. Exercise-scoped timeline query and UI selector.
2. Date/time controls, search, and MSEL status/category filters.
3. Rich detail drawer with related artifacts.
4. MSEL-native fields and role-aware controller/evaluator/player views.
5. AAR flagging and evaluator observation capture.
6. Related-activity grouping by inject/event.
7. Live mode: current-time marker, auto-refresh, and release/hold/skip controls.
8. Replay mode and planned-vs-actual timing comparison.
9. Map correlation and location-linked timeline items.
10. Export, audit, and end-to-end regression tests.
