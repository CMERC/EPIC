<template>
  <section class="learn-page">
    <div class="learn-header">
      <div>
        <p class="overline">EPIC Learn</p>
        <h1>Epic Ready operator curriculum</h1>
        <p class="summary">
          Work through guided courses for every active EPIC Ready application. Each lesson includes what to look for,
          how to use the app, a realistic example, and a short practice task.
        </p>
      </div>
      <div class="readiness-panel">
        <span class="readiness-label">Overall Progress</span>
        <strong>{{ overallProgress }}%</strong>
        <progress class="progress is-primary"
                  :value="overallProgress"
                  max="100">
          {{ overallProgress }}%
        </progress>
      </div>
    </div>

    <section class="module-overview"
             aria-label="Learning modules">
      <router-link v-for="course in courses"
                   :key="`module-${course.id}`"
                   class="module-card"
                   :class="{ active: course.id === selectedCourse.id }"
                   tag="button"
                   :to="courseStartRoute(course)">
        <span class="module-icon">
          <i :class="courseIcon(course.id)"></i>
        </span>
        <span class="module-copy">
          <strong>{{ course.title }}</strong>
          <small>{{ course.description }}</small>
        </span>
        <span class="module-progress">{{ courseProgress(course.id) }}%</span>
      </router-link>
    </section>

    <div class="learn-layout">
      <aside class="course-list"
             aria-label="Courses">
        <router-link v-for="course in courses"
                     :key="course.id"
                     class="course-button"
                     :class="{ active: course.id === selectedCourse.id }"
                     tag="button"
                     :to="courseStartRoute(course)">
          <span>
            <strong>{{ course.title }}</strong>
            <small>{{ course.duration }} min - {{ course.level }}</small>
          </span>
          <small class="course-action">Open guided tour</small>
          <span class="tag"
                :class="courseProgress(course.id) === 100 ? 'is-success' : 'is-light'">
            {{ courseProgress(course.id) }}%
          </span>
        </router-link>
      </aside>

      <main class="course-workspace">
        <div class="course-heading">
          <div>
            <p class="overline">{{ selectedCourse.level }} Course</p>
            <h2>{{ selectedCourse.title }}</h2>
            <p>{{ selectedCourse.description }}</p>
          </div>
          <button class="button is-light"
                  type="button"
                  @click="resetCourse(selectedCourse.id)">
            <span class="icon is-small">
              <i class="fas fa-redo"></i>
            </span>
            <span>Reset</span>
          </button>
        </div>

        <section class="tour-banner">
          <div>
            <p class="overline">Guided Tour Path</p>
            <h3>{{ selectedCourse.title }}</h3>
            <p>{{ courseTourSummary }}</p>
          </div>
          <div class="tour-steps">
            <span v-for="step in courseTourSteps"
                  :key="step"
                  class="tour-step">{{ step }}</span>
          </div>
        </section>

        <div class="columns is-variable is-4">
          <div class="column is-4">
            <section class="panel-blocks">
              <h3>Lessons</h3>
              <button v-for="lesson in selectedCourse.lessons"
                      :key="lesson.id"
                      class="lesson-row"
                      :class="{ active: lesson.id === activeLesson.id }"
                      type="button"
                      @click="selectLesson(lesson.id)">
                <input type="checkbox"
                       :checked="isLessonComplete(selectedCourse.id, lesson.id)"
                       @click.stop
                       @change="toggleLesson(selectedCourse.id, lesson.id)">
                <span>
                  <strong>{{ lesson.title }}</strong>
                  <small>{{ lesson.objective }}</small>
                </span>
              </button>
            </section>

            <section class="panel-blocks">
              <h3>Course Outcome</h3>
              <p class="muted">{{ selectedCourse.outcome }}</p>
            </section>
          </div>

          <div class="column is-5">
            <section class="panel-blocks lesson-reader">
              <div class="reader-title">
                <div>
                  <p class="overline">Lesson {{ activeLessonNumber }} of {{ selectedCourse.lessons.length }}</p>
                  <h3>{{ activeLesson.title }}</h3>
                </div>
                <span class="tag"
                      :class="isLessonComplete(selectedCourse.id, activeLesson.id) ? 'is-success' : 'is-light'">
                  {{ isLessonComplete(selectedCourse.id, activeLesson.id) ? 'Complete' : 'In Progress' }}
                </span>
              </div>

              <p class="lesson-objective">{{ activeLesson.objective }}</p>

              <div class="lesson-section">
                <h4>What This Teaches</h4>
                <ul>
                  <li v-for="item in activeLesson.teaches"
                      :key="item">{{ item }}</li>
                </ul>
              </div>

              <div class="screenshot-example"
                   :class="activeLessonScreenshot.theme">
                <div class="screenshot-chrome">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div class="screenshot-body">
                  <div class="screenshot-sidebar">
                    <span v-for="item in activeLessonScreenshot.nav"
                          :key="item">{{ item }}</span>
                  </div>
                  <div class="screenshot-main">
                    <div class="screenshot-toolbar">
                      <strong>{{ activeLessonScreenshot.title }}</strong>
                      <small>{{ activeLessonScreenshot.route }}</small>
                    </div>
                    <div class="screenshot-canvas">
                      <span v-for="marker in activeLessonScreenshot.markers"
                            :key="marker.label"
                            class="screenshot-marker"
                            :style="{ left: marker.x, top: marker.y }">
                        <i :class="marker.icon"></i>
                        {{ marker.label }}
                      </span>
                    </div>
                  </div>
                </div>
                <p>{{ activeLessonScreenshot.caption }}</p>
              </div>

              <div class="lesson-section">
                <h4>Guided Walkthrough</h4>
                <ol>
                  <li v-for="step in activeLesson.walkthrough"
                      :key="step">{{ step }}</li>
                </ol>
              </div>

              <div class="example-box">
                <strong>Example</strong>
                <p>{{ activeLesson.example }}</p>
              </div>

              <div class="lesson-section">
                <h4>Try It</h4>
                <p>{{ activeLesson.practice }}</p>
              </div>

              <div class="lesson-section">
                <h4>Completion Evidence</h4>
                <p>{{ activeLesson.evidence }}</p>
              </div>

              <div class="reader-actions">
                <button class="button"
                        type="button"
                        :disabled="activeLessonIndex === 0"
                        @click="moveLesson(-1)">
                  Previous
                </button>
                <button class="button is-primary"
                        type="button"
                        @click="completeActiveLesson">
                  Mark Lesson Complete
                </button>
                <button class="button"
                        type="button"
                        :disabled="activeLessonIndex === selectedCourse.lessons.length - 1"
                        @click="moveLesson(1)">
                  Next
                </button>
              </div>
            </section>

            <section class="panel-blocks">
              <h3>Field Exercise</h3>
              <div class="exercise">
                <p>{{ selectedCourse.exercise }}</p>
                <textarea class="textarea"
                          rows="5"
                          :placeholder="selectedCourse.prompt"
                          v-model="courseState.notes"></textarea>
              </div>
            </section>
          </div>

          <div class="column">
            <section class="panel-blocks">
              <h3>Checkpoint Quiz</h3>
              <div v-for="question in selectedCourse.quiz"
                   :key="question.id"
                   class="quiz-question">
                <p>{{ question.prompt }}</p>
                <div class="buttons">
                  <button v-for="option in question.options"
                          :key="option"
                          class="button is-small"
                          :class="answerClass(question, option)"
                          type="button"
                          @click="answerQuestion(selectedCourse.id, question.id, option)">
                    {{ option }}
                  </button>
                </div>
                <small v-if="courseState.answers[question.id] === question.answer"
                       class="answer-note">Correct: {{ question.explain }}</small>
              </div>
              <div class="score-box">
                <span>Score</span>
                <strong>{{ courseScore(selectedCourse.id) }}%</strong>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  </section>
</template>

<script>
const STORAGE_KEY = 'epic.learn.progress'

function lesson(id, title, objective, teaches, walkthrough, example, practice, evidence) {
  return { id, title, objective, teaches, walkthrough, example, practice, evidence }
}

export default {
  name: 'learn-home',
  props: {
    courseId: String,
    lessonId: String
  },
  data() {
    return {
      selectedCourseId: 'workspace-orientation',
      progress: {},
      courses: [
        {
          id: 'workspace-orientation',
          title: 'Workspace Orientation',
          level: 'Foundational',
          duration: 30,
          description: 'Learn how EPIC Ready workspaces, roles, apps, and settings fit together before using the suite.',
          outcome: 'You can enter a workspace, identify which apps are available, explain role-based access, and prepare a new user to start work.',
          exercise: 'Create a workspace onboarding checklist for a new evaluator joining an exercise team.',
          prompt: 'Include login, workspace selection, launcher review, role check, app availability, and who to contact for missing access.',
          lessons: [
            lesson(
              'suite-map',
              'Understand the EPIC Ready suite',
              'Build a mental model of the suite and when each app is used.',
              [
                'Plan manages exercise design, objectives, participants, events, reports, and feedback.',
                'Media and Web create the training information environment and public-facing scenario content.',
                'Map, Chat, Email, Command, Observe, Notebook, Resources, Activity, Learn, Settings, and Developer support execution and administration.',
                'The launcher only shows apps that are active for the workspace and allowed by your role.'
              ],
              [
                'Open the app launcher from the navigation bar.',
                'Scan the apps in the first group and the all workspace apps group.',
                'Identify which apps are missing and decide whether the workspace setting or your role is the likely reason.',
                'Open Settings if you need to review app availability or user access.'
              ],
              'Before a tabletop exercise, a super user enables Plan, Media, Map, Chat, Email, Command, Resources, Learn, and Settings so the team can evaluate the full workflow.',
              'Open the launcher and list every visible app. For each visible app, write one sentence describing what you would use it for during an exercise.',
              'A complete app inventory with purpose, role assumptions, and missing-app follow-up notes.'
            ),
            lesson(
              'roles-access',
              'Roles and access',
              'Recognize how Super, Admin, Editor, and User roles shape what people can see and do.',
              [
                'Super users can reach privileged tools such as Learn, Resources, Observe, Developer, and workspace administration.',
                'Admins and editors usually work in operational apps such as Plan, Media, Map, Chat, and Notebook.',
                'Users may see a narrower workflow depending on workspace configuration.',
                'Access questions should be solved by checking both role and active app status.'
              ],
              [
                'Open Settings and review the current workspace members.',
                'Confirm the user role before assuming an app is broken.',
                'Review Workspace Apps to confirm whether the app is active.',
                'After a role or app change, refresh the launcher and verify the app appears.'
              ],
              'A planner who cannot see Map might have the correct login but lack the editor-level role required for that app in the launcher.',
              'Write a two-column access triage: one column for role checks and one for workspace app checks.',
              'A role/app triage note that someone else can follow without guessing.'
            ),
            lesson(
              'workspace-admin',
              'Workspace setup and readiness',
              'Prepare a workspace so the full evaluation team can use the same apps and defaults.',
              [
                'Workspace settings control active applications, timezone, members, and workspace-level preferences.',
                'The timezone affects event schedules, reports, and coordination.',
                'App activation should match the evaluation plan, not just personal preference.',
                'A pre-event readiness pass should happen before participants arrive.'
              ],
              [
                'Open Settings, then Workspace Settings.',
                'Review Workspace Apps and enable every app needed for the evaluation.',
                'Confirm the workspace timezone matches the exercise location or agreed control timezone.',
                'Check members and roles for planners, evaluators, inject controllers, and observers.'
              ],
              'A distributed team runs an exercise using Eastern time as the control timezone even though several operators are remote.',
              'Draft the workspace settings you would verify 24 hours before a live event.',
              'A pre-event workspace readiness checklist.'
            ),
            lesson(
              'workflow-loop',
              'End-to-end exercise loop',
              'Connect planning, execution, observation, communication, and reporting into one workflow.',
              [
                'Plan defines what success looks like.',
                'Media, Web, Email, Chat, Command, and Map create the operating picture and inject channels.',
                'Observe, Notebook, Activity, and Feedback capture what happened.',
                'Reports turn collected evidence into an after-action product.'
              ],
              [
                'Start with objectives and participants in Plan.',
                'Add scenario content and injects in Media, Web, Email, or Command.',
                'Use Map and Chat to support shared execution.',
                'Capture observations and feedback, then review reports.'
              ],
              'A communications exercise uses Plan for objectives, Media for social posts, Email for official traffic, Map for incident location, Chat for controllers, and Reports for outcomes.',
              'Choose a simple scenario and map which EPIC app owns each stage of work.',
              'A one-page workflow map from preparation through reporting.'
            )
          ],
          quiz: [
            {
              id: 'q1',
              prompt: 'What should you check when an expected app is missing from the launcher?',
              options: ['Workspace app status and user role', 'Browser zoom level', 'The note title'],
              answer: 'Workspace app status and user role',
              explain: 'The launcher depends on app activation and role permissions.'
            },
            {
              id: 'q2',
              prompt: 'Which app anchors objectives, participants, feedback, and reports?',
              options: ['Plan', 'Chat', 'Email'],
              answer: 'Plan',
              explain: 'Plan is the core exercise management application.'
            }
          ]
        },
        {
          id: 'plan-cycle',
          title: 'Plan: Exercise Management',
          level: 'Core Operator',
          duration: 45,
          description: 'Use Plan to build an exercise from scenario setup through evaluation products.',
          outcome: 'You can prepare a plan, add objectives and participants, run event workflow, collect feedback, and produce reports.',
          exercise: 'Design a small exercise plan with one participant group, two objectives, one event, and a feedback approach.',
          prompt: 'Include scenario purpose, participant type, objectives, inject owner, timeline event, expected observations, and report output.',
          lessons: [
            lesson(
              'plan-structure',
              'Plan structure',
              'Understand how Plan organizes exercise preparation and execution.',
              [
                'Plan is organized around preparation, training objectives, event execution, reporting, and exports.',
                'Settings lists such as organizations, command agencies, participant types, platforms, methods, reasons, boards, and status values support consistent data entry.',
                'Good plans start with clean reference data because reports depend on structured fields.',
                'Every training objective should have an owner, condition, standard, and measurable outcome.'
              ],
              [
                'Open Plan and scan the available sections.',
                'Review Plan Settings before creating new exercise records.',
                'Confirm organizations, participant types, platforms, and methods are available.',
                'Create or update only the reference values needed for the exercise.'
              ],
              'A cyber response exercise adds a command agency, two organizations, a cyber platform, and an evaluation method before writing objectives.',
              'Identify which Plan settings would be required for an air, ground, or cyber exercise.',
              'A list of reference data needed before planners begin data entry.'
            ),
            lesson(
              'participants-objectives',
              'Participants and objectives',
              'Build participants and training objectives that evaluators can score.',
              [
                'Participants represent the units, teams, or roles being evaluated.',
                'Training objectives describe tasks, conditions, standards, measures, and qualifications.',
                'Objectives should be specific enough that feedback can prove whether the standard was met.',
                'JMETs and priority fields help align local events to larger training priorities.'
              ],
              [
                'Open Prepare, then Participants.',
                'Create or review a participant and confirm participant type and platform.',
                'Add training objectives with task, condition, standard, and measures.',
                'Check that every objective can be observed during an event.'
              ],
              'For a logistics objective, the standard might require the team to produce a route status update within 15 minutes of receiving an inject.',
              'Write two measurable objectives for a scenario of your choice.',
              'Two objectives with participant, task, condition, standard, and evaluation measure.'
            ),
            lesson(
              'events-injects',
              'Events, injects, and control flow',
              'Use Plan to coordinate what happens during execution.',
              [
                'Events should tie scenario actions to training objectives.',
                'Inject owners clarify who is responsible for delivering scenario stimuli.',
                'Status and priority fields help controllers triage execution work.',
                'Plan should be synchronized with Media, Email, Command, Map, and Chat when those apps deliver injects.'
              ],
              [
                'Open the event or training section that contains exercise execution items.',
                'Confirm each event has timing, owner, objective linkage, and expected participant action.',
                'Use status fields to track preparation and live execution.',
                'Keep controller notes precise so evaluators understand what changed.'
              ],
              'A weather closure inject is owned by the control cell, delivered by Email, discussed in Chat, and reflected on Map with an affected area overlay.',
              'Draft one inject with owner, delivery channel, expected action, and linked objective.',
              'A ready-to-run inject record with measurable expected response.'
            ),
            lesson(
              'feedback-reports',
              'Feedback and reporting',
              'Turn observations into useful reports and after-action material.',
              [
                'Feedback captures objective performance, lessons learned, measures, and narrative evidence.',
                'Reports summarize completion, trends, and readiness outcomes.',
                'Exports provide portable data for stakeholders outside EPIC.',
                'Quality reports depend on concise, timely, evidence-based feedback.'
              ],
              [
                'Open a feedback workflow from Web or Plan, depending on the evaluation path.',
                'Record objective status, measures, comments, and lessons learned.',
                'Review report dashboards for missing or inconsistent data.',
                'Export reports after validating the source feedback.'
              ],
              'An evaluator records that a team met the response-time standard but missed one required notification, then adds a lesson learned for the after-action review.',
              'Write a sample feedback entry for one objective, including one lesson learned.',
              'A feedback note that can be used directly in a report.'
            )
          ],
          quiz: [
            {
              id: 'q1',
              prompt: 'What makes a training objective useful for evaluation?',
              options: ['A measurable standard', 'A longer name', 'A hidden status'],
              answer: 'A measurable standard',
              explain: 'Evaluators need observable standards and evidence.'
            },
            {
              id: 'q2',
              prompt: 'Why review Plan settings before building an exercise?',
              options: ['Reference data improves consistency', 'It changes the map provider', 'It clears browser storage'],
              answer: 'Reference data improves consistency',
              explain: 'Structured settings drive cleaner entries and reports.'
            }
          ]
        },
        {
          id: 'media-web',
          title: 'Media and Web: Information Environment',
          level: 'Applied',
          duration: 40,
          description: 'Build scenario content, personas, posts, and web-facing material that support controlled training injects.',
          outcome: 'You can create believable personas, prepare posts, monitor service dashboards, and connect media activity to evaluation goals.',
          exercise: 'Outline a three-inject information environment sequence for a public response scenario.',
          prompt: 'Include persona, platform/service, timing, post purpose, participant signal, and evaluator cue.',
          lessons: [
            lesson(
              'personas-profiles',
              'Personas and profiles',
              'Create personas that make scenario content believable and controllable.',
              [
                'Personas should have a clear role, tone, source credibility, and scenario purpose.',
                'Profiles and avatars help participants distinguish official, public, and adversarial voices.',
                'A persona should exist because it supports an objective, not because it adds noise.',
                'Consistency matters across posts, comments, and web content.'
              ],
              [
                'Open Media, then review Personas or Profiles.',
                'Create or inspect a persona name, description, avatar, and role.',
                'Map the persona to a scenario purpose and participant response.',
                'Avoid creating duplicate personas for the same role.'
              ],
              'A local emergency office persona posts official closure guidance while a community account posts eyewitness reports.',
              'Design two personas for the same scenario: one official and one public-facing.',
              'Two persona briefs with role, tone, channel, and evaluation purpose.'
            ),
            lesson(
              'posts-services',
              'Posts and services',
              'Prepare social-style injects with timing, content, and intended effect.',
              [
                'Posts should have source, channel, message, timing, and expected participant action.',
                'Service dashboards help operators inspect content by platform or service.',
                'Inject timing should align with Plan events and controller rhythm.',
                'Media content is strongest when linked to a concrete evaluation signal.'
              ],
              [
                'Open Media posts for the selected service.',
                'Review source persona, content, attachments, and target timing.',
                'Confirm whether the post is informational, misleading, escalation, or confirmation content.',
                'Coordinate publish timing with the Plan event or controller note.'
              ],
              'A simulated news account posts a bridge closure image five minutes before the logistics team must reroute supplies.',
              'Draft a post with source, message, attachment idea, timing, and expected participant response.',
              'A complete media post plan that can be reviewed by controllers.'
            ),
            lesson(
              'web-content',
              'Web pages and public content',
              'Use the Web app to review scenario-facing pages and participant-visible content.',
              [
                'Web provides a route for public-style content in the exercise environment.',
                'News, dashboards, profiles, and feedback pages can support scenario realism.',
                'Content should be clear enough for participants to act on without out-of-band explanation.',
                'Feedback routes can collect participant or evaluator responses.'
              ],
              [
                'Open the Web app from the launcher.',
                'Review news, profiles, dashboards, and feedback routes available in the workspace.',
                'Check that links, titles, and body content match the exercise scenario.',
                'Coordinate Web content with Media and Plan timing.'
              ],
              'A public web page summarizes power restoration status while social posts amplify reports from affected neighborhoods.',
              'Write the headline and summary for one scenario web article and identify which objective it supports.',
              'A web content brief tied to a training objective.'
            ),
            lesson(
              'evaluation-signals',
              'Evaluation signals',
              'Make information injects measurable instead of decorative.',
              [
                'Every content item should have an expected participant behavior.',
                'Evaluation signals can include acknowledgement, decision, escalation, correction, route change, or public message.',
                'Controllers need to know when to publish and what to watch for after publishing.',
                'Reports are stronger when media activity is linked back to objectives.'
              ],
              [
                'Pick one media or web inject.',
                'Define the expected participant action in plain language.',
                'Decide how the action will be observed and recorded.',
                'Add the signal to the controller notes or Plan event.'
              ],
              'A false rumor inject is successful only if participants identify it, correct it, and notify the right coordination channel.',
              'Convert one vague inject into a measurable inject with expected response and evidence.',
              'A measurable inject statement ready for evaluation.'
            )
          ],
          quiz: [
            {
              id: 'q1',
              prompt: 'What makes a persona useful?',
              options: ['A clear role tied to the scenario', 'A random avatar', 'A long username'],
              answer: 'A clear role tied to the scenario',
              explain: 'Personas should support realistic, measurable scenario behavior.'
            },
            {
              id: 'q2',
              prompt: 'What should every media inject define?',
              options: ['Expected participant response', 'Browser cache size', 'Database password'],
              answer: 'Expected participant response',
              explain: 'The expected response makes the inject evaluable.'
            }
          ]
        },
        {
          id: 'map-situational-awareness',
          title: 'Map Readiness',
          level: 'Operational',
          duration: 40,
          description: 'Use Map and Globe views to validate base maps, overlays, symbols, and geospatial handoffs.',
          outcome: 'You can confirm the map is connected, inspect layers, use tactical symbols, and prepare a fallback map workflow.',
          exercise: 'Draft a map pre-check and operator handoff for a live evaluation.',
          prompt: 'Include base map, globe/map view, KML or GeoJSON overlays, symbols, expected location, and fallback steps.',
          lessons: [
            lesson(
              'basemap-health',
              'Base map health',
              'Confirm map and globe base layers are available before the event starts.',
              [
                'Blank maps usually indicate provider connectivity, asset loading, or layer visibility issues.',
                'The 2D map and globe can have different rendering paths, so validate both when both are used.',
                'A pre-check should happen on the same network the operators will use.',
                'Fallback instructions prevent operators from losing time during a live event.'
              ],
              [
                'Open Map and confirm the 2D view renders streets or imagery.',
                'Open Globe and confirm Cesium assets and imagery render.',
                'Zoom to the exercise area and confirm labels or imagery are readable.',
                'Record any provider or network errors before participants arrive.'
              ],
              'A controller validates the base map from the exercise floor network and keeps a screenshot of the expected operating area.',
              'Create a four-step map health checklist for the current workspace.',
              'A checklist that distinguishes 2D map, globe, provider, and network checks.'
            ),
            lesson(
              'layers-overlays',
              'Layers and overlays',
              'Review KML, GeoJSON, COP layers, and workspace overlays for currency and visibility.',
              [
                'Layers provide exercise-specific context that the base map does not contain.',
                'KML and GeoJSON are common exchange formats for boundaries, routes, and points.',
                'Visibility, styling, and zoom level affect whether operators can see the layer.',
                'Layer names should be meaningful enough for handoff.'
              ],
              [
                'Open the layer or COP map controls.',
                'Toggle each layer and verify that it appears in the expected location.',
                'Check names, timestamps, colors, and symbol clarity.',
                'Remove or hide stale layers that could confuse operators.'
              ],
              'A flood boundary GeoJSON layer is loaded with road closure points and a logistics route overlay.',
              'List three overlays your scenario needs and what each one should show.',
              'A layer inventory with source, purpose, and visual check result.'
            ),
            lesson(
              'symbols-annotations',
              'Symbols and annotations',
              'Use map symbols and annotations to communicate operational meaning quickly.',
              [
                'Military or operational symbols should be recognizable and consistently labeled.',
                'Annotations should explain what changed, when, and who owns the item.',
                'Symbols can clutter the map if they are not grouped by purpose.',
                'Map content should support decisions, not become a second report system.'
              ],
              [
                'Open the symbol generator or map edit tools.',
                'Create or review symbols needed for units, incidents, routes, or facilities.',
                'Confirm colors, labels, and locations match the scenario.',
                'Keep annotation text short and action-oriented.'
              ],
              'A damaged bridge point, staging area, and alternate route are labeled so the logistics cell can quickly understand the change.',
              'Create a symbol plan for three map items and note what each symbol means.',
              'A symbol legend that another operator can read without explanation.'
            ),
            lesson(
              'map-handoff',
              'Map operator handoff',
              'Prepare another operator to continue map work without losing context.',
              [
                'Handoffs should include active view, selected layers, known issues, and current task.',
                'Operators need to know which layers are authoritative and which are exercise artifacts.',
                'Map handoffs should include fallback options for provider or network failures.',
                'A concise handoff reduces mistakes during controller shifts.'
              ],
              [
                'Document current map view, zoom/location, active layers, and important symbols.',
                'Identify stale or hidden layers that the next operator should ignore.',
                'Record provider status and any observed rendering issues.',
                'Share the next expected map action from the exercise timeline.'
              ],
              'During shift change, the outgoing operator notes that the route overlay is authoritative, the weather boundary is pending update, and the globe view is for briefing only.',
              'Write a map handoff for the current Map or Globe view.',
              'A concise operator handoff with active layers, issues, and next action.'
            )
          ],
          quiz: [
            {
              id: 'q1',
              prompt: 'What should be checked first when the map is blank?',
              options: ['Base map/provider connectivity', 'Email subject lines', 'User avatar color'],
              answer: 'Base map/provider connectivity',
              explain: 'Blank maps are usually a provider, network, asset, or visibility problem.'
            },
            {
              id: 'q2',
              prompt: 'Which formats are common for exchanging overlays?',
              options: ['KML and GeoJSON', 'SMTP and IMAP', 'CSV and JWT only'],
              answer: 'KML and GeoJSON',
              explain: 'KML and GeoJSON are common geospatial formats.'
            }
          ]
        },
        {
          id: 'communications',
          title: 'Chat, Email, and Command',
          level: 'Operational',
          duration: 40,
          description: 'Coordinate exercise traffic across internal chat, simulated email, and command channels.',
          outcome: 'You can choose the right communication app, create clear traffic, and preserve evidence for evaluation.',
          exercise: 'Design a communications plan for one inject that uses Chat, Email, and Command appropriately.',
          prompt: 'Include internal coordination, participant-facing message, command artifact, expected response, and evidence to capture.',
          lessons: [
            lesson(
              'chat-coordination',
              'Chat for controller coordination',
              'Use Chat for fast internal coordination without confusing participant-facing traffic.',
              [
                'Chat is best for control cell coordination, quick status, and handoff notes.',
                'Separate channels or rooms reduce noise during live execution.',
                'Keep chat messages short, timestamp-aware, and tied to the current inject or issue.',
                'Do not rely on chat alone for formal exercise artifacts.'
              ],
              [
                'Open Chat and identify available rooms.',
                'Use the room that matches the team or event purpose.',
                'Post concise updates with enough context for another operator.',
                'Move formal decisions or participant traffic to the correct app.'
              ],
              'The media controller tells the evaluation lead in Chat that a post is ready and asks for permission to publish at the planned time.',
              'Write three chat updates: ready, delayed, and completed for the same inject.',
              'Three clear chat messages that support controller coordination.'
            ),
            lesson(
              'email-traffic',
              'Email for simulated official traffic',
              'Use Email when the scenario requires formal messages, inbox behavior, or participant-facing records.',
              [
                'Email supports realistic official correspondence and message trails.',
                'Subjects should state purpose, urgency, and scenario context.',
                'Messages should tell recipients what action is required.',
                'Email injects should align with Plan events and feedback expectations.'
              ],
              [
                'Open Email and review inbox, sent, and compose views.',
                'Draft a message with recipient, subject, body, and expected action.',
                'Confirm timing and sender role before sending.',
                'After delivery, capture whether participants noticed and acted.'
              ],
              'A logistics coordinator receives an official route closure notice and must acknowledge it before updating movement plans.',
              'Draft one official email inject with subject, sender, recipient, body, and expected response.',
              'A complete email inject draft tied to a measurable response.'
            ),
            lesson(
              'command-traffic',
              'Command for operational direction',
              'Use Command for higher-level direction, tasks, and operational control artifacts.',
              [
                'Command content should be authoritative, concise, and action-oriented.',
                'Command is useful for directing operational tempo or publishing control guidance.',
                'Use Command when traffic should feel like official command-level direction.',
                'Command artifacts should be coordinated with Plan objectives and reports.'
              ],
              [
                'Open Command and review the available dashboard or home view.',
                'Identify what command-level message or task the scenario needs.',
                'Write the direction in plain operational language.',
                'Define how evaluators will know the direction was followed.'
              ],
              'A command message directs teams to shift staging operations to a backup site after map and email injects establish the reason.',
              'Write one command-level directive for a scenario change.',
              'A command directive with owner, timing, and expected evidence.'
            ),
            lesson(
              'communication-evidence',
              'Communication evidence',
              'Capture communication outcomes so reports can explain what happened.',
              [
                'Evidence can include message timestamps, acknowledgements, decisions, and follow-up actions.',
                'The right evidence proves whether participants received, understood, and acted on traffic.',
                'Summaries should preserve enough context without copying every message.',
                'Feedback should reference the channel and artifact used.'
              ],
              [
                'For one communication inject, identify the channel and artifact.',
                'Record when it was delivered and who received it.',
                'Capture the participant response or lack of response.',
                'Add the result to feedback or report notes.'
              ],
              'An evaluator notes that the team acknowledged the email in six minutes, but did not update the map route until prompted.',
              'Build an evidence note for a communication inject.',
              'A feedback-ready evidence note with channel, time, action, and result.'
            )
          ],
          quiz: [
            {
              id: 'q1',
              prompt: 'Which app is best for quick internal controller coordination?',
              options: ['Chat', 'Map', 'Resources'],
              answer: 'Chat',
              explain: 'Chat is intended for fast coordination between operators.'
            },
            {
              id: 'q2',
              prompt: 'What should a formal email inject include?',
              options: ['Required action and recipient context', 'Only an attachment name', 'A hidden map layer'],
              answer: 'Required action and recipient context',
              explain: 'Participants need to understand what they must do and why.'
            }
          ]
        },
        {
          id: 'observe-activity-notebook',
          title: 'Observe, Activity, and Notebook',
          level: 'Evaluator',
          duration: 35,
          description: 'Capture observations, maintain working notes, and understand activity streams during execution.',
          outcome: 'You can collect useful observation evidence, keep notebook entries organized, and use activity context for review.',
          exercise: 'Create an evaluator note package for one scenario event.',
          prompt: 'Include observed behavior, timestamp, related inject, notebook entry, activity cue, and feedback implication.',
          lessons: [
            lesson(
              'observe-workflow',
              'Observe workflow',
              'Use observation workflows to capture what participants actually did.',
              [
                'Observations should be timely, factual, and tied to objectives.',
                'Good observation notes separate facts from interpretation.',
                'Observers should capture enough context for someone reviewing later.',
                'Observation evidence improves feedback and reports.'
              ],
              [
                'Open Observe if it is active for your role and workspace.',
                'Identify the event or objective being observed.',
                'Record what happened, when it happened, and who was involved.',
                'Link or summarize related communications, map changes, or media content.'
              ],
              'An observer notes that the logistics team rerouted after the second prompt, not after the initial closure notice.',
              'Write an observation note with time, actor, action, and objective linkage.',
              'A factual observation note ready for evaluator review.'
            ),
            lesson(
              'notebook-discipline',
              'Notebook discipline',
              'Use Notebook for structured working notes without mixing them into official reports too early.',
              [
                'Notebook is useful for rough observations, reminders, controller notes, and shift handoffs.',
                'Notes should have descriptive titles and enough context to find later.',
                'Important notes should be promoted into feedback or reports when validated.',
                'Avoid using Notebook as the only home for critical evidence.'
              ],
              [
                'Open Notebook and review existing note organization.',
                'Create a note title that includes event or inject context.',
                'Write concise bullets with timestamps where useful.',
                'Flag items that should become formal feedback.'
              ],
              'A controller note captures that the third media inject was delayed by ten minutes and why that changed expected participant behavior.',
              'Draft a notebook entry for a delayed inject and include the reporting follow-up.',
              'A notebook note with title, context, and follow-up decision.'
            ),
            lesson(
              'activity-stream',
              'Activity stream review',
              'Use Activity to understand recent workspace actions and event context.',
              [
                'Activity streams help reconstruct what changed and when.',
                'Activity is especially useful after shift changes or unexpected behavior.',
                'Use activity context to ask better questions, not as the only source of truth.',
                'Cross-check activity with Plan, feedback, and app-specific records.'
              ],
              [
                'Open Activity and scan recent workspace actions.',
                'Look for changes related to the event, inject, or app you are reviewing.',
                'Compare the activity timeline with operator notes.',
                'Use differences to guide follow-up questions.'
              ],
              'After a missed response, an evaluator checks Activity and sees the relevant post was created but not published at the expected time.',
              'Write three activity stream questions you would ask during an after-action review.',
              'A short activity review note with follow-up questions.'
            )
          ],
          quiz: [
            {
              id: 'q1',
              prompt: 'What should observation notes prioritize?',
              options: ['Facts tied to objectives', 'Decorative wording', 'Unverified assumptions only'],
              answer: 'Facts tied to objectives',
              explain: 'Useful observations are factual, timely, and connected to objectives.'
            },
            {
              id: 'q2',
              prompt: 'What is Activity best used for?',
              options: ['Reconstructing recent workspace context', 'Drawing map symbols', 'Changing passwords'],
              answer: 'Reconstructing recent workspace context',
              explain: 'Activity helps operators understand what changed and when.'
            }
          ]
        },
        {
          id: 'resources-learn-admin',
          title: 'Resources, Learn, Settings, and Developer',
          level: 'Administrator',
          duration: 35,
          description: 'Maintain knowledge, reference material, workspace configuration, and developer-level workspace support.',
          outcome: 'You can keep reference material usable, guide users through Learn, manage workspace settings, and understand when Developer tools are appropriate.',
          exercise: 'Write an admin support plan for keeping a workspace evaluation-ready.',
          prompt: 'Include resources, learning path, settings checks, app activation, member support, and developer escalation boundaries.',
          lessons: [
            lesson(
              'resources-library',
              'Resources library',
              'Use Resources to centralize reference material that operators need during an exercise.',
              [
                'Resources should contain approved, current, and clearly named material.',
                'Reference material should support scenario execution, not bury users in unrelated files.',
                'Operators need to know whether a resource is authoritative, draft, or background.',
                'Resource hygiene prevents confusion during live events.'
              ],
              [
                'Open Resources and review the available materials.',
                'Check titles, descriptions, and relevance to the current workspace.',
                'Remove stale or duplicate material from the evaluation workflow.',
                'Point users to the exact resource they need in the exercise plan or chat.'
              ],
              'A controller adds the approved communications playbook and labels it as authoritative for the exercise.',
              'List five resources a new operator would need and label each as authoritative, reference, or draft.',
              'A curated resource list with status and purpose.'
            ),
            lesson(
              'learn-path',
              'Using Learn as an onboarding path',
              'Turn the Learn app into a repeatable readiness path for new users.',
              [
                'Learn tracks local progress and helps users practice before live events.',
                'Course exercises should produce artifacts that supervisors can review.',
                'Operators should complete workspace, Plan, Map, and communications courses before live support.',
                'Specialty courses can be assigned by role.'
              ],
              [
                'Open Learn and review course progress.',
                'Assign foundational courses to every new user.',
                'Assign app-specific courses based on operational role.',
                'Review field exercise notes during onboarding or rehearsal.'
              ],
              'A new media controller completes Workspace Orientation, Media and Web, Communications, and Observation courses before joining the live control cell.',
              'Create a course assignment plan for planner, media controller, map operator, and evaluator roles.',
              'A role-based learning path for the evaluation team.'
            ),
            lesson(
              'settings-operations',
              'Settings operations',
              'Use Settings to keep users, apps, timezone, and reference settings aligned.',
              [
                'Settings is the control point for workspace access and active app configuration.',
                'Plan, media, and general settings influence how data appears across the suite.',
                'Changes should be intentional and documented before live execution.',
                'Settings problems often appear as missing apps, wrong times, or unavailable reference values.'
              ],
              [
                'Open Settings and review general, workspace, Plan, and media settings.',
                'Confirm app activation and member roles.',
                'Check timezone and reference values before a rehearsal.',
                'Document any setting changed during the event window.'
              ],
              'An admin enables Email and Command for a workspace after confirming the exercise plan requires both channels.',
              'Write a settings audit checklist for the day before an exercise.',
              'A settings audit checklist with owner and verification notes.'
            ),
            lesson(
              'developer-support',
              'Developer support boundaries',
              'Understand when Developer tools are useful and when to escalate technical issues.',
              [
                'Developer views can help inspect users and workspaces when normal settings are not enough.',
                'Developer tools should be limited to trusted super users.',
                'Use Developer support for configuration diagnosis, not routine exercise operations.',
                'Record what was changed so the workspace can be reproduced later.'
              ],
              [
                'Open Developer only when your role and task require it.',
                'Inspect workspace or user state relevant to the issue.',
                'Prefer Settings for normal configuration changes.',
                'Escalate code, database, or deployment issues to technical maintainers.'
              ],
              'A super user uses Developer to inspect a workspace record after an app remains hidden despite being active in Settings.',
              'Describe one situation that belongs in Settings and one that belongs in Developer.',
              'A support decision note with normal admin path and escalation path.'
            )
          ],
          quiz: [
            {
              id: 'q1',
              prompt: 'What should Resources contain?',
              options: ['Approved, current reference material', 'Every draft ever made', 'Only screenshots'],
              answer: 'Approved, current reference material',
              explain: 'Resources are most useful when they are curated and reliable.'
            },
            {
              id: 'q2',
              prompt: 'When should Developer tools be used?',
              options: ['For trusted support and diagnosis', 'For routine note taking', 'For writing media posts'],
              answer: 'For trusted support and diagnosis',
              explain: 'Developer views are privileged support tools.'
            }
          ]
        },
        {
          id: 'capstone',
          title: 'Capstone: Run a Mini Exercise',
          level: 'Certification',
          duration: 60,
          description: 'Combine the suite into one realistic exercise rehearsal from setup through reporting.',
          outcome: 'You can independently prepare, run, observe, and review a small EPIC Ready exercise.',
          exercise: 'Build a mini exercise package that uses at least five EPIC apps and produces a feedback-ready result.',
          prompt: 'Include workspace setup, objective, participant, injects, communications, map context, observations, feedback, and report notes.',
          lessons: [
            lesson(
              'scenario-design',
              'Design the scenario',
              'Create a small scenario with clear scope, objective, and evaluation pathway.',
              [
                'Capstone scenarios should be small enough to complete but realistic enough to test workflow.',
                'A scenario needs participants, objectives, injects, expected responses, and evidence.',
                'Use Plan as the anchor for the capstone.',
                'Choose apps because they support the objective.'
              ],
              [
                'Define the scenario in two or three sentences.',
                'Create one participant group and one measurable objective.',
                'Choose at least five apps that support the workflow.',
                'Write the expected final report finding.'
              ],
              'A regional storm scenario tests whether a logistics team can reroute supplies after receiving map, email, and media updates.',
              'Write the capstone scenario, objective, participant group, apps, and expected report finding.',
              'A concise capstone scenario brief.'
            ),
            lesson(
              'build-rehearsal',
              'Build and rehearse',
              'Prepare all app artifacts before running the scenario.',
              [
                'Rehearsal catches missing apps, broken map layers, unclear messages, and weak objectives.',
                'Artifacts should be ready before participants begin.',
                'Controllers should know the order of events and who owns each step.',
                'A rehearsal should validate the whole chain, not just individual screens.'
              ],
              [
                'Enable required apps and confirm roles.',
                'Create or draft Plan objective, media/web content, communication traffic, and map context.',
                'Run through the sequence without participants.',
                'Fix confusing timing, missing data, or unclear expected responses.'
              ],
              'The team rehearses a media post, email notice, map overlay, chat coordination, observation note, and feedback entry before going live.',
              'Create a rehearsal checklist covering every app in your capstone.',
              'A rehearsal checklist with pass/fail notes.'
            ),
            lesson(
              'execute-observe',
              'Execute and observe',
              'Run the mini exercise while preserving enough evidence for review.',
              [
                'Execution should follow the planned sequence but capture real participant behavior.',
                'Controllers coordinate internally while participants receive only scenario-appropriate traffic.',
                'Observers capture facts, timing, and evidence.',
                'Unexpected behavior should be recorded instead of erased.'
              ],
              [
                'Start the scenario and deliver the first inject.',
                'Use Chat for controller updates and the chosen participant channels for scenario traffic.',
                'Watch map, media, email, command, and participant responses.',
                'Capture observations and evidence as the scenario unfolds.'
              ],
              'Participants respond to an official email but miss the social-media cue; the observer records both the success and the gap.',
              'Run or simulate the capstone sequence and record the result of each inject.',
              'An execution log with timestamps, actions, and observed outcomes.'
            ),
            lesson(
              'review-report',
              'Review and report',
              'Convert capstone evidence into feedback and an after-action summary.',
              [
                'Reports should answer whether the objective was met and why.',
                'Feedback should include evidence, lessons learned, and recommended improvement.',
                'Activity and app records can help validate timing.',
                'The final review should identify both app workflow issues and participant performance issues.'
              ],
              [
                'Review Plan objectives, observations, communication artifacts, media/web items, and map context.',
                'Write feedback with evidence and a lesson learned.',
                'Summarize what worked, what failed, and what to change before a larger exercise.',
                'Export or present the report notes.'
              ],
              'The capstone report states that the team met the reroute objective after the second inject, but needs earlier monitoring of public information channels.',
              'Write the capstone feedback and after-action summary.',
              'A final capstone review with objective status, evidence, lesson learned, and next action.'
            )
          ],
          quiz: [
            {
              id: 'q1',
              prompt: 'What should anchor the capstone workflow?',
              options: ['A measurable Plan objective', 'A random chat message', 'A hidden setting'],
              answer: 'A measurable Plan objective',
              explain: 'The capstone should prove a defined training objective.'
            },
            {
              id: 'q2',
              prompt: 'What should the final review explain?',
              options: ['Whether the objective was met and why', 'Only which browser was used', 'Only who logged in first'],
              answer: 'Whether the objective was met and why',
              explain: 'After-action review must connect performance to evidence.'
            }
          ]
        }
      ]
    }
  },
  computed: {
    selectedCourse() {
      return this.courses.find(course => course.id === this.selectedCourseId) || this.courses[0]
    },
    courseState() {
      return this.ensureCourseState(this.selectedCourse.id)
    },
    activeLesson() {
      return this.selectedCourse.lessons.find(lesson => lesson.id === this.courseState.activeLessonId) || this.selectedCourse.lessons[0]
    },
    activeLessonIndex() {
      return this.selectedCourse.lessons.findIndex(lesson => lesson.id === this.activeLesson.id)
    },
    activeLessonNumber() {
      return this.activeLessonIndex + 1
    },
    courseTourSteps() {
      const paths = {
        'workspace-orientation': ['Launcher', 'Settings', 'Workspace Apps', 'Roles'],
        'plan-cycle': ['Plan Settings', 'Participants', 'Objectives', 'Reports'],
        'media-web': ['Personas', 'Posts', 'Web Pages', 'Signals'],
        'map-situational-awareness': ['Map', 'Globe', 'Layers', 'Handoff'],
        communications: ['Chat', 'Email', 'Command', 'Evidence'],
        'observe-activity-notebook': ['Observe', 'Notebook', 'Activity', 'Feedback'],
        'resources-learn-admin': ['Resources', 'Learn', 'Settings', 'Developer'],
        capstone: ['Setup', 'Rehearsal', 'Execute', 'Report']
      }
      return paths[this.selectedCourse.id] || this.selectedCourse.lessons.map(lesson => lesson.title)
    },
    courseTourSummary() {
      return `Follow the ${this.courseTourSteps.join(' to ')} path, then use the exercise and quiz to prove the workflow is ready.`
    },
    activeLessonScreenshot() {
      const screenshotMap = {
        'workspace-orientation': {
          theme: 'workspace-shot',
          title: 'Workspace launcher',
          route: '/workspace',
          nav: ['Apps', 'Settings', 'Roles'],
          caption: 'Example: confirm the active workspace, visible app launcher items, and access settings before sending a user into an exercise.',
          markers: [
            { label: 'Launcher', icon: 'fas fa-th', x: '12%', top: '18%' },
            { label: 'Role', icon: 'fas fa-user-shield', x: '58%', top: '28%' },
            { label: 'Active Apps', icon: 'fas fa-toggle-on', x: '38%', top: '68%' }
          ]
        },
        'plan-cycle': {
          theme: 'plan-shot',
          title: 'Plan objective board',
          route: '/plan',
          nav: ['Prepare', 'Objectives', 'Reports'],
          caption: 'Example: connect participants, objectives, events, feedback, and report outputs so the plan becomes the source of truth.',
          markers: [
            { label: 'Objective', icon: 'fas fa-bullseye', x: '20%', top: '24%' },
            { label: 'Inject', icon: 'fas fa-calendar-alt', x: '54%', top: '42%' },
            { label: 'Report', icon: 'fas fa-chart-bar', x: '35%', top: '72%' }
          ]
        },
        'media-web': {
          theme: 'media-shot',
          title: 'Information environment',
          route: '/media',
          nav: ['Personas', 'Posts', 'Web'],
          caption: 'Example: use personas, posts, and web pages as measurable scenario signals rather than standalone content.',
          markers: [
            { label: 'Persona', icon: 'fas fa-user-circle', x: '18%', top: '30%' },
            { label: 'Post', icon: 'fas fa-comment-alt', x: '48%', top: '22%' },
            { label: 'Signal', icon: 'fas fa-check-circle', x: '62%', top: '68%' }
          ]
        },
        'map-situational-awareness': {
          theme: 'map-shot',
          title: 'Map and globe readiness',
          route: '/map/globe',
          nav: ['Base Map', 'Layers', 'Symbols'],
          caption: 'Example: validate base map connectivity, layer visibility, symbol meaning, and the handoff view before an event.',
          markers: [
            { label: 'Base Map', icon: 'fas fa-map', x: '18%', top: '18%' },
            { label: 'Layer', icon: 'fas fa-layer-group', x: '52%', top: '38%' },
            { label: 'Symbol', icon: 'fas fa-map-marker-alt', x: '68%', top: '66%' }
          ]
        },
        communications: {
          theme: 'comms-shot',
          title: 'Communication channels',
          route: '/chat',
          nav: ['Chat', 'Email', 'Command'],
          caption: 'Example: choose the correct channel, deliver the inject, and capture acknowledgement or action as evidence.',
          markers: [
            { label: 'Channel', icon: 'fas fa-comments', x: '18%', top: '22%' },
            { label: 'Message', icon: 'fas fa-envelope', x: '50%', top: '36%' },
            { label: 'Action', icon: 'fas fa-reply', x: '42%', top: '72%' }
          ]
        },
        'observe-activity-notebook': {
          theme: 'observe-shot',
          title: 'Observation evidence',
          route: '/observe',
          nav: ['Observe', 'Notebook', 'Activity'],
          caption: 'Example: capture facts, working notes, and recent workspace activity before turning evidence into feedback.',
          markers: [
            { label: 'Fact', icon: 'fas fa-eye', x: '20%', top: '28%' },
            { label: 'Note', icon: 'fas fa-sticky-note', x: '54%', top: '26%' },
            { label: 'Timeline', icon: 'fas fa-stream', x: '44%', top: '68%' }
          ]
        },
        'resources-learn-admin': {
          theme: 'admin-shot',
          title: 'Admin readiness',
          route: '/settings',
          nav: ['Resources', 'Learn', 'Settings'],
          caption: 'Example: keep reference material, learning paths, app activation, and support boundaries clear for the whole workspace.',
          markers: [
            { label: 'Resource', icon: 'fas fa-book', x: '16%', top: '28%' },
            { label: 'Course', icon: 'fas fa-graduation-cap', x: '50%', top: '22%' },
            { label: 'Setting', icon: 'fas fa-cog', x: '58%', top: '68%' }
          ]
        },
        capstone: {
          theme: 'capstone-shot',
          title: 'Mini exercise flow',
          route: '/learn',
          nav: ['Setup', 'Run', 'Review'],
          caption: 'Example: rehearse a small workflow across apps, capture evidence, and produce an after-action result.',
          markers: [
            { label: 'Setup', icon: 'fas fa-sliders-h', x: '16%', top: '24%' },
            { label: 'Run', icon: 'fas fa-play-circle', x: '48%', top: '44%' },
            { label: 'Review', icon: 'fas fa-clipboard-check', x: '64%', top: '70%' }
          ]
        }
      }
      return screenshotMap[this.selectedCourse.id] || screenshotMap['workspace-orientation']
    },
    overallProgress() {
      const total = this.courses.reduce((sum, course) => sum + this.courseProgress(course.id), 0)
      return Math.round(total / this.courses.length)
    }
  },
  watch: {
    courseId() {
      this.syncRouteSelection()
    },
    lessonId() {
      this.syncRouteSelection()
    },
    progress: {
      deep: true,
      handler() {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress))
      }
    }
  },
  mounted() {
    try {
      this.progress = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {}
    } catch (error) {
      this.progress = {}
    }
    this.courses.forEach(course => this.ensureCourseState(course.id))
    this.syncRouteSelection()
  },
  methods: {
    courseIcon(courseId) {
      const icons = {
        'workspace-orientation': 'fas fa-th-large',
        'plan-cycle': 'fas fa-clipboard-list',
        'media-web': 'fas fa-broadcast-tower',
        'map-situational-awareness': 'fas fa-map-marked-alt',
        communications: 'fas fa-comments',
        'observe-activity-notebook': 'fas fa-eye',
        'resources-learn-admin': 'fas fa-cogs',
        capstone: 'fas fa-award'
      }
      return icons[courseId] || 'fas fa-graduation-cap'
    },
    courseStartRoute(course) {
      return {
        name: 'learn-course-lesson',
        params: {
          courseId: course.id,
          lessonId: course.lessons[0].id
        }
      }
    },
    syncRouteSelection() {
      const routeCourse = this.courses.find(course => course.id === this.courseId)
      if (!routeCourse) {
        return
      }
      this.selectedCourseId = routeCourse.id
      const state = this.ensureCourseState(routeCourse.id)
      const routeLesson = routeCourse.lessons.find(lesson => lesson.id === this.lessonId)
      this.$set(state, 'activeLessonId', routeLesson ? routeLesson.id : routeCourse.lessons[0].id)
    },
    selectCourse(courseId) {
      this.selectedCourseId = courseId
      this.ensureCourseState(courseId)
    },
    selectLesson(lessonId) {
      this.$set(this.courseState, 'activeLessonId', lessonId)
      if (this.courseId) {
        this.$router.push({
          name: 'learn-course-lesson',
          params: {
            courseId: this.selectedCourse.id,
            lessonId
          }
        })
      }
    },
    moveLesson(direction) {
      const nextIndex = this.activeLessonIndex + direction
      const nextLesson = this.selectedCourse.lessons[nextIndex]
      if (nextLesson) {
        this.selectLesson(nextLesson.id)
      }
    },
    completeActiveLesson() {
      if (!this.isLessonComplete(this.selectedCourse.id, this.activeLesson.id)) {
        this.toggleLesson(this.selectedCourse.id, this.activeLesson.id)
      }
      this.moveLesson(1)
    },
    ensureCourseState(courseId) {
      const course = this.courses.find(item => item.id === courseId)
      const validLessonIds = course.lessons.map(lesson => lesson.id)
      const validQuestionIds = course.quiz.map(question => question.id)
      if (!this.progress[courseId]) {
        this.$set(this.progress, courseId, {
          lessons: [],
          answers: {},
          notes: '',
          activeLessonId: course.lessons[0].id
        })
      }
      if (!this.progress[courseId].activeLessonId) {
        this.$set(this.progress[courseId], 'activeLessonId', course.lessons[0].id)
      }
      if (!validLessonIds.includes(this.progress[courseId].activeLessonId)) {
        this.$set(this.progress[courseId], 'activeLessonId', course.lessons[0].id)
      }
      const lessons = this.progress[courseId].lessons.filter(id => validLessonIds.includes(id))
      if (lessons.length !== this.progress[courseId].lessons.length) {
        this.$set(this.progress[courseId], 'lessons', lessons)
      }
      Object.keys(this.progress[courseId].answers).forEach(questionId => {
        if (!validQuestionIds.includes(questionId)) {
          this.$delete(this.progress[courseId].answers, questionId)
        }
      })
      return this.progress[courseId]
    },
    isLessonComplete(courseId, lessonId) {
      return this.ensureCourseState(courseId).lessons.includes(lessonId)
    },
    toggleLesson(courseId, lessonId) {
      const state = this.ensureCourseState(courseId)
      const nextLessons = state.lessons.includes(lessonId)
        ? state.lessons.filter(id => id !== lessonId)
        : state.lessons.concat(lessonId)
      this.$set(state, 'lessons', nextLessons)
    },
    answerQuestion(courseId, questionId, option) {
      const state = this.ensureCourseState(courseId)
      this.$set(state.answers, questionId, option)
    },
    answerClass(question, option) {
      const selected = this.courseState.answers[question.id]
      if (!selected || selected !== option) {
        return 'is-light'
      }
      return option === question.answer ? 'is-success' : 'is-danger'
    },
    courseScore(courseId) {
      const course = this.courses.find(item => item.id === courseId)
      const state = this.ensureCourseState(courseId)
      const correct = course.quiz.filter(question => state.answers[question.id] === question.answer).length
      return Math.round((correct / course.quiz.length) * 100)
    },
    courseProgress(courseId) {
      const course = this.courses.find(item => item.id === courseId)
      const state = this.ensureCourseState(courseId)
      const lessonUnits = state.lessons.length
      const quizUnits = course.quiz.filter(question => state.answers[question.id] === question.answer).length
      const noteUnit = state.notes.trim().length > 0 ? 1 : 0
      const totalUnits = course.lessons.length + course.quiz.length + 1
      return Math.round(((lessonUnits + quizUnits + noteUnit) / totalUnits) * 100)
    },
    resetCourse(courseId) {
      const course = this.courses.find(item => item.id === courseId)
      this.$set(this.progress, courseId, {
        lessons: [],
        answers: {},
        notes: '',
        activeLessonId: course.lessons[0].id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.learn-page {
  background: #f5f7f9;
  color: #1f2933;
  min-height: calc(100vh - 3.25rem);
  padding: 2rem;
}

.learn-header {
  align-items: stretch;
  display: grid;
  gap: 1.25rem;
  grid-template-columns: minmax(0, 1fr) 18rem;
  margin: 0 auto 1.5rem;
  max-width: 1320px;

  h1 {
    font-size: 2.15rem;
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: .5rem;
  }

  .summary {
    color: #52606d;
    max-width: 52rem;
  }
}

.overline {
  color: #0b7285;
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: 0;
  margin-bottom: .35rem;
  text-transform: uppercase;
}

.readiness-panel,
.panel-blocks {
  background: #ffffff;
  border: 1px solid #d9e2ec;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(16, 42, 67, .06);
}

.readiness-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;

  strong {
    font-size: 2rem;
  }

  .progress {
    margin-bottom: 0;
  }
}

.readiness-label {
  color: #627d98;
  font-size: .8rem;
  font-weight: 700;
}

.module-overview {
  display: grid;
  gap: .8rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 0 auto 1.25rem;
  max-width: 1320px;
}

.module-card {
  align-items: flex-start;
  background: #ffffff;
  border: 1px solid #d9e2ec;
  border-radius: 6px;
  color: #1f2933;
  cursor: pointer;
  display: grid;
  gap: .65rem;
  grid-template-columns: 2.4rem minmax(0, 1fr) auto;
  min-height: 8.6rem;
  padding: .9rem;
  text-align: left;
  width: 100%;

  &.active {
    border-color: #0b7285;
    box-shadow: inset 0 4px 0 #0b7285, 0 8px 18px rgba(16, 42, 67, .08);
  }

  &:hover {
    border-color: #829ab1;
  }
}

.module-icon {
  align-items: center;
  background: #e0f2f1;
  border-radius: 6px;
  color: #0b7285;
  display: inline-flex;
  height: 2.4rem;
  justify-content: center;
  width: 2.4rem;
}

.module-copy {
  min-width: 0;

  strong,
  small {
    display: block;
  }

  strong {
    line-height: 1.2;
    margin-bottom: .3rem;
  }

  small {
    color: #52606d;
    line-height: 1.35;
  }
}

.module-progress {
  color: #102a43;
  font-weight: 700;
}

.learn-layout {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: 18rem minmax(0, 1fr);
  margin: 0 auto;
  max-width: 1320px;
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: .65rem;
}

.course-button {
  align-items: center;
  background: #ffffff;
  border: 1px solid #d9e2ec;
  border-radius: 6px;
  color: #1f2933;
  cursor: pointer;
  display: flex;
  gap: .75rem;
  justify-content: space-between;
  min-height: 4.85rem;
  padding: .85rem;
  text-align: left;
  width: 100%;

  strong,
  small {
    display: block;
  }

  small {
    color: #627d98;
    margin-top: .2rem;
  }

  .course-action {
    color: #0b7285;
    flex: 0 0 auto;
    font-weight: 700;
  }

  &.active {
    border-color: #0b7285;
    box-shadow: inset 4px 0 0 #0b7285;
  }
}

.course-workspace {
  min-width: 0;
}

.course-heading {
  align-items: flex-start;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 1rem;

  h2 {
    font-size: 1.65rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: .35rem;
  }

  p {
    color: #52606d;
  }
}

.tour-banner {
  align-items: center;
  background: #ffffff;
  border: 1px solid #d9e2ec;
  border-radius: 6px;
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1fr) minmax(16rem, .8fr);
  margin-bottom: 1rem;
  padding: 1rem;

  h3 {
    font-size: 1.05rem;
    font-weight: 700;
    margin-bottom: .25rem;
  }

  p {
    color: #52606d;
    line-height: 1.45;
  }
}

.tour-steps {
  display: flex;
  flex-wrap: wrap;
  gap: .45rem;
  justify-content: flex-end;
}

.tour-step {
  background: #f0f4f8;
  border: 1px solid #d9e2ec;
  border-radius: 999px;
  color: #334e68;
  font-size: .78rem;
  font-weight: 700;
  padding: .35rem .65rem;
}

.panel-blocks {
  margin-bottom: 1rem;
  padding: 1rem;

  h3 {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: .75rem;
  }
}

.muted {
  color: #52606d;
  font-size: .92rem;
  line-height: 1.45;
}

.lesson-row {
  align-items: flex-start;
  background: transparent;
  border: 0;
  border-top: 1px solid #edf2f7;
  color: #1f2933;
  cursor: pointer;
  display: flex;
  gap: .75rem;
  padding: .8rem .35rem;
  text-align: left;
  width: 100%;

  &:first-of-type {
    border-top: 0;
    padding-top: 0;
  }

  &.active {
    background: #eef8f9;
    border-radius: 6px;
  }

  input {
    flex: 0 0 auto;
    margin-top: .25rem;
  }

  strong,
  small {
    display: block;
  }

  small {
    color: #627d98;
    line-height: 1.35;
    margin-top: .15rem;
  }
}

.lesson-reader {
  h3 {
    margin-bottom: 0;
  }
}

.reader-title {
  align-items: flex-start;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: .75rem;
}

.lesson-objective {
  color: #52606d;
  font-weight: 600;
  line-height: 1.45;
  margin-bottom: 1rem;
}

.lesson-section {
  border-top: 1px solid #edf2f7;
  padding: .9rem 0;

  h4 {
    font-size: .9rem;
    font-weight: 700;
    margin-bottom: .45rem;
  }

  p,
  li {
    color: #334e68;
    line-height: 1.45;
  }

  ul,
  ol {
    margin-left: 1.15rem;
  }

  li + li {
    margin-top: .3rem;
  }
}

.screenshot-example {
  background: #f8fafc;
  border: 1px solid #d9e2ec;
  border-radius: 6px;
  margin: .25rem 0 1rem;
  overflow: hidden;

  p {
    color: #334e68;
    font-size: .86rem;
    line-height: 1.4;
    padding: .75rem .85rem .85rem;
  }
}

.screenshot-chrome {
  align-items: center;
  background: #1f2933;
  display: flex;
  gap: .35rem;
  height: 1.8rem;
  padding: 0 .65rem;

  span {
    background: #d9e2ec;
    border-radius: 50%;
    display: inline-block;
    height: .45rem;
    width: .45rem;
  }
}

.screenshot-body {
  display: grid;
  grid-template-columns: 5.8rem minmax(0, 1fr);
  min-height: 13rem;
}

.screenshot-sidebar {
  background: #102a43;
  display: flex;
  flex-direction: column;
  gap: .45rem;
  padding: .75rem .55rem;

  span {
    background: rgba(255, 255, 255, .12);
    border-radius: 4px;
    color: #f0f4f8;
    font-size: .7rem;
    font-weight: 700;
    line-height: 1.2;
    padding: .4rem;
  }
}

.screenshot-main {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-width: 0;
}

.screenshot-toolbar {
  align-items: center;
  background: #ffffff;
  border-bottom: 1px solid #d9e2ec;
  display: flex;
  gap: .75rem;
  justify-content: space-between;
  padding: .65rem .75rem;

  strong {
    color: #1f2933;
    line-height: 1.2;
  }

  small {
    color: #627d98;
    font-weight: 700;
  }
}

.screenshot-canvas {
  background: linear-gradient(135deg, #d9e2ec, #f0f4f8);
  min-height: 10rem;
  overflow: hidden;
  position: relative;

  &::before,
  &::after {
    background: rgba(16, 42, 67, .08);
    content: '';
    position: absolute;
  }

  &::before {
    height: 34%;
    left: 0;
    top: 42%;
    transform: skewY(-11deg);
    width: 100%;
  }

  &::after {
    border: 2px solid rgba(11, 114, 133, .25);
    border-radius: 50%;
    height: 7rem;
    right: -1.5rem;
    top: 1.5rem;
    width: 7rem;
  }
}

.screenshot-marker {
  align-items: center;
  background: #ffffff;
  border: 1px solid rgba(16, 42, 67, .16);
  border-radius: 999px;
  box-shadow: 0 4px 10px rgba(16, 42, 67, .12);
  color: #102a43;
  display: inline-flex;
  font-size: .7rem;
  font-weight: 700;
  gap: .3rem;
  max-width: 7.5rem;
  padding: .3rem .5rem;
  position: absolute;
  transform: translate(-10%, -10%);
  white-space: nowrap;
}

.plan-shot .screenshot-canvas {
  background: linear-gradient(135deg, #f7f0dd, #e8f0f7);
}

.media-shot .screenshot-canvas {
  background: linear-gradient(135deg, #edf2ff, #e8f7f0);
}

.map-shot .screenshot-canvas {
  background:
    linear-gradient(90deg, rgba(11, 114, 133, .18) 1px, transparent 1px),
    linear-gradient(0deg, rgba(11, 114, 133, .18) 1px, transparent 1px),
    linear-gradient(135deg, #dff3e4, #d7ecf5);
  background-size: 2rem 2rem, 2rem 2rem, cover;
}

.comms-shot .screenshot-canvas {
  background: linear-gradient(135deg, #fff4e6, #e6f4ff);
}

.observe-shot .screenshot-canvas {
  background: linear-gradient(135deg, #f3f0ff, #e8f7f0);
}

.admin-shot .screenshot-canvas {
  background: linear-gradient(135deg, #f8fafc, #e6fffa);
}

.capstone-shot .screenshot-canvas {
  background: linear-gradient(135deg, #eef2ff, #fff7ed);
}

.example-box {
  background: #f0f4f8;
  border-left: 4px solid #0b7285;
  border-radius: 6px;
  margin: .25rem 0 .75rem;
  padding: .8rem;

  strong {
    display: block;
    margin-bottom: .3rem;
  }

  p {
    color: #334e68;
    line-height: 1.45;
  }
}

.reader-actions {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  justify-content: space-between;
  padding-top: .5rem;
}

.exercise {
  p {
    color: #52606d;
    margin-bottom: .75rem;
  }
}

.quiz-question {
  border-top: 1px solid #edf2f7;
  padding: .85rem 0;

  &:first-of-type {
    border-top: 0;
    padding-top: 0;
  }

  p {
    font-weight: 600;
    margin-bottom: .6rem;
  }
}

.answer-note {
  color: #2f855a;
  display: block;
  line-height: 1.35;
}

.score-box {
  align-items: center;
  background: #f0f4f8;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  margin-top: .75rem;
  padding: .8rem;

  span {
    color: #52606d;
    font-weight: 700;
  }

  strong {
    font-size: 1.4rem;
  }
}

@media screen and (max-width: 1100px) {
  .module-overview {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .learn-layout {
    grid-template-columns: 1fr;
  }

  .course-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media screen and (max-width: 900px) {
  .learn-page {
    padding: 1rem;
  }

  .learn-header {
    grid-template-columns: 1fr;
  }

  .tour-banner {
    grid-template-columns: 1fr;
  }

  .tour-steps {
    justify-content: flex-start;
  }

  .course-heading {
    display: block;

    .button {
      margin-top: .75rem;
    }
  }
}

@media screen and (max-width: 640px) {
  .module-overview {
    grid-template-columns: 1fr;
  }

  .course-list {
    grid-template-columns: 1fr;
  }

  .module-card {
    min-height: auto;
  }

  .screenshot-body {
    grid-template-columns: 1fr;
  }

  .screenshot-sidebar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .reader-actions {
    display: block;

    .button {
      margin-bottom: .5rem;
      width: 100%;
    }
  }
}
</style>
