<template>
  <section class="learn-page"
           :class="pageClasses">
    <header class="learn-hero">
      <div>
        <p class="overline">EPIC Learn</p>
        <h1>Epic Ready guided training</h1>
        <p>
          Epic Ready is an exercise operations suite for planning events, creating a realistic
          information environment, coordinating operators, mapping activity, capturing observations,
          and turning evidence into after-action products. Work through each app module in order to
          build a complete understanding of the platform.
        </p>
      </div>
      <aside class="progress-card"
             aria-label="Curriculum progress">
        <span>Curriculum Progress</span>
        <strong>{{ overallProgress }}%</strong>
        <progress class="progress is-primary"
                  :value="overallProgress"
                  max="100">
          {{ overallProgress }}%
        </progress>
        <small>{{ completedCount }} of {{ modules.length }} modules complete</small>
      </aside>
    </header>

    <section v-if="!isCoursePage"
             class="module-grid"
             aria-label="Epic Ready app modules">
      <component v-for="module in modules"
                 :key="module.id"
                 :is="isModuleUnlocked(module.id) ? 'router-link' : 'button'"
                 class="module-card"
                 :class="{
                   active: isCoursePage && module.id === selectedModule.id,
                   complete: isModuleComplete(module.id),
                   locked: !isModuleUnlocked(module.id)
                 }"
                 :disabled="!isModuleUnlocked(module.id)"
                 :to="isModuleUnlocked(module.id) ? moduleRoute(module) : null">
        <span class="module-icon">
          <i :class="module.icon"></i>
        </span>
        <span class="module-copy">
          <strong>{{ module.name }}</strong>
          <small>{{ module.summary }}</small>
        </span>
        <span class="module-state">
          {{ moduleStatus(module.id) }}
        </span>
      </component>
    </section>

    <section v-if="!isCoursePage"
             class="course-overview">
      <div class="overview-copy">
        <p class="overline">Curriculum Overview</p>
        <h2>Select a module to begin</h2>
        <p>
          Each module now opens on its own page with focused lesson content, a guided exercise,
          completion notes, and a checkpoint test. Start with Plan, then unlock the rest of the
          app curriculum as you complete each course.
        </p>
      </div>
      <div class="overview-steps"
           aria-label="Course sequence">
        <component v-for="module in modules"
                   :key="`overview-${module.id}`"
                   :is="isModuleUnlocked(module.id) ? 'router-link' : 'button'"
                   class="overview-step"
                   :class="{
                     complete: isModuleComplete(module.id),
                     locked: !isModuleUnlocked(module.id)
                   }"
                   :disabled="!isModuleUnlocked(module.id)"
                   :to="isModuleUnlocked(module.id) ? moduleRoute(module) : null">
          <span>{{ module.order }}</span>
          <strong>{{ module.name }}</strong>
          <small>{{ module.duration }} min - {{ moduleStatus(module.id) }}</small>
        </component>
      </div>
    </section>

    <main v-else
          class="lesson-shell">
      <section class="lesson-panel">
        <div class="lesson-heading">
          <div>
            <p class="overline">Module {{ selectedModule.order }} of {{ modules.length }}</p>
            <h2>{{ selectedModule.name }}</h2>
            <p>{{ selectedModule.lesson }}</p>
          </div>
          <div class="lesson-heading-actions">
            <router-link class="button is-light"
                         :to="{ name: 'learn-home' }">
              <span class="icon is-small">
                <i class="fas fa-arrow-left"></i>
              </span>
              <span>All Modules</span>
            </router-link>
            <router-link class="button is-primary"
                         :to="selectedModule.appRoute">
              <span class="icon is-small">
                <i class="fas fa-external-link-alt"></i>
              </span>
              <span>Open App</span>
            </router-link>
          </div>
        </div>

        <div class="content-grid">
          <section class="lesson-card">
            <h3>What You Learn</h3>
            <ul>
              <li v-for="item in selectedModule.learn"
                  :key="item">{{ item }}</li>
            </ul>
          </section>

          <section class="lesson-card">
            <h3>Guided Example</h3>
            <p>{{ selectedModule.example }}</p>
            <div class="app-preview"
                 :class="selectedModule.preview">
              <div class="preview-nav">
                <span v-for="item in selectedModule.previewNav"
                      :key="item">{{ item }}</span>
              </div>
              <div class="preview-canvas">
                <span v-for="marker in selectedModule.markers"
                      :key="marker.label"
                      class="preview-marker"
                      :style="{ left: marker.x, top: marker.y }">
                  <i :class="marker.icon"></i>
                  {{ marker.label }}
                </span>
              </div>
            </div>
          </section>

          <section class="lesson-card">
            <h3>Try It</h3>
            <ol>
              <li v-for="step in selectedModule.practice"
                  :key="step">{{ step }}</li>
            </ol>
            <label class="evidence-label"
                   :for="`notes-${selectedModule.id}`">Completion notes</label>
            <textarea :id="`notes-${selectedModule.id}`"
                      class="textarea"
                      rows="4"
                      :placeholder="selectedModule.evidence"
                      v-model="moduleState.notes"></textarea>
          </section>

          <section class="lesson-card">
            <h3>Checkpoint Test</h3>
            <div v-for="question in selectedModule.quiz"
                 :key="question.id"
                 class="quiz-question">
              <p>{{ question.prompt }}</p>
              <div class="buttons">
                <button v-for="option in question.options"
                        :key="option"
                        class="button is-small"
                        :class="answerClass(question, option)"
                        type="button"
                        @click="answerQuestion(question.id, option)">
                  {{ option }}
                </button>
              </div>
              <small v-if="moduleState.answers[question.id] === question.answer"
                     class="answer-note">{{ question.explain }}</small>
            </div>
            <div class="score-row">
              <span>Passing score</span>
              <strong>{{ moduleScore(selectedModule.id) }}%</strong>
            </div>
          </section>
        </div>

        <footer class="lesson-actions">
          <button class="button"
                  type="button"
                  :disabled="selectedIndex === 0"
                  @click="openModule(modules[selectedIndex - 1])">
            Previous Module
          </button>
          <button class="button is-primary"
                  type="button"
                  :disabled="!canCompleteSelected"
                  @click="completeSelectedModule">
            Complete Module
          </button>
          <button class="button"
                  type="button"
                  :disabled="!canGoNext"
                  @click="openModule(modules[selectedIndex + 1])">
            Next Module
          </button>
        </footer>

        <p v-if="!canCompleteSelected"
           class="completion-hint">
          Answer the checkpoint correctly and add completion notes to unlock the next module.
        </p>
      </section>
    </main>
  </section>
</template>

<script>
const STORAGE_KEY = 'epic.learn.appModuleProgress'

function question(id, prompt, options, answer, explain) {
  return { id, prompt, options, answer, explain }
}

function moduleLesson(order, id, name, icon, appRoute, role, duration, summary, lesson, learn, example, practice, evidence, quiz, preview, previewNav, markers) {
  return {
    order,
    id,
    name,
    icon,
    appRoute,
    role,
    duration,
    summary,
    lesson,
    learn,
    example,
    practice,
    evidence,
    quiz,
    preview,
    previewNav,
    markers
  }
}

export default {
  name: 'learn-home',
  props: {
    courseId: String,
    lessonId: String
  },
  data() {
    return {
      selectedModuleId: 'plan',
      progress: {},
      modules: [
        moduleLesson(
          1,
          'plan',
          'Plan',
          'fas fa-clipboard-list',
          { name: 'plan-home' },
          'Planner',
          35,
          'Build exercises, objectives, events, injects, feedback, and reports.',
          'Plan is the backbone of Epic Ready. It defines the exercise purpose, the participants, the timeline, the objectives, the injects, and the evidence that will later become assessment material.',
          [
            'Create the core exercise structure before operators begin execution.',
            'Connect objectives, participants, events, injects, feedback, and reports.',
            'Use structured settings so reports and filters stay consistent.'
          ],
          'For a communications exercise, create a plan with two objectives, a participant organization, one event, and an inject owner. During execution, evaluators use that structure to collect feedback and produce a report.',
          [
            'Open Plan and review the available sections.',
            'Identify where you would create participants, objectives, events, and feedback.',
            'Write one note explaining what data must exist before a live exercise starts.'
          ],
          'Summarize the minimum Plan data needed before a team can execute an event.',
          [
            question('q1', 'What does Plan primarily organize?', ['Exercise design and assessment data', 'Map tile servers', 'User password resets'], 'Exercise design and assessment data', 'Plan owns the exercise structure and assessment workflow.'),
            question('q2', 'Why do Plan settings matter?', ['They standardize report data', 'They change the browser theme', 'They disable login'], 'They standardize report data', 'Settings make planning and reporting fields consistent.')
          ],
          'plan-preview',
          ['Prepare', 'Train', 'Assess'],
          [
            { label: 'Objective', icon: 'fas fa-bullseye', x: '18%', y: '25%' },
            { label: 'Event', icon: 'fas fa-calendar-alt', x: '55%', y: '40%' },
            { label: 'Report', icon: 'fas fa-file-alt', x: '68%', y: '70%' }
          ]
        ),
        moduleLesson(
          2,
          'media',
          'Media',
          'fas fa-photo-video',
          { name: 'media-home' },
          'Content Operator',
          30,
          'Create personas, networks, posts, and scenario media.',
          'Media lets exercise staff build the simulated social environment used to drive scenario activity and operator response.',
          [
            'Create personas and networks that match the training scenario.',
            'Draft and schedule posts that support inject timing.',
            'Use analytics and noise views to evaluate audience activity.'
          ],
          'A media controller builds two personas, connects them to a network, schedules posts around an inject, and reviews the resulting response pattern.',
          [
            'Open Media and inspect Personas, Networks, Posts, and Analytics.',
            'Describe which persona would post the first scenario signal.',
            'Record how you would distinguish planned content from background noise.'
          ],
          'Describe a persona, network, and post that would support a training inject.',
          [
            question('q1', 'Which Media item represents a simulated actor?', ['Persona', 'Notebook', 'Workspace'], 'Persona', 'Personas are simulated actors in the media environment.'),
            question('q2', 'Why schedule posts?', ['To align scenario content with exercise timing', 'To create user accounts', 'To enable map terrain'], 'To align scenario content with exercise timing', 'Scheduling keeps information effects synchronized with the exercise plan.')
          ],
          'media-preview',
          ['Personas', 'Networks', 'Posts'],
          [
            { label: 'Persona', icon: 'fas fa-user', x: '20%', y: '28%' },
            { label: 'Network', icon: 'fas fa-project-diagram', x: '50%', y: '52%' },
            { label: 'Post', icon: 'fas fa-comment-dots', x: '65%', y: '24%' }
          ]
        ),
        moduleLesson(
          3,
          'notebook',
          'Notebook',
          'fas fa-sticky-note',
          { name: 'notebook-home' },
          'Evaluator',
          20,
          'Capture structured working notes during planning and execution.',
          'Notebook gives operators a place to organize observations, draft analysis, and preserve context that may not belong in a formal report yet.',
          [
            'Create notebooks and pages for evaluator notes.',
            'Separate raw observations from later analysis.',
            'Use notes as source material for feedback and reports.'
          ],
          'An evaluator keeps one notebook for live observations and another page for after-action themes that need review before publication.',
          [
            'Open Notebook and inspect how pages are organized.',
            'Draft a note title for a live event observation.',
            'Write how that note could become feedback later.'
          ],
          'Record the note structure you would use for one live observation.',
          [
            question('q1', 'What should Notebook hold?', ['Working notes and observations', 'Only password records', 'Map tiles'], 'Working notes and observations', 'Notebook is for working notes and supporting observations.'),
            question('q2', 'Why separate observations from analysis?', ['To preserve facts before interpretation', 'To hide content from reports', 'To speed up login'], 'To preserve facts before interpretation', 'Good evaluation practice keeps raw facts distinct from conclusions.')
          ],
          'notes-preview',
          ['Folders', 'Pages', 'Notes'],
          [
            { label: 'Page', icon: 'fas fa-file-alt', x: '22%', y: '35%' },
            { label: 'Observation', icon: 'fas fa-pen', x: '55%', y: '48%' },
            { label: 'Theme', icon: 'fas fa-tags', x: '66%', y: '70%' }
          ]
        ),
        moduleLesson(
          4,
          'web',
          'Web',
          'fas fa-globe',
          { name: 'web-home' },
          'Information Environment',
          25,
          'Review scenario sites, profiles, news pages, and public-facing content.',
          'Web presents scenario content as websites and public pages so trainees can inspect information in a realistic browsing context.',
          [
            'Navigate scenario websites and profile pages.',
            'Connect web content to media posts and narrative injects.',
            'Use public-facing pages as training artifacts during evaluation.'
          ],
          'A trainee receives a link to a simulated news story, reviews the article, checks related profiles, and reports how the content affects their decisions.',
          [
            'Open Web and identify the available scenario site.',
            'Review one profile or news item.',
            'Write how that content might influence an operator decision.'
          ],
          'Capture the web content you would use as evidence in a scenario.',
          [
            question('q1', 'What does Web simulate?', ['Public-facing scenario content', 'Database migrations', 'User roles only'], 'Public-facing scenario content', 'Web exposes simulated sites and pages for training.'),
            question('q2', 'How should Web connect to Media?', ['Shared narrative and information artifacts', 'Unrelated passwords', 'Map layer styling'], 'Shared narrative and information artifacts', 'Web and Media should support the same scenario story.')
          ],
          'web-preview',
          ['Sites', 'Profiles', 'News'],
          [
            { label: 'Article', icon: 'fas fa-newspaper', x: '25%', y: '25%' },
            { label: 'Profile', icon: 'fas fa-id-card', x: '55%', y: '42%' },
            { label: 'Source', icon: 'fas fa-link', x: '64%', y: '70%' }
          ]
        ),
        moduleLesson(
          5,
          'observe',
          'Observe',
          'fas fa-eye',
          { name: 'observe-home' },
          'Observer',
          25,
          'Monitor scenario posts and profiles as evidence develops.',
          'Observe helps evaluators watch the simulated information environment without editing the content being produced.',
          [
            'Review posts and profiles from an observer perspective.',
            'Identify content that should become evaluation evidence.',
            'Separate monitoring from content creation.'
          ],
          'An observer watches a profile respond to an inject and records the timing, wording, and audience reaction for later feedback.',
          [
            'Open Observe and inspect the post/profile views.',
            'Find one piece of content that would be useful evidence.',
            'Write why the content matters to the exercise objective.'
          ],
          'Summarize the observed content and the objective it supports.',
          [
            question('q1', 'What is Observe optimized for?', ['Monitoring evidence', 'Creating settings records', 'Changing passwords'], 'Monitoring evidence', 'Observe is the read-focused monitoring surface.'),
            question('q2', 'Why keep observing separate from creating?', ['It protects evaluation neutrality', 'It disables reports', 'It changes the map projection'], 'It protects evaluation neutrality', 'Observers should preserve a clear evidence perspective.')
          ],
          'observe-preview',
          ['Posts', 'Profiles', 'Evidence'],
          [
            { label: 'Signal', icon: 'fas fa-eye', x: '20%', y: '28%' },
            { label: 'Profile', icon: 'fas fa-user-circle', x: '50%', y: '45%' },
            { label: 'Evidence', icon: 'fas fa-clipboard-check', x: '67%', y: '68%' }
          ]
        ),
        moduleLesson(
          6,
          'map',
          'Map',
          'fas fa-map-marked-alt',
          { name: 'map-home' },
          'COP Operator',
          30,
          'Use map views, globe views, layers, symbols, and locations.',
          'Map provides geospatial context for incidents, assets, areas, and scenario movement across the exercise.',
          [
            'Switch between map and globe workflows.',
            'Use layers and symbols to communicate operational context.',
            'Tie locations to injects, observations, or reports.'
          ],
          'A controller marks an incident location, adds a symbol, and uses the shared view to brief responders during an exercise inject.',
          [
            'Open Map and then the Globe view.',
            'Identify where you would add or inspect a location marker.',
            'Write how map context changes the team response.'
          ],
          'Record the location, layer, or symbol you would use in a sample incident.',
          [
            question('q1', 'What does Map add to an exercise?', ['Geospatial context', 'Email account setup', 'Password recovery'], 'Geospatial context', 'Map adds place-based context and shared operational views.'),
            question('q2', 'Why use symbols?', ['To communicate operational meaning quickly', 'To generate registrations', 'To edit user roles'], 'To communicate operational meaning quickly', 'Symbols give visual meaning to map objects.')
          ],
          'map-preview',
          ['Layers', 'Markers', 'Globe'],
          [
            { label: 'Layer', icon: 'fas fa-layer-group', x: '22%', y: '30%' },
            { label: 'Marker', icon: 'fas fa-map-marker-alt', x: '52%', y: '42%' },
            { label: 'Area', icon: 'fas fa-draw-polygon', x: '66%', y: '68%' }
          ]
        ),
        moduleLesson(
          7,
          'chat',
          'Chat',
          'fas fa-comments',
          { name: 'chat-home' },
          'Operator',
          20,
          'Coordinate live exercise work in shared channels.',
          'Chat supports quick coordination between controllers, evaluators, and operators during the exercise.',
          [
            'Use workspace chat for operational coordination.',
            'Keep time-sensitive decisions visible to the team.',
            'Capture chat context when it supports an observation.'
          ],
          'Controllers use Chat to confirm an inject was released and evaluators note the response time for later assessment.',
          [
            'Open Chat and inspect the channel layout.',
            'Draft a message that confirms an inject status.',
            'Write when a chat message should become evidence.'
          ],
          'Write one clear coordination message and its evaluation value.',
          [
            question('q1', 'What is Chat best for?', ['Live coordination', 'Formal final reports', 'Map tile downloads'], 'Live coordination', 'Chat is the live coordination channel.'),
            question('q2', 'When should chat become evidence?', ['When it documents a meaningful exercise action', 'Any time someone uses punctuation', 'Only on login'], 'When it documents a meaningful exercise action', 'Evidence should support an objective or event record.')
          ],
          'chat-preview',
          ['Channels', 'Messages', 'Status'],
          [
            { label: 'Channel', icon: 'fas fa-hashtag', x: '18%', y: '26%' },
            { label: 'Message', icon: 'fas fa-comment', x: '52%', y: '45%' },
            { label: 'Decision', icon: 'fas fa-check', x: '66%', y: '70%' }
          ]
        ),
        moduleLesson(
          8,
          'resources',
          'Resources',
          'fas fa-book',
          { name: 'resources-home' },
          'Reference Manager',
          20,
          'Organize reference material for operators and evaluators.',
          'Resources keeps supporting documents and reference material available inside the workspace.',
          [
            'Use resources for stable reference material.',
            'Keep operating procedures close to the exercise workflow.',
            'Point learners to supporting documents from training modules.'
          ],
          'An exercise lead stores evaluation rubrics, communications templates, and scenario background files for the team.',
          [
            'Open Resources and inspect the available material.',
            'Identify one reference item that should support a module.',
            'Write how operators should use that item during execution.'
          ],
          'Name the resource and explain when it should be consulted.',
          [
            question('q1', 'What belongs in Resources?', ['Reference documents and supporting material', 'Only temporary chat messages', 'Browser cookies'], 'Reference documents and supporting material', 'Resources is for durable reference content.'),
            question('q2', 'Why keep resources in the workspace?', ['So the team has shared source material', 'To replace authentication', 'To turn off apps'], 'So the team has shared source material', 'Shared references reduce ambiguity during execution.')
          ],
          'resources-preview',
          ['Library', 'Files', 'Guides'],
          [
            { label: 'Guide', icon: 'fas fa-book-open', x: '22%', y: '30%' },
            { label: 'Template', icon: 'fas fa-file', x: '52%', y: '48%' },
            { label: 'Rubric', icon: 'fas fa-list', x: '67%', y: '72%' }
          ]
        ),
        moduleLesson(
          9,
          'learn',
          'Learn',
          'fas fa-graduation-cap',
          { name: 'learn-home' },
          'Trainer',
          20,
          'Use the training path to onboard app users consistently.',
          'Learn gives trainers a repeatable course sequence so new users understand the whole Epic Ready suite before evaluation begins.',
          [
            'Use modules to teach each app in a consistent order.',
            'Require checkpoint tests and notes before progression.',
            'Treat completion as readiness evidence for workspace users.'
          ],
          'A trainer asks new evaluators to finish Plan, Media, Observe, Map, and Chat before the rehearsal day.',
          [
            'Review the module path and completion states.',
            'Identify which app modules are mandatory for your role.',
            'Write how you would verify someone is ready to participate.'
          ],
          'Write the module completion standard for a new operator.',
          [
            question('q1', 'What does Learn provide?', ['A guided app curriculum', 'Map terrain only', 'Email delivery rules'], 'A guided app curriculum', 'Learn is the guided curriculum area.'),
            question('q2', 'Why require notes and quizzes?', ['To prove understanding before unlocking later modules', 'To clear browser cache', 'To disable roles'], 'To prove understanding before unlocking later modules', 'Progression should reflect actual understanding.')
          ],
          'learn-preview',
          ['Modules', 'Tests', 'Progress'],
          [
            { label: 'Module', icon: 'fas fa-th-large', x: '20%', y: '28%' },
            { label: 'Quiz', icon: 'fas fa-question-circle', x: '52%', y: '45%' },
            { label: 'Unlock', icon: 'fas fa-unlock', x: '68%', y: '70%' }
          ]
        ),
        moduleLesson(
          10,
          'settings',
          'Settings',
          'fas fa-cog',
          { name: 'settings-home' },
          'Administrator',
          30,
          'Manage workspace apps, members, roles, timezone, and reference data.',
          'Settings controls workspace readiness: who has access, which apps are active, and which reference values support the exercise.',
          [
            'Enable the apps needed for evaluation.',
            'Review members, roles, and timezone before execution.',
            'Maintain reference data used by Plan and other apps.'
          ],
          'Before an evaluation, an admin enables all required apps, confirms every evaluator role, and checks the timezone used for event schedules.',
          [
            'Open Settings and inspect Workspace Apps.',
            'Review where members, roles, and timezone are managed.',
            'Write a pre-event readiness check for administrators.'
          ],
          'Create a workspace readiness checklist for the admin role.',
          [
            question('q1', 'What should you check if an app is missing?', ['Workspace app status and user role', 'Only screen size', 'Only the map layer'], 'Workspace app status and user role', 'Both app activation and role permissions affect access.'),
            question('q2', 'Why verify timezone?', ['It affects schedules and coordination', 'It changes icons', 'It creates personas'], 'It affects schedules and coordination', 'Exercise timing depends on a shared timezone.')
          ],
          'settings-preview',
          ['Apps', 'Members', 'Roles'],
          [
            { label: 'Apps', icon: 'fas fa-toggle-on', x: '22%', y: '30%' },
            { label: 'Role', icon: 'fas fa-user-shield', x: '50%', y: '48%' },
            { label: 'Timezone', icon: 'fas fa-clock', x: '68%', y: '70%' }
          ]
        ),
        moduleLesson(
          11,
          'developer',
          'Developer',
          'fas fa-code',
          { name: 'dev-home' },
          'Support',
          20,
          'Review advanced workspace support and administrative diagnostics.',
          'Developer is for high-trust support users who need to inspect users, workspaces, and lower-level application state.',
          [
            'Understand when Developer should be used.',
            'Protect privileged operations from routine operator workflows.',
            'Use diagnostics to support workspace evaluation without changing scenario data unnecessarily.'
          ],
          'A support lead checks user and workspace records after a migration to confirm app access is correct.',
          [
            'Open Developer if your role allows it.',
            'Identify which support task belongs there instead of Settings.',
            'Write what change control you would require before editing data.'
          ],
          'Describe a Developer task and the approval needed before performing it.',
          [
            question('q1', 'Who should use Developer?', ['High-trust support users', 'Every trainee by default', 'Unauthenticated visitors'], 'High-trust support users', 'Developer exposes privileged support workflows.'),
            question('q2', 'Why use change control?', ['Privileged changes can affect the whole workspace', 'It changes map colors', 'It creates posts'], 'Privileged changes can affect the whole workspace', 'Support operations need accountability.')
          ],
          'dev-preview',
          ['Users', 'Workspaces', 'Diagnostics'],
          [
            { label: 'User', icon: 'fas fa-user-cog', x: '22%', y: '30%' },
            { label: 'Workspace', icon: 'fas fa-building', x: '52%', y: '48%' },
            { label: 'Audit', icon: 'fas fa-search', x: '68%', y: '70%' }
          ]
        ),
        moduleLesson(
          12,
          'email',
          'Email',
          'fas fa-envelope',
          { name: 'email-home' },
          'Inject Controller',
          25,
          'Use email traffic as controlled exercise injects and responses.',
          'Email supports formal message traffic inside the scenario, especially when an inject needs to feel like an official communication.',
          [
            'Send and review scenario email traffic.',
            'Coordinate email injects with Plan timing.',
            'Capture message content and response behavior as evidence.'
          ],
          'A controller sends an official-looking notice to a participant inbox and evaluators track whether the participant follows the correct procedure.',
          [
            'Open Email and inspect the inbox view.',
            'Draft the purpose of a formal inject message.',
            'Write what response would prove successful handling.'
          ],
          'Summarize one email inject and the expected operator response.',
          [
            question('q1', 'When is Email useful?', ['Formal scenario message traffic', 'Changing workspace apps', 'Rendering map tiles'], 'Formal scenario message traffic', 'Email is suited to official message-style injects.'),
            question('q2', 'What should an email inject connect to?', ['Plan timing and evaluation evidence', 'Only browser bookmarks', 'Only local storage'], 'Plan timing and evaluation evidence', 'Injects should tie back to the exercise plan and assessment.')
          ],
          'email-preview',
          ['Inbox', 'Message', 'Response'],
          [
            { label: 'Inbox', icon: 'fas fa-inbox', x: '22%', y: '30%' },
            { label: 'Inject', icon: 'fas fa-paper-plane', x: '52%', y: '48%' },
            { label: 'Reply', icon: 'fas fa-reply', x: '68%', y: '70%' }
          ]
        ),
        moduleLesson(
          13,
          'command',
          'Command',
          'fas fa-terminal',
          { name: 'command-home' },
          'Controller',
          25,
          'Send command-channel injects and record operational actions.',
          'Command gives exercise staff a controlled channel for operational prompts, tasks, or command-style traffic.',
          [
            'Use Command for explicit operational direction.',
            'Keep command traffic synchronized with the plan.',
            'Record acknowledgements and outcomes for assessment.'
          ],
          'A controller issues a command prompt that requires the team to update status and report completion within the exercise timeline.',
          [
            'Open Command and review the workflow.',
            'Describe a command inject and its expected acknowledgement.',
            'Write how the command outcome would be evaluated.'
          ],
          'Document one command inject, acknowledgement, and success standard.',
          [
            question('q1', 'What should Command carry?', ['Controlled operational prompts', 'Only static reference files', 'Map imagery'], 'Controlled operational prompts', 'Command is for controlled operational traffic.'),
            question('q2', 'What makes a command useful for evaluation?', ['A clear expected action and outcome', 'A hidden route', 'A decorative icon'], 'A clear expected action and outcome', 'A command should be measurable.')
          ],
          'command-preview',
          ['Prompt', 'Action', 'Outcome'],
          [
            { label: 'Prompt', icon: 'fas fa-terminal', x: '22%', y: '30%' },
            { label: 'Ack', icon: 'fas fa-check-double', x: '52%', y: '48%' },
            { label: 'Outcome', icon: 'fas fa-flag-checkered', x: '68%', y: '70%' }
          ]
        ),
        moduleLesson(
          14,
          'activity',
          'Activity',
          'fas fa-stream',
          { name: 'activity-home' },
          'Evaluator',
          20,
          'Review workspace activity as an operational timeline.',
          'Activity provides a timeline-style view of changes and actions across the workspace so evaluators can understand what happened and when.',
          [
            'Use activity history to reconstruct exercise flow.',
            'Connect events to observations and feedback.',
            'Identify missing or late actions during after-action review.'
          ],
          'After an exercise, an evaluator reviews activity entries to confirm when content was created, when injects were delivered, and when responses appeared.',
          [
            'Open Activity and inspect recent workspace entries.',
            'Identify an action that supports an evaluation finding.',
            'Write how the timeline affects the after-action story.'
          ],
          'Capture one timeline event and explain its evaluation importance.',
          [
            question('q1', 'What does Activity help reconstruct?', ['What happened and when', 'Only password entropy', 'Only basemap color'], 'What happened and when', 'Activity is useful for timeline reconstruction.'),
            question('q2', 'How does Activity support reports?', ['It provides context for findings', 'It replaces all notes', 'It disables feedback'], 'It provides context for findings', 'Activity entries can support after-action analysis.')
          ],
          'activity-preview',
          ['Timeline', 'Actions', 'Review'],
          [
            { label: 'Entry', icon: 'fas fa-stream', x: '22%', y: '30%' },
            { label: 'Time', icon: 'fas fa-clock', x: '52%', y: '48%' },
            { label: 'Finding', icon: 'fas fa-search-plus', x: '68%', y: '70%' }
          ]
        )
      ]
    }
  },
  computed: {
    selectedModule() {
      return this.modules.find(module => module.id === this.selectedModuleId) || this.modules[0]
    },
    selectedIndex() {
      return this.modules.findIndex(module => module.id === this.selectedModule.id)
    },
    pageClasses() {
      return {
        'is-course-page': this.isCoursePage,
        [`course-${this.selectedModule.id}`]: this.isCoursePage
      }
    },
    activeCourseId() {
      return this.courseId || this.$route.params.courseId || null
    },
    isCoursePage() {
      return !!this.activeCourseId
    },
    moduleState() {
      return this.ensureModuleState(this.selectedModule.id)
    },
    completedCount() {
      return this.modules.filter(module => this.isModuleComplete(module.id)).length
    },
    overallProgress() {
      return Math.round((this.completedCount / this.modules.length) * 100)
    },
    canCompleteSelected() {
      return this.moduleScore(this.selectedModule.id) === 100 && this.moduleState.notes.trim().length > 0
    },
    canGoNext() {
      const nextModule = this.modules[this.selectedIndex + 1]
      return !!nextModule && this.isModuleUnlocked(nextModule.id)
    }
  },
  watch: {
    courseId() {
      this.syncRoute()
    },
    '$route.params.courseId'() {
      this.syncRoute()
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
    this.modules.forEach(module => this.ensureModuleState(module.id))
    this.syncRoute()
  },
  methods: {
    moduleRoute(module) {
      return {
        name: 'learn-course',
        params: {
          courseId: module.id
        }
      }
    },
    syncRoute() {
      const requestedModule = this.modules.find(module => module.id === this.activeCourseId)
      if (!requestedModule) {
        this.selectedModuleId = this.firstAvailableModule().id
        return
      }
      if (!this.isModuleUnlocked(requestedModule.id)) {
        this.openModule(this.firstAvailableModule())
        return
      }
      this.selectedModuleId = requestedModule.id
    },
    firstAvailableModule() {
      let available = this.modules[0]
      this.modules.forEach(module => {
        if (this.isModuleUnlocked(module.id)) {
          available = module
        }
      })
      return available
    },
    openModule(module) {
      if (!module || !this.isModuleUnlocked(module.id)) {
        return
      }
      this.selectedModuleId = module.id
      if (this.activeCourseId !== module.id) {
        this.$router.push(this.moduleRoute(module))
      }
    },
    ensureModuleState(moduleId) {
      if (!this.progress[moduleId]) {
        this.$set(this.progress, moduleId, {
          complete: false,
          answers: {},
          notes: ''
        })
      }
      if (!this.progress[moduleId].answers) {
        this.$set(this.progress[moduleId], 'answers', {})
      }
      if (typeof this.progress[moduleId].notes !== 'string') {
        this.$set(this.progress[moduleId], 'notes', '')
      }
      if (typeof this.progress[moduleId].complete !== 'boolean') {
        this.$set(this.progress[moduleId], 'complete', false)
      }
      return this.progress[moduleId]
    },
    isModuleComplete(moduleId) {
      return this.ensureModuleState(moduleId).complete === true
    },
    isModuleUnlocked(moduleId) {
      const index = this.modules.findIndex(module => module.id === moduleId)
      if (index <= 0) {
        return true
      }
      return this.isModuleComplete(this.modules[index - 1].id)
    },
    moduleStatus(moduleId) {
      if (this.isModuleComplete(moduleId)) {
        return 'Complete'
      }
      if (!this.isModuleUnlocked(moduleId)) {
        return 'Locked'
      }
      return 'Ready'
    },
    answerQuestion(questionId, option) {
      this.$set(this.moduleState.answers, questionId, option)
    },
    answerClass(question, option) {
      const selected = this.moduleState.answers[question.id]
      if (!selected || selected !== option) {
        return 'is-light'
      }
      return option === question.answer ? 'is-success' : 'is-danger'
    },
    moduleScore(moduleId) {
      const module = this.modules.find(item => item.id === moduleId)
      const state = this.ensureModuleState(moduleId)
      const correct = module.quiz.filter(question => state.answers[question.id] === question.answer).length
      return Math.round((correct / module.quiz.length) * 100)
    },
    completeSelectedModule() {
      if (!this.canCompleteSelected) {
        return
      }
      this.$set(this.moduleState, 'complete', true)
      const nextModule = this.modules[this.selectedIndex + 1]
      if (nextModule) {
        this.openModule(nextModule)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.learn-page {
  --learn-accent: #0b7285;
  --learn-accent-dark: #075766;
  --learn-accent-soft: #e0f2f1;
  --learn-accent-wash: #eef8f9;
  --learn-surface: #ffffff;
  background: #f5f7f9;
  color: #1f2933;
  min-height: calc(100vh - 3.25rem);
  padding: 2rem;
}

.learn-page.is-course-page {
  background:
    linear-gradient(180deg, var(--learn-accent-wash), #f5f7f9 22rem);
}

.course-plan {
  --learn-accent: #2f855a;
  --learn-accent-dark: #276749;
  --learn-accent-soft: #e6f4ea;
  --learn-accent-wash: #f0fff4;
}

.course-media,
.course-web,
.course-observe {
  --learn-accent: #2b6cb0;
  --learn-accent-dark: #1f4f82;
  --learn-accent-soft: #e8f1fb;
  --learn-accent-wash: #edf7ff;
}

.course-notebook,
.course-resources {
  --learn-accent: #9f580a;
  --learn-accent-dark: #744210;
  --learn-accent-soft: #fff3df;
  --learn-accent-wash: #fffaf0;
}

.course-map {
  --learn-accent: #008080;
  --learn-accent-dark: #005f5f;
  --learn-accent-soft: #dff7f4;
  --learn-accent-wash: #ecfffb;
}

.course-chat,
.course-email,
.course-command {
  --learn-accent: #5a67d8;
  --learn-accent-dark: #434190;
  --learn-accent-soft: #ebf0ff;
  --learn-accent-wash: #f4f6ff;
}

.course-settings,
.course-dev,
.course-learn,
.course-activity {
  --learn-accent: #4a5568;
  --learn-accent-dark: #2d3748;
  --learn-accent-soft: #edf2f7;
  --learn-accent-wash: #f7fafc;
}

.learn-hero,
.module-grid,
.course-overview,
.lesson-shell {
  margin: 0 auto;
  max-width: 1320px;
}

.learn-hero {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: minmax(0, 1fr) 18rem;
  margin-bottom: 1.25rem;

  h1 {
    font-size: 2.1rem;
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: .65rem;
  }

  p {
    color: #52606d;
    line-height: 1.5;
    max-width: 56rem;
  }
}

.overline {
  color: var(--learn-accent);
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: 0;
  margin-bottom: .35rem;
  text-transform: uppercase;
}

.progress-card,
.module-card,
.course-overview,
.overview-step,
.path-panel,
.lesson-panel,
.lesson-card {
  background: #ffffff;
  border: 1px solid #d9e2ec;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(16, 42, 67, .06);
}

.progress-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;

  span,
  small {
    color: #627d98;
    font-weight: 700;
  }

  strong {
    font-size: 2rem;
    line-height: 1.1;
  }

  .progress {
    margin: .55rem 0;
  }
}

.module-grid {
  display: grid;
  gap: .75rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 1.25rem;
}

.module-card {
  align-items: flex-start;
  color: #1f2933;
  display: grid;
  gap: .65rem;
  grid-template-columns: 2.35rem minmax(0, 1fr);
  min-height: 8.5rem;
  padding: .85rem;
  text-align: left;
  width: 100%;

  &:hover {
    border-color: #829ab1;
  }

  &.active {
    border-color: var(--learn-accent);
    box-shadow: inset 0 4px 0 var(--learn-accent), 0 8px 18px rgba(16, 42, 67, .08);
  }

  &.complete {
    border-color: #2f855a;
  }

  &.locked {
    color: #829ab1;
    cursor: not-allowed;
    opacity: .72;
  }
}

.module-icon {
  align-items: center;
  background: var(--learn-accent-soft);
  border-radius: 6px;
  color: var(--learn-accent);
  display: inline-flex;
  height: 2.35rem;
  justify-content: center;
  width: 2.35rem;
}

.module-copy {
  min-width: 0;

  strong,
  small {
    display: block;
  }

  strong {
    margin-bottom: .25rem;
  }

  small {
    color: #52606d;
    line-height: 1.35;
  }
}

.module-state {
  color: #334e68;
  font-size: .78rem;
  font-weight: 700;
  grid-column: 2;
  text-transform: uppercase;
}

.course-overview {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
  padding: 1.25rem;
}

.overview-copy {
  align-self: center;

  h2 {
    font-size: 1.65rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: .55rem;
  }

  p {
    color: #52606d;
    line-height: 1.5;
  }
}

.overview-steps {
  display: grid;
  gap: .65rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.overview-step {
  color: #1f2933;
  display: grid;
  font: inherit;
  gap: .2rem;
  grid-template-columns: 2rem minmax(0, 1fr);
  padding: .75rem;
  text-align: left;
  width: 100%;

  span {
    align-items: center;
    background: var(--learn-accent-soft);
    border-radius: 999px;
    color: var(--learn-accent);
    display: inline-flex;
    font-weight: 700;
    grid-row: span 2;
    height: 2rem;
    justify-content: center;
    width: 2rem;
  }

  strong,
  small {
    display: block;
  }

  small {
    color: #627d98;
    font-weight: 700;
  }

  &.complete {
    border-color: #2f855a;
  }

  &.locked {
    color: #829ab1;
    cursor: not-allowed;
    opacity: .72;
  }
}

.lesson-shell {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: minmax(0, 1fr);
  max-width: 1180px;
}

.path-panel,
.lesson-panel {
  padding: 1rem;
}

.path-panel h2 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: .75rem;
}

.path-row {
  align-items: center;
  background: transparent;
  border: 0;
  border-top: 1px solid #edf2f7;
  color: #1f2933;
  cursor: pointer;
  display: grid;
  gap: .65rem;
  grid-template-columns: 2rem minmax(0, 1fr) 1rem;
  padding: .75rem .25rem;
  text-align: left;
  width: 100%;

  &:disabled {
    color: #829ab1;
    cursor: not-allowed;
  }

  &.active {
    background: var(--learn-accent-wash);
    border-radius: 6px;
  }

  strong,
  small {
    display: block;
  }

  small {
    color: #627d98;
    line-height: 1.35;
  }
}

.path-number {
  align-items: center;
  background: #f0f4f8;
  border-radius: 999px;
  display: inline-flex;
  font-weight: 700;
  height: 2rem;
  justify-content: center;
  width: 2rem;
}

.lesson-heading {
  align-items: flex-start;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #edf2f7;

  h2 {
    font-size: 1.65rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: .35rem;
  }

  p {
    color: #52606d;
    line-height: 1.45;
  }
}

.lesson-heading-actions {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  gap: .5rem;
  justify-content: flex-end;

  .button.is-primary {
    background-color: var(--learn-accent);
    border-color: var(--learn-accent);

    &:hover,
    &:focus {
      background-color: var(--learn-accent-dark);
      border-color: var(--learn-accent-dark);
    }
  }
}

.content-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.lesson-card {
  padding: 1rem;

  h3 {
    color: var(--learn-accent-dark);
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: .7rem;
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
    margin-top: .35rem;
  }
}

.app-preview {
  border: 1px solid #d9e2ec;
  border-radius: 6px;
  display: grid;
  grid-template-columns: 6rem minmax(0, 1fr);
  margin-top: .85rem;
  min-height: 13rem;
  overflow: hidden;
}

.preview-nav {
  background: #102a43;
  display: flex;
  flex-direction: column;
  gap: .45rem;
  padding: .7rem .55rem;

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

.preview-canvas {
  background:
    linear-gradient(90deg, rgba(16, 42, 67, .1) 1px, transparent 1px),
    linear-gradient(0deg, rgba(16, 42, 67, .1) 1px, transparent 1px),
    linear-gradient(135deg, var(--learn-accent-soft), #f8fafc);
  background-size: 2rem 2rem, 2rem 2rem, cover;
  min-height: 13rem;
  overflow: hidden;
  position: relative;
}

.preview-canvas::after {
  border: 2px solid rgba(16, 42, 67, .12);
  border-radius: 50%;
  content: '';
  height: 8rem;
  position: absolute;
  right: -2rem;
  top: 1.5rem;
  width: 8rem;
}

.preview-marker {
  align-items: center;
  background: #ffffff;
  border: 1px solid rgba(16, 42, 67, .16);
  border-radius: 999px;
  box-shadow: 0 4px 10px rgba(16, 42, 67, .12);
  color: var(--learn-accent-dark);
  display: inline-flex;
  font-size: .7rem;
  font-weight: 700;
  gap: .3rem;
  max-width: 8rem;
  padding: .3rem .5rem;
  position: absolute;
  transform: translate(-10%, -10%);
  white-space: nowrap;
  z-index: 1;
}

.media-preview .preview-canvas,
.web-preview .preview-canvas {
  background: linear-gradient(135deg, #edf2ff, #e8f7f0);
}

.notes-preview .preview-canvas,
.resources-preview .preview-canvas {
  background: linear-gradient(135deg, #fff7ed, #e8f7f0);
}

.chat-preview .preview-canvas,
.email-preview .preview-canvas,
.command-preview .preview-canvas {
  background: linear-gradient(135deg, #e6f4ff, #fff4e6);
}

.settings-preview .preview-canvas,
.dev-preview .preview-canvas,
.learn-preview .preview-canvas,
.activity-preview .preview-canvas {
  background: linear-gradient(135deg, #f8fafc, #e6fffa);
}

.evidence-label {
  color: #52606d;
  display: block;
  font-size: .85rem;
  font-weight: 700;
  margin: .9rem 0 .35rem;
}

.quiz-question {
  border-top: 1px solid #edf2f7;
  padding: .8rem 0;

  &:first-of-type {
    border-top: 0;
    padding-top: 0;
  }

  p {
    font-weight: 600;
    margin-bottom: .55rem;
  }
}

.answer-note {
  color: #2f855a;
  display: block;
  line-height: 1.35;
}

.score-row {
  align-items: center;
  background: var(--learn-accent-soft);
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
    font-size: 1.35rem;
  }
}

.lesson-actions {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  justify-content: space-between;
  margin-top: 1rem;

  .button.is-primary {
    background-color: var(--learn-accent);
    border-color: var(--learn-accent);

    &:hover,
    &:focus {
      background-color: var(--learn-accent-dark);
      border-color: var(--learn-accent-dark);
    }
  }
}

.completion-hint {
  color: #627d98;
  font-size: .9rem;
  margin-top: .75rem;
}

@media screen and (max-width: 1180px) {
  .module-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .lesson-shell {
    grid-template-columns: 1fr;
  }

  .path-panel {
    display: grid;
    gap: .65rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    h2 {
      grid-column: 1 / -1;
    }
  }
}

@media screen and (max-width: 900px) {
  .learn-page {
    padding: 1rem;
  }

  .learn-hero,
  .course-overview,
  .content-grid {
    grid-template-columns: 1fr;
  }

  .module-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lesson-heading {
    display: block;

    .button {
      margin-top: .75rem;
    }
  }
}

@media screen and (max-width: 640px) {
  .module-grid,
  .overview-steps,
  .path-panel {
    grid-template-columns: 1fr;
  }

  .module-card {
    min-height: auto;
  }

  .app-preview {
    grid-template-columns: 1fr;
  }

  .preview-nav {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .lesson-actions {
    display: block;

    .button {
      margin-bottom: .5rem;
      width: 100%;
    }
  }
}
</style>
