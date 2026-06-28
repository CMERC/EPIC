<template>
  <div class="timeline-page"
       :class="{'has-detail': Boolean(selectedItem)}"
       @click.stop>
    <section class="timeline-hero">
      <div>
        <p class="overline">Exercise Timeline</p>
        <h1 class="timeline-title"
            :title="lifecycleTitle">{{ lifecycleTitle }}</h1>
        <p class="subtitle is-6">MSEL control, live exercise activity, and AAR evidence in one operational view.</p>
      </div>
      <div class="timeline-stats">
        <div>
          <span>{{ visibleItems.length }}</span>
          <small>Shown</small>
        </div>
        <div>
          <span>{{ flaggedItems.length }}</span>
          <small>AAR Flags</small>
        </div>
        <div>
          <span>{{ lateItems.length }}</span>
          <small>Late</small>
        </div>
      </div>
    </section>

    <section v-if="lifecycleSummary"
             class="lifecycle-strip">
      <div class="lifecycle-primary">
        <span class="status-pill"
              :class="statusClass">{{ lifecycleSummary.status }}</span>
        <strong>{{ lifecycleSummary.workspaceDisplayName || lifecycleSummary.workspaceName || 'Workspace' }}</strong>
        <small v-if="lifecycleSummary.start">{{ formatDateTime(lifecycleSummary.start) }}</small>
      </div>
      <div class="lifecycle-counts">
        <div v-for="metric in lifecycleMetrics"
             :key="metric.label">
          <span>{{ metric.value }}</span>
          <small>{{ metric.label }}</small>
        </div>
      </div>
    </section>

    <section class="timeline-controls">
      <div class="control-row">
        <div class="segmented-control"
             aria-label="Timeline mode">
          <button v-for="mode in modes"
                  :key="mode.value"
                  type="button"
                  :class="{'is-active': activeMode === mode.value}"
                  @click="activeMode = mode.value">
            <i :class="mode.icon"></i>
            <span>{{ mode.label }}</span>
          </button>
        </div>

        <div class="segmented-control"
             aria-label="Role view">
          <button v-for="role in roleViews"
                  :key="role.value"
                  type="button"
                  :class="{'is-active': roleView === role.value}"
                  @click="roleView = role.value">
            <i :class="role.icon"></i>
            <span>{{ role.label }}</span>
          </button>
        </div>

        <div class="toolbar-actions is-primary-actions">
          <button type="button"
                  class="button is-small"
                  @click="jumpToNow">
            <span class="icon is-small"><i class="fas fa-location-arrow"></i></span>
            <span>Now</span>
          </button>
          <button type="button"
                  class="button is-small"
                  :class="{'is-primary': liveMode}"
                  @click="toggleLiveMode">
            <span class="icon is-small"><i :class="liveMode ? 'fas fa-pause' : 'fas fa-play'"></i></span>
            <span>{{ liveMode ? 'Pause' : 'Live' }}</span>
          </button>
          <button type="button"
                  class="button is-small"
                  @click="toggleReplay">
            <span class="icon is-small"><i class="fas fa-history"></i></span>
            <span>{{ replayMode ? 'Stop' : 'Replay' }}</span>
          </button>
          <button type="button"
                  class="button is-small"
                  @click="refreshTimeline">
            <span class="icon is-small"><i class="fas fa-sync-alt"></i></span>
            <span>Refresh</span>
          </button>
          <button type="button"
                  class="button is-small"
                  @click="showAdvancedControls = !showAdvancedControls">
            <span class="icon is-small"><i class="fas fa-sliders-h"></i></span>
            <span>{{ showAdvancedControls ? 'Hide Filters' : 'Filters' }}</span>
          </button>
        </div>
      </div>

      <div v-if="showAdvancedControls"
           class="control-grid">
        <label>
          <span>Exercise</span>
          <select v-model="selectedExerciseId">
            <option value="">Current workspace timeline</option>
            <option v-for="exercise in planEvents"
                    :key="exercise.id"
                    :value="exercise.id">
              {{ exercise.name }}
            </option>
          </select>
        </label>

        <label>
          <span>Range</span>
          <select v-model="rangePreset"
                  @change="applyRangePreset">
            <option value="exercise">Exercise window</option>
            <option value="hour">Last hour</option>
            <option value="today">Today</option>
            <option value="all">Full available timeline</option>
            <option value="custom">Custom</option>
          </select>
        </label>

        <label>
          <span>Start</span>
          <input v-model="customStart"
                 type="datetime-local"
                 @change="rangePreset = 'custom'">
        </label>

        <label>
          <span>End</span>
          <input v-model="customEnd"
                 type="datetime-local"
                 @change="rangePreset = 'custom'">
        </label>

        <label class="search-field">
          <span>Search</span>
          <input v-model.trim="searchText"
                 type="search"
                 placeholder="Keyword, actor, objective, inject #">
        </label>
      </div>

      <div v-if="showAdvancedControls"
           class="source-filters">
        <button v-for="source in sourceOptions"
                :key="source.value"
                type="button"
                class="source-chip"
                :class="{'is-active': selectedSources.includes(source.value)}"
                :style="chipStyle(source)"
                @click="toggleSource(source.value)">
          <span class="source-dot"></span>
          <span>{{ source.label }}</span>
        </button>
      </div>

      <div v-if="showAdvancedControls"
           class="quick-filters">
        <button v-for="filter in quickFilters"
                :key="filter.value"
                type="button"
                :class="{'is-active': activeQuickFilters.includes(filter.value)}"
                @click="toggleQuickFilter(filter.value)">
          <i :class="filter.icon"></i>
          <span>{{ filter.label }}</span>
        </button>
      </div>

      <div v-if="showAdvancedControls"
           class="toolbar-actions">
        <button type="button"
                class="button is-small"
                @click="selectAllSources">
          All Sources
        </button>
        <button type="button"
                class="button is-small"
                @click="exportCsv">
          <span class="icon is-small"><i class="fas fa-file-export"></i></span>
          <span>Export</span>
        </button>
      </div>
    </section>

    <section class="ops-summary">
      <div v-for="card in opsCards"
           :key="card.label"
           :class="card.className">
        <span>{{ card.value }}</span>
        <small>{{ card.label }}</small>
      </div>
    </section>

    <section class="timeline-shell"
             :class="{'is-loading': isLoading}">
      <div class="scroll-controls">
        <button type="button"
                title="Pan timeline left"
                @click="scrollTimeline(-1)">
          <i class="fas fa-chevron-left"></i>
        </button>
        <span>Scroll horizontally to review exercise play</span>
        <button type="button"
                title="Pan timeline right"
                @click="scrollTimeline(1)">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      <div v-if="visibleItems.length"
           ref="timelineScroll"
           class="timeline-scroll">
        <div class="time-axis"
             :style="axisStyle">
          <span v-for="tick in ticks"
                :key="tick.label"
                :style="{ left: tick.left + '%' }">
            {{ tick.label }}
          </span>
          <span class="now-marker"
                :style="{ left: nowLeft + '%' }">
            Now
          </span>
          <span v-if="replayMode"
                class="replay-marker"
                :style="{ left: replayLeft + '%' }">
            Replay
          </span>
        </div>

        <div v-for="lane in lanes"
             :key="lane.name"
             class="timeline-lane">
          <div class="lane-label">
            <strong>{{ lane.name }}</strong>
            <span>{{ lane.items.length }} items</span>
          </div>
          <div class="lane-track"
               :style="axisStyle">
            <button v-for="item in lane.items"
                    :key="item.id"
                    type="button"
                    class="timeline-item"
                    :class="itemClasses(item)"
                    :style="itemStyle(item)"
                    @click="selectItem(item)">
              <span class="item-meta">
                <span class="item-time">{{ formatTime(item.start) }}</span>
                <span v-if="item.releaseStatus"
                      class="mini-pill">{{ item.releaseStatus }}</span>
              </span>
              <span class="item-title">{{ item.title }}</span>
              <span v-if="childCount(item)"
                    class="item-related">{{ childCount(item) }} related</span>
            </button>
          </div>
        </div>
      </div>

      <div v-else
           class="timeline-empty">
        <span class="icon is-large">
          <i class="fas fa-stream fa-2x"></i>
        </span>
        <h2 class="title is-5">{{ emptyTitle }}</h2>
        <p>{{ emptyMessage }}</p>
      </div>
    </section>

    <aside v-if="selectedItem"
           class="timeline-detail"
           aria-label="Timeline item details">
      <header>
        <div>
          <p class="overline">{{ selectedItem.lane }}</p>
          <h2 class="title is-4">{{ selectedItem.title }}</h2>
          <p>{{ formatDateTime(selectedItem.start) }}</p>
        </div>
        <button type="button"
                class="icon-button"
                title="Close details"
                @click="selectedItem = null">
          <i class="fas fa-times"></i>
        </button>
      </header>

      <div class="detail-actions">
        <button type="button"
                class="button is-small"
                :class="{'is-primary': isFlagged(selectedItem)}"
                @click="toggleAarFlag(selectedItem)">
          <span class="icon is-small"><i class="fas fa-flag"></i></span>
          <span>{{ isFlagged(selectedItem) ? 'Flagged For AAR' : 'Flag For AAR' }}</span>
        </button>
        <button type="button"
                class="button is-small"
                @click="captureObservation">
          <span class="icon is-small"><i class="fas fa-clipboard-check"></i></span>
          <span>Capture Observation</span>
        </button>
        <button v-if="selectedItem.routePath"
                type="button"
                class="button is-small"
                @click="openSelectedItem">
          <span class="icon is-small"><i class="fas fa-arrow-right"></i></span>
          <span>Open Source</span>
        </button>
        <button v-if="selectedItem.mapPath"
                type="button"
                class="button is-small"
                @click="$router.push(selectedItem.mapPath)">
          <span class="icon is-small"><i class="fas fa-map-marked-alt"></i></span>
          <span>View Map</span>
        </button>
      </div>

      <p v-if="selectedItem.summary"
         class="detail-summary">{{ selectedItem.summary }}</p>

      <section class="detail-grid">
        <div v-for="field in visibleDetailFields"
             :key="field.label">
          <small>{{ field.label }}</small>
          <strong>{{ field.value }}</strong>
        </div>
      </section>

      <section v-if="selectedItem.expectedAction"
               class="detail-section">
        <h3>Expected Action</h3>
        <p>{{ selectedItem.expectedAction }}</p>
      </section>

      <section v-if="selectedItem.objective"
               class="detail-section">
        <h3>Objective</h3>
        <p>{{ selectedItem.objective }}</p>
      </section>

      <section v-if="relatedItems.length"
               class="detail-section">
        <h3>Related Activity</h3>
        <button v-for="item in relatedItems"
                :key="item.id"
                type="button"
                class="related-row"
                @click="selectItem(item)">
          <span>{{ item.title }}</span>
          <small>{{ item.source }} · {{ formatTime(item.start) }}</small>
        </button>
      </section>

      <section class="detail-section">
        <h3>AAR Tags</h3>
        <div class="aar-tags">
          <button v-for="tag in aarTags"
                  :key="tag"
                  type="button"
                  :class="{'is-active': selectedItemTags.includes(tag)}"
                  @click="toggleAarTag(tag)">
            {{ tag }}
          </button>
        </div>
      </section>
    </aside>
  </div>
</template>

<script>
import moment from 'moment'
import { ExerciseTimelineItems } from '@/timeline/graphql/Timeline.gql'
import { CurrentExerciseLifecycle } from '@/timeline/graphql/ExerciseLifecycle.gql'
import { PlanEventsList } from '@/plan/graphql/PlanEvents.gql'

const SOURCE_OPTIONS = [
  { value: 'PLAN_EVENT', label: 'Events', accent: '#38bdf8' },
  { value: 'PLAN_INJECT', label: 'Injects', accent: '#f59e0b' },
  { value: 'COMMAND', label: 'Commands', accent: '#ef4444' },
  { value: 'OBSERVE', label: 'Observe', accent: '#22c55e' },
  { value: 'MEDIA', label: 'Media', accent: '#8b5cf6' },
  { value: 'CHAT', label: 'Chat', accent: '#14b8a6' }
]

const AAR_STORAGE_KEY = 'epic.timeline.aarFlags'

export default {
  name: 'TimelineHome',
  apollo: {
    lifecycleSummary: {
      query: CurrentExerciseLifecycle,
      update(data) {
        return data.currentExerciseLifecycle
      },
      error(error) {
        console.error(error)
      }
    },
    planEvents: {
      query: PlanEventsList,
      variables() {
        return {
          first: 50,
          orderBy: 'startDate_ASC'
        }
      },
      update(data) {
        return data.planEvents || []
      },
      error(error) {
        console.error(error)
      }
    },
    timelineItems: {
      query: ExerciseTimelineItems,
      variables() {
        return {
          exerciseId: this.selectedExerciseId || null,
          sources: this.selectedSources,
          start: this.queryStart,
          end: this.queryEnd,
          first: 240
        }
      },
      update(data) {
        return data.exerciseTimelineItems || []
      },
      error(error) {
        console.error(error)
      }
    }
  },
  data() {
    return {
      timelineItems: [],
      lifecycleSummary: null,
      planEvents: [],
      selectedExerciseId: '',
      selectedSources: SOURCE_OPTIONS.map(source => source.value),
      selectedItem: null,
      sourceOptions: SOURCE_OPTIONS,
      activeMode: 'live',
      roleView: 'controller',
      rangePreset: 'exercise',
      customStart: '',
      customEnd: '',
      searchText: '',
      activeQuickFilters: [],
      liveMode: false,
      replayMode: false,
      replayTime: Date.now(),
      replayTimer: null,
      liveTimer: null,
      showAdvancedControls: false,
      now: Date.now(),
      aarFlags: {},
      modes: [
        { value: 'planning', label: 'Planning', icon: 'fas fa-drafting-compass' },
        { value: 'live', label: 'Live', icon: 'fas fa-broadcast-tower' },
        { value: 'hotwash', label: 'Hot Wash', icon: 'fas fa-clipboard-list' }
      ],
      roleViews: [
        { value: 'controller', label: 'Controller', icon: 'fas fa-user-shield' },
        { value: 'evaluator', label: 'Evaluator', icon: 'fas fa-clipboard-check' },
        { value: 'player', label: 'Player', icon: 'fas fa-users' },
        { value: 'leadership', label: 'Leadership', icon: 'fas fa-chart-line' }
      ],
      quickFilters: [
        { value: 'key', label: 'Key Events', icon: 'fas fa-star' },
        { value: 'late', label: 'Late', icon: 'fas fa-clock' },
        { value: 'flagged', label: 'AAR Flagged', icon: 'fas fa-flag' },
        { value: 'pending', label: 'Pending', icon: 'fas fa-hourglass-half' }
      ],
      aarTags: ['Strength', 'Issue', 'Decision', 'Delay', 'Missed Expected Action', 'Safety Concern', 'Corrective Action']
    }
  },
  computed: {
    selectedExercise() {
      return (this.planEvents || []).find(event => event.id === this.selectedExerciseId)
    },
    queryStart() {
      if (this.rangePreset === 'all') return null
      if (this.rangePreset === 'hour') return moment().subtract(1, 'hour').toDate()
      if (this.rangePreset === 'today') return moment().startOf('day').toDate()
      if (this.rangePreset === 'custom') return this.customStart ? moment(this.customStart).toDate() : null
      return this.selectedExercise && this.selectedExercise.startDate ? this.selectedExercise.startDate : null
    },
    queryEnd() {
      if (this.rangePreset === 'all') return null
      if (this.rangePreset === 'hour' || this.rangePreset === 'today') return moment().toDate()
      if (this.rangePreset === 'custom') return this.customEnd ? moment(this.customEnd).toDate() : null
      return this.selectedExercise && this.selectedExercise.endDate ? this.selectedExercise.endDate : null
    },
    filteredItems() {
      const query = this.searchText.toLowerCase()
      return (this.timelineItems || [])
        .filter(item => this.selectedSources.includes(item.source))
        .filter(item => item.start)
        .filter(item => this.matchesRoleView(item))
        .filter(item => this.matchesMode(item))
        .filter(item => this.matchesQuickFilters(item))
        .filter(item => {
          if (!query) return true
          return [
            item.title,
            item.summary,
            item.actor,
            item.status,
            item.category,
            item.releaseStatus,
            item.objective,
            item.expectedAction,
            item.controller,
            item.recipient,
            item.parentTitle,
            item.metadata && item.metadata.number
          ].filter(Boolean).join(' ').toLowerCase().includes(query)
        })
    },
    visibleItems() {
      if (!this.replayMode) return this.filteredItems
      return this.filteredItems.filter(item => new Date(item.start).getTime() <= this.replayTime)
    },
    lanes() {
      const groups = this.visibleItems.reduce((result, item) => {
        const lane = this.laneForItem(item)
        if (!result[lane]) result[lane] = []
        result[lane].push(item)
        return result
      }, {})

      return Object.keys(groups).map(name => ({
        name,
        items: groups[name].sort((a, b) => new Date(a.start) - new Date(b.start))
      }))
    },
    minTime() {
      if (!this.filteredItems.length) return Date.now()
      return Math.min(...this.filteredItems.map(item => new Date(item.start).getTime()))
    },
    maxTime() {
      if (!this.filteredItems.length) return Date.now()
      return Math.max(...this.filteredItems.map(item => new Date(item.end || item.start).getTime()))
    },
    timeRange() {
      return Math.max(this.maxTime - this.minTime, 60 * 60 * 1000)
    },
    axisWidth() {
      return Math.max(2400, this.filteredItems.length * 90)
    },
    axisStyle() {
      return {
        width: `${this.axisWidth}px`
      }
    },
    ticks() {
      if (!this.filteredItems.length) return []
      const count = 7
      return Array.from({ length: count }).map((value, index) => {
        const ratio = count === 1 ? 0 : index / (count - 1)
        const tick = this.minTime + this.timeRange * ratio
        return {
          left: ratio * 100,
          label: moment(tick).format('MMM D HH:mm')
        }
      })
    },
    nowLeft() {
      return this.clampedPercent((this.now - this.minTime) / this.timeRange)
    },
    replayLeft() {
      return this.clampedPercent((this.replayTime - this.minTime) / this.timeRange)
    },
    lifecycleTitle() {
      if (this.selectedExercise) return this.selectedExercise.name
      return this.lifecycleSummary && this.lifecycleSummary.name ? this.lifecycleSummary.name : 'Operational timeline'
    },
    statusClass() {
      return this.lifecycleSummary
        ? `is-${String(this.lifecycleSummary.status).toLowerCase().replace(/_/g, '-')}`
        : ''
    },
    lifecycleMetrics() {
      const counts = this.lifecycleSummary && this.lifecycleSummary.counts ? this.lifecycleSummary.counts : {}
      return [
        { label: 'Events', value: counts.events || 0 },
        { label: 'Injects', value: counts.injects || 0 },
        { label: 'Commands', value: counts.commands || 0 },
        { label: 'Observe', value: counts.observations || 0 },
        { label: 'Media', value: counts.mediaPosts || 0 },
        { label: 'Chat', value: counts.chatMessages || 0 }
      ]
    },
    lateItems() {
      return this.filteredItems.filter(item => this.isLate(item))
    },
    flaggedItems() {
      return this.filteredItems.filter(item => this.isFlagged(item))
    },
    pendingItems() {
      return this.filteredItems.filter(item => this.isPending(item))
    },
    opsCards() {
      return [
        { label: 'Pending MSEL', value: this.pendingItems.length, className: 'is-pending' },
        { label: 'Late/Unresolved', value: this.lateItems.length, className: 'is-late' },
        { label: 'Key Events', value: this.filteredItems.filter(item => item.keyEvent).length, className: 'is-key' },
        { label: 'AAR Evidence', value: this.flaggedItems.length, className: 'is-aar' }
      ]
    },
    relatedItems() {
      if (!this.selectedItem) return []
      return this.filteredItems.filter(item => {
        if (item.id === this.selectedItem.id) return false
        return item.parentId === this.selectedItem.id || this.selectedItem.parentId === item.id || item.parentId === this.selectedItem.parentId
      })
    },
    detailFields() {
      if (!this.selectedItem) return []
      return [
        { label: 'Category', value: this.selectedItem.category },
        { label: 'Status', value: this.selectedItem.releaseStatus || this.selectedItem.status },
        { label: 'Visibility', value: this.selectedItem.visibility },
        { label: 'Controller', value: this.selectedItem.controller },
        { label: 'Recipient', value: this.selectedItem.recipient },
        { label: 'Actor', value: this.selectedItem.actor },
        { label: 'Parent', value: this.selectedItem.parentTitle },
        { label: 'Planned', value: this.selectedItem.plannedTime ? this.formatDateTime(this.selectedItem.plannedTime) : null },
        { label: 'Actual', value: this.selectedItem.actualTime ? this.formatDateTime(this.selectedItem.actualTime) : null }
      ]
    },
    visibleDetailFields() {
      return this.detailFields.filter(field => field.value)
    },
    selectedItemTags() {
      if (!this.selectedItem || !this.aarFlags[this.selectedItem.id]) return []
      return this.aarFlags[this.selectedItem.id].tags || []
    },
    isLoading() {
      return Boolean(this.$apollo.queries.timelineItems && this.$apollo.queries.timelineItems.loading)
    },
    emptyTitle() {
      if (this.searchText || this.activeQuickFilters.length) return 'No matching timeline items'
      return 'No timeline items yet'
    },
    emptyMessage() {
      if (this.selectedExerciseId) return 'Try a wider date range or fewer filters for this exercise.'
      return 'As exercise activity is created, it will appear here grouped by source.'
    }
  },
  watch: {
    visibleItems(items) {
      if (!items.length) {
        this.selectedItem = null
      } else if (this.selectedItem && !items.find(item => item.id === this.selectedItem.id)) {
        this.selectedItem = null
      }
    },
    selectedExercise(exercise) {
      if (exercise && this.rangePreset === 'exercise') {
        this.customStart = this.toInputDate(exercise.startDate)
        this.customEnd = this.toInputDate(exercise.endDate)
      }
    },
    activeMode(value) {
      this.selectedItem = null
      if (value === 'live' && !this.liveMode) this.toggleLiveMode()
      if (value !== 'live' && this.liveMode) this.toggleLiveMode()
    },
    roleView() {
      this.selectedItem = null
    },
    selectedSources() {
      this.selectedItem = null
    },
    activeQuickFilters() {
      this.selectedItem = null
    }
  },
  mounted() {
    this.loadAarFlags()
    this.nowTimer = setInterval(() => {
      this.now = Date.now()
    }, 30000)
  },
  beforeDestroy() {
    clearInterval(this.nowTimer)
    clearInterval(this.liveTimer)
    clearInterval(this.replayTimer)
  },
  methods: {
    toggleSource(source) {
      if (this.selectedSources.includes(source)) {
        this.selectedSources = this.selectedSources.filter(item => item !== source)
      } else {
        this.selectedSources = [...this.selectedSources, source]
      }
    },
    selectAllSources() {
      this.selectedSources = SOURCE_OPTIONS.map(source => source.value)
    },
    toggleQuickFilter(filter) {
      if (this.activeQuickFilters.includes(filter)) {
        this.activeQuickFilters = this.activeQuickFilters.filter(item => item !== filter)
      } else {
        this.activeQuickFilters = [...this.activeQuickFilters, filter]
      }
    },
    refreshTimeline() {
      if (this.$apollo.queries.timelineItems) {
        this.$apollo.queries.timelineItems.refetch()
      }
    },
    applyRangePreset() {
      if (this.rangePreset === 'exercise' && this.selectedExercise) {
        this.customStart = this.toInputDate(this.selectedExercise.startDate)
        this.customEnd = this.toInputDate(this.selectedExercise.endDate)
      }
    },
    toggleLiveMode() {
      this.liveMode = !this.liveMode
      clearInterval(this.liveTimer)
      if (this.liveMode) {
        this.refreshTimeline()
        this.liveTimer = setInterval(this.refreshTimeline, 30000)
      }
    },
    toggleReplay() {
      this.replayMode = !this.replayMode
      clearInterval(this.replayTimer)
      if (this.replayMode) {
        this.replayTime = this.minTime
        this.replayTimer = setInterval(() => {
          const step = Math.max(this.timeRange / 80, 60000)
          this.replayTime = Math.min(this.replayTime + step, this.maxTime)
          if (this.replayTime >= this.maxTime) clearInterval(this.replayTimer)
        }, 650)
      }
    },
    jumpToNow() {
      this.now = Date.now()
      this.$nextTick(() => {
        if (this.$refs.timelineScroll) {
          this.$refs.timelineScroll.scrollLeft = Math.max(0, (this.nowLeft / 100) * this.axisWidth - 360)
        }
      })
    },
    scrollTimeline(direction) {
      this.$nextTick(() => {
        if (this.$refs.timelineScroll) {
          this.$refs.timelineScroll.scrollBy({
            left: direction * Math.max(420, this.$refs.timelineScroll.clientWidth * 0.65),
            behavior: 'smooth'
          })
        }
      })
    },
    selectItem(item) {
      this.selectedItem = item
    },
    chipStyle(source) {
      return {
        '--timeline-accent': source.accent
      }
    },
    itemStyle(item) {
      const start = new Date(item.start).getTime()
      const end = new Date(item.end || item.start).getTime()
      const left = ((start - this.minTime) / this.timeRange) * 100
      const width = Math.max(((end - start) / this.timeRange) * 100, 6)

      return {
        '--timeline-accent': item.accent || '#38bdf8',
        left: `${Math.min(Math.max(left, 0), 96)}%`,
        width: `${Math.min(width, 30)}%`
      }
    },
    itemClasses(item) {
      return {
        'is-selected': this.selectedItem && this.selectedItem.id === item.id,
        'is-flagged': this.isFlagged(item),
        'is-late': this.isLate(item),
        'is-key': item.keyEvent
      }
    },
    laneForItem(item) {
      if (this.activeMode === 'hotwash' && this.isFlagged(item)) return 'AAR Evidence'
      if (this.roleView === 'leadership' && item.keyEvent) return 'Key Events'
      return item.lane
    },
    childCount(item) {
      return this.filteredItems.filter(child => child.parentId === item.id).length
    },
    matchesMode(item) {
      if (this.activeMode === 'planning') return ['PLAN_EVENT', 'PLAN_INJECT'].includes(item.source)
      if (this.activeMode === 'hotwash') return this.isFlagged(item) || ['OBSERVE', 'COMMAND', 'MEDIA'].includes(item.source)
      return true
    },
    matchesRoleView(item) {
      if (this.roleView === 'controller') return true
      const visibility = String(item.visibility || '').toLowerCase()
      if (this.roleView === 'player') return visibility.includes('player') || visibility.includes('participant') || item.source === 'COMMAND'
      if (this.roleView === 'evaluator') return ['PLAN_INJECT', 'OBSERVE', 'COMMAND', 'MEDIA'].includes(item.source)
      if (this.roleView === 'leadership') return item.keyEvent || this.isLate(item) || this.isFlagged(item) || ['PLAN_EVENT', 'COMMAND'].includes(item.source)
      return true
    },
    matchesQuickFilters(item) {
      if (!this.activeQuickFilters.length) return true
      return this.activeQuickFilters.every(filter => {
        if (filter === 'key') return item.keyEvent
        if (filter === 'late') return this.isLate(item)
        if (filter === 'flagged') return this.isFlagged(item)
        if (filter === 'pending') return this.isPending(item)
        return true
      })
    },
    isLate(item) {
      const status = String(item.releaseStatus || item.status || '').toLowerCase()
      const planned = item.plannedTime || item.start
      if (!planned) return false
      return new Date(planned).getTime() < Date.now() && ['planned', 'pending', 'due', 'sent', 'in_progress'].includes(status)
    },
    isPending(item) {
      const status = String(item.releaseStatus || item.status || '').toLowerCase()
      return ['planned', 'pending', 'due', 'draft', 'sent', 'in_progress'].includes(status)
    },
    isFlagged(item) {
      return Boolean(item && this.aarFlags[item.id])
    },
    toggleAarFlag(item) {
      if (!item) return
      const flags = { ...this.aarFlags }
      if (flags[item.id]) {
        delete flags[item.id]
      } else {
        flags[item.id] = {
          id: item.id,
          source: item.source,
          title: item.title,
          tags: ['Issue'],
          flaggedAt: new Date().toISOString()
        }
      }
      this.aarFlags = flags
      this.saveAarFlags()
    },
    toggleAarTag(tag) {
      if (!this.selectedItem) return
      if (!this.aarFlags[this.selectedItem.id]) {
        this.toggleAarFlag(this.selectedItem)
      }
      const flags = { ...this.aarFlags }
      const current = flags[this.selectedItem.id] || { tags: [] }
      const tags = current.tags || []
      flags[this.selectedItem.id] = {
        ...current,
        tags: tags.includes(tag) ? tags.filter(item => item !== tag) : [...tags, tag]
      }
      this.aarFlags = flags
      this.saveAarFlags()
    },
    loadAarFlags() {
      try {
        this.aarFlags = JSON.parse(localStorage.getItem(AAR_STORAGE_KEY) || '{}')
      } catch (error) {
        this.aarFlags = {}
      }
    },
    saveAarFlags() {
      localStorage.setItem(AAR_STORAGE_KEY, JSON.stringify(this.aarFlags))
    },
    captureObservation() {
      if (!this.selectedItem) return
      const text = encodeURIComponent(`Observation related to ${this.selectedItem.title}`)
      this.$router.push(`/observe/post?timeline=${this.selectedItem.id}&text=${text}`)
    },
    openSelectedItem() {
      if (this.selectedItem && this.selectedItem.routePath) {
        this.$router.push(this.selectedItem.routePath)
      }
    },
    exportCsv() {
      const columns = ['time', 'source', 'title', 'category', 'status', 'actor', 'controller', 'recipient', 'objective', 'expectedAction', 'aarTags']
      const rows = this.visibleItems.map(item => columns.map(column => {
        if (column === 'time') return this.formatDateTime(item.start)
        if (column === 'aarTags') return this.aarFlags[item.id] ? (this.aarFlags[item.id].tags || []).join('; ') : ''
        return item[column] || ''
      }))
      const csv = [columns, ...rows]
        .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(','))
        .join('\r\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `epic-timeline-${moment().format('YYYYMMDD-HHmm')}.csv`
      link.click()
      URL.revokeObjectURL(url)
    },
    clampedPercent(value) {
      return Math.min(Math.max(value * 100, 0), 100)
    },
    formatTime(value) {
      return moment(value).format('HH:mm')
    },
    formatDateTime(value) {
      return moment(value).format('MMM D, YYYY HH:mm')
    },
    toInputDate(value) {
      if (!value) return ''
      return moment(value).format('YYYY-MM-DDTHH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
.timeline-page {
  min-height: calc(100vh - 3.75rem);
  padding: 1.25rem;
  background: var(--epic-bg);
  color: var(--epic-text);
}

.timeline-hero,
.lifecycle-strip,
.timeline-controls,
.timeline-shell,
.timeline-detail,
.ops-summary > div {
  background: var(--epic-surface-raised);
  border: 1px solid var(--epic-border);
  border-radius: var(--epic-radius-lg);
  box-shadow: var(--epic-shadow-sm);
}

.timeline-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1.25rem;

  .title,
  .subtitle {
    color: var(--epic-text);
    margin-bottom: 0.25rem;
  }

  .subtitle {
    color: var(--epic-muted);
  }

  > div:first-child {
    min-width: 0;
  }
}

.timeline-title {
  display: block;
  max-width: min(58rem, 62vw);
  margin: 0 0 0.25rem;
  color: var(--epic-text);
  font-size: clamp(1.3rem, 1.8vw, 1.85rem);
  font-weight: 900;
  line-height: 1.16;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.overline {
  color: var(--epic-accent-strong);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0;
  margin-bottom: 0.35rem;
  text-transform: uppercase;
}

.timeline-stats,
.lifecycle-counts,
.ops-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.timeline-stats div,
.lifecycle-counts div,
.ops-summary > div {
  min-width: 5.75rem;
  padding: 0.65rem 0.8rem;
  background: var(--epic-surface-subtle);
  border: 1px solid var(--epic-border);
  border-radius: var(--epic-radius-md);

  span,
  small {
    display: block;
  }

  span {
    color: var(--epic-text);
    font-weight: 900;
  }

  small {
    color: var(--epic-muted);
    font-size: 0.72rem;
    font-weight: 800;
  }
}

.lifecycle-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
}

.lifecycle-primary {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.65rem;

  small {
    color: var(--epic-muted);
    font-weight: 700;
  }
}

.status-pill,
.mini-pill {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--epic-border);
  border-radius: 999px;
  color: var(--epic-accent-strong);
  font-weight: 900;
}

.status-pill {
  min-height: 1.8rem;
  padding: 0 0.7rem;
  background: var(--epic-accent-soft);
  font-size: 0.72rem;
}

.mini-pill {
  max-width: 6.5rem;
  padding: 0 0.45rem;
  background: var(--epic-surface-subtle);
  color: var(--epic-muted);
  font-size: 0.64rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.timeline-controls {
  display: grid;
  gap: 0.65rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
}

.control-row,
.toolbar-actions,
.source-filters,
.quick-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.control-row {
  align-items: center;
  justify-content: space-between;
}

.segmented-control {
  display: inline-flex;
  gap: 0.25rem;
  padding: 0.25rem;
  background: var(--epic-surface-subtle);
  border: 1px solid var(--epic-border);
  border-radius: var(--epic-radius-md);

  button {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-height: 2rem;
    padding: 0 0.6rem;
    background: transparent;
    border: 0;
    border-radius: var(--epic-radius-sm);
    color: var(--epic-muted);
    cursor: pointer;
    font-weight: 800;

    &.is-active {
      background: var(--epic-surface-raised);
      color: var(--epic-text);
      box-shadow: var(--epic-shadow-sm);
    }
  }
}

.is-primary-actions {
  justify-content: flex-end;
}

.control-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(9rem, 1fr));
  gap: 0.75rem;

  label {
    display: grid;
    gap: 0.25rem;
  }

  span {
    color: var(--epic-muted);
    font-size: 0.72rem;
    font-weight: 900;
    text-transform: uppercase;
  }

  input,
  select {
    width: 100%;
    min-height: 2.35rem;
    padding: 0 0.65rem;
    background: var(--epic-surface);
    border: 1px solid var(--epic-border);
    border-radius: var(--epic-radius-md);
    color: var(--epic-text);
  }
}

.search-field {
  grid-column: span 1;
}

.source-chip,
.quick-filters button {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 2.25rem;
  padding: 0 0.85rem;
  background: var(--epic-surface);
  border: 1px solid var(--epic-border);
  border-radius: 999px;
  color: var(--epic-muted);
  cursor: pointer;
  font-weight: 800;

  &.is-active {
    color: var(--epic-text);
  }
}

.source-chip.is-active {
  background: color-mix(in srgb, var(--timeline-accent) 14%, var(--epic-surface-raised));
  border-color: var(--timeline-accent);
}

.quick-filters button.is-active {
  background: var(--epic-accent-soft);
  border-color: var(--epic-accent);
}

.source-dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: var(--timeline-accent);
}

.ops-summary {
  margin-bottom: 1rem;

  .is-late {
    border-color: rgba(239, 68, 68, 0.45);
  }

  .is-key {
    border-color: rgba(245, 158, 11, 0.45);
  }

  .is-aar {
    border-color: rgba(99, 102, 241, 0.45);
  }
}

.timeline-shell {
  position: relative;
  overflow: hidden;
  min-height: 30rem;

  &.is-loading::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(125, 211, 252, 0.08), transparent);
    animation: timeline-loading 1.4s infinite;
    pointer-events: none;
  }
}

.scroll-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.55rem 0.75rem;
  border-bottom: 1px solid var(--epic-border);
  color: var(--epic-muted);
  font-size: 0.76rem;
  font-weight: 800;

  button {
    display: inline-grid;
    width: 2rem;
    height: 2rem;
    place-items: center;
    background: var(--epic-surface);
    border: 1px solid var(--epic-border);
    border-radius: var(--epic-radius-md);
    color: var(--epic-text);
    cursor: pointer;
  }
}

.timeline-scroll {
  overflow-x: scroll;
  overflow-y: hidden;
  padding: 1.25rem 1.25rem 1.5rem;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
}

.timeline-scroll::-webkit-scrollbar {
  height: 0.8rem;
}

.timeline-scroll::-webkit-scrollbar-track {
  background: var(--epic-surface-subtle);
  border-radius: 999px;
}

.timeline-scroll::-webkit-scrollbar-thumb {
  background: var(--epic-border-strong, var(--epic-border));
  border: 2px solid var(--epic-surface-subtle);
  border-radius: 999px;
}

.time-axis {
  position: relative;
  height: 2.75rem;
  margin-left: 10rem;
  color: var(--epic-muted);
  font-size: 0.78rem;
  font-weight: 800;

  > span {
    position: absolute;
    top: 0.25rem;
    transform: translateX(-50%);
    white-space: nowrap;
  }

  &::before {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0.45rem;
    left: 0;
    height: 1px;
    background: var(--epic-border);
  }
}

.now-marker,
.replay-marker {
  top: 1.2rem !important;
  z-index: 3;
  padding: 0.05rem 0.35rem;
  background: #ef4444;
  border-radius: 999px;
  color: #fff;
  font-size: 0.64rem;
}

.replay-marker {
  background: #6366f1;
}

.timeline-lane {
  display: flex;
  align-items: stretch;
  min-height: 5.75rem;
  border-top: 1px solid var(--epic-border);
}

.lane-label {
  position: sticky;
  left: 0;
  z-index: 4;
  flex: 0 0 10rem;
  padding: 1rem 1rem 1rem 0;
  background: var(--epic-surface-raised);
  color: var(--epic-text);

  strong,
  span {
    display: block;
  }

  span {
    color: var(--epic-muted);
    font-size: 0.78rem;
    font-weight: 800;
    margin-top: 0.2rem;
  }
}

.lane-track {
  position: relative;
  flex: 0 0 auto;
  min-height: 5.75rem;
  background:
    repeating-linear-gradient(
      90deg,
      transparent 0,
      transparent 9.8rem,
      var(--epic-border) 9.85rem,
      transparent 9.9rem
    );
}

.timeline-item {
  position: absolute;
  top: 0.9rem;
  min-width: 10rem;
  max-width: 20rem;
  height: 4rem;
  padding: 0.55rem 0.7rem;
  background: var(--epic-surface);
  border: 1px solid color-mix(in srgb, var(--timeline-accent) 54%, var(--epic-border));
  border-left: 4px solid var(--timeline-accent);
  border-radius: var(--epic-radius-md);
  box-shadow: var(--epic-shadow-sm);
  color: var(--epic-text);
  cursor: pointer;
  overflow: hidden;
  text-align: left;

  &.is-selected {
    border-color: var(--timeline-accent);
    box-shadow: var(--epic-shadow-md);
  }

  &.is-flagged::after,
  &.is-key::after,
  &.is-late::after {
    position: absolute;
    right: 0.4rem;
    bottom: 0.25rem;
    color: var(--epic-muted);
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
  }

  &.is-flagged::after {
    content: '\f024';
    color: #6366f1;
  }

  &.is-key::after {
    content: '\f005';
    color: #f59e0b;
  }

  &.is-late {
    border-color: #ef4444;
  }
}

.item-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
}

.item-time,
.item-title,
.item-related {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-time {
  color: var(--epic-muted);
  font-family: monospace;
  font-size: 0.72rem;
  font-weight: 800;
}

.item-title {
  font-weight: 900;
  margin-top: 0.15rem;
}

.item-related {
  color: var(--epic-muted);
  font-size: 0.68rem;
  font-weight: 800;
}

.timeline-empty {
  display: grid;
  min-height: 30rem;
  place-items: center;
  align-content: center;
  gap: 0.65rem;
  padding: 2rem;
  text-align: center;

  .icon,
  p {
    color: var(--epic-muted);
  }

  .title {
    color: var(--epic-text);
    margin-bottom: 0;
  }
}

.timeline-detail {
  position: fixed;
  top: 4.75rem;
  right: 1rem;
  z-index: 30;
  display: grid;
  gap: 1rem;
  width: min(28rem, calc(100vw - 2rem));
  max-height: calc(100vh - 6rem);
  overflow: auto;
  padding: 1rem;

  header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  .title {
    color: var(--epic-text);
    margin-bottom: 0.25rem;
  }

  p {
    color: var(--epic-muted);
  }
}

.icon-button {
  display: inline-grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  background: var(--epic-surface);
  border: 1px solid var(--epic-border);
  border-radius: var(--epic-radius-md);
  color: var(--epic-text);
  cursor: pointer;
}

.detail-actions,
.aar-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.detail-summary,
.detail-section {
  margin: 0;
  padding: 0.85rem;
  background: var(--epic-surface-subtle);
  border: 1px solid var(--epic-border);
  border-radius: var(--epic-radius-md);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;

  div {
    padding: 0.7rem;
    background: var(--epic-surface-subtle);
    border: 1px solid var(--epic-border);
    border-radius: var(--epic-radius-md);
  }

  small,
  strong {
    display: block;
  }

  small {
    color: var(--epic-muted);
    font-size: 0.68rem;
    font-weight: 900;
    text-transform: uppercase;
  }

  strong {
    color: var(--epic-text);
  }
}

.detail-section {
  h3 {
    color: var(--epic-text);
    font-size: 0.9rem;
    font-weight: 900;
    margin-bottom: 0.35rem;
  }
}

.related-row {
  display: grid;
  width: 100%;
  gap: 0.1rem;
  margin-top: 0.4rem;
  padding: 0.55rem;
  background: var(--epic-surface);
  border: 1px solid var(--epic-border);
  border-radius: var(--epic-radius-md);
  color: var(--epic-text);
  cursor: pointer;
  text-align: left;

  small {
    color: var(--epic-muted);
  }
}

.aar-tags button {
  padding: 0.35rem 0.55rem;
  background: var(--epic-surface);
  border: 1px solid var(--epic-border);
  border-radius: 999px;
  color: var(--epic-muted);
  cursor: pointer;
  font-size: 0.76rem;
  font-weight: 800;

  &.is-active {
    background: var(--epic-accent-soft);
    border-color: var(--epic-accent);
    color: var(--epic-text);
  }
}

@keyframes timeline-loading {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
}

@media screen and (max-width: 1100px) {
  .timeline-title {
    max-width: 100%;
  }

  .control-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .search-field {
    grid-column: span 2;
  }
}

@media screen and (max-width: 760px) {
  .timeline-page {
    padding: 0.75rem;
  }

  .timeline-hero,
  .lifecycle-strip {
    align-items: stretch;
    flex-direction: column;
  }

  .control-row,
  .is-primary-actions {
    justify-content: flex-start;
  }

  .control-grid {
    grid-template-columns: 1fr;
  }

  .search-field {
    grid-column: span 1;
  }

  .timeline-detail {
    top: 1rem;
  }
}
</style>
